from datetime import datetime, timedelta, timezone
from typing import List, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.models.models import Budget, UsageEvent, AlertDelivery
from app.services.alert_service import AlertDeliveryService

def calculate_period_bounds(period: str, now: Optional[datetime] = None) -> Tuple[datetime, datetime]:
    now = now or datetime.now(timezone.utc)
    if period == "daily":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=1)
    elif period == "weekly":
        start = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=7)
    elif period == "rolling_24h":
        start = now - timedelta(hours=24)
        end = now
    else:  # monthly
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        # approximate next month
        end = (start + timedelta(days=32)).replace(day=1)
    return start, end

class BudgetEvaluationService:
    @staticmethod
    async def evaluate_budget(db: AsyncSession, budget: Budget) -> List[AlertDelivery]:
        if not budget.is_active:
            return []

        start, end = calculate_period_bounds(budget.period)
        
        # Calculate usage in current period
        stmt = select(
            func.sum(UsageEvent.cost_usd).label("spend"),
            func.sum(UsageEvent.input_tokens + UsageEvent.output_tokens).label("tokens"),
            func.count(UsageEvent.id).label("requests")
        ).where(
            UsageEvent.project_id == budget.project_id,
            UsageEvent.time >= start,
            UsageEvent.time < end
        )
        res = await db.execute(stmt)
        row = res.one_or_none()

        observed_value = 0.0
        if budget.metric == "spend":
            observed_value = float(row.spend or 0.0) if row else 0.0
        elif budget.metric == "tokens":
            observed_value = float(row.tokens or 0) if row else 0.0
        elif budget.metric == "requests":
            observed_value = float(row.requests or 0) if row else 0.0

        limit_value = float(budget.amount_usd)
        if limit_value <= 0:
            return []

        current_percent = (observed_value / limit_value) * 100.0
        thresholds = sorted(budget.thresholds_json or [50, 80, 100, 120])

        new_deliveries = []
        for thresh in thresholds:
            if current_percent >= thresh:
                # Deduplication check: Has an alert for this threshold been delivered in current period?
                dup_stmt = select(AlertDelivery).where(
                    AlertDelivery.budget_id == budget.id,
                    AlertDelivery.threshold_percent == thresh,
                    AlertDelivery.period_start == start
                )
                dup_res = await db.execute(dup_stmt)
                if dup_res.scalar_one_or_none():
                    continue  # Already alerted for this threshold in this period!

                severity = "critical" if thresh >= 100 else ("warning" if thresh >= 80 else "info")

                destinations = budget.destinations_json or [{"type": "console"}]
                for dest in destinations:
                    deliv = await AlertDeliveryService.deliver_alert(
                        db=db,
                        project_id=budget.project_id,
                        budget_id=budget.id,
                        event_type="budget.threshold_breached",
                        threshold_percent=thresh,
                        severity=severity,
                        observed_value=observed_value,
                        limit_value=limit_value,
                        period_start=start,
                        period_end=end,
                        destination=dest
                    )
                    new_deliveries.append(deliv)

        return new_deliveries
