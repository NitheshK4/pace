import asyncio
import logging
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.models import Budget, Project
from app.services.budget_service import BudgetEvaluationService
from app.services.anomaly_service import AnomalyDetectorService

logger = logging.getLogger("pace.worker")

class BackgroundWorker:
    def __init__(self, interval_seconds: int = 60):
        self.interval = interval_seconds
        self._running = False
        self._task = None

    async def start(self):
        self._running = True
        self._task = asyncio.create_task(self._run_loop())
        logger.info(f"Pace background worker started (interval: {self.interval}s).")

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()

    async def _run_loop(self):
        while self._running:
            try:
                await self.run_evaluation_cycle()
            except Exception as e:
                logger.error(f"Error during worker evaluation cycle: {e}")
            await asyncio.sleep(self.interval)

    async def run_evaluation_cycle(self):
        async with AsyncSessionLocal() as db:
            # 1. Evaluate Budgets
            b_stmt = select(Budget).where(Budget.is_active == True)
            b_res = await db.execute(b_stmt)
            budgets = b_res.scalars().all()

            for b in budgets:
                try:
                    await BudgetEvaluationService.evaluate_budget(db, b)
                except Exception as e:
                    logger.error(f"Error evaluating budget {b.id}: {e}")

            # 2. Evaluate Anomalies
            p_stmt = select(Project.id)
            p_res = await db.execute(p_stmt)
            project_ids = p_res.scalars().all()

            for pid in project_ids:
                try:
                    anomalies = await AnomalyDetectorService.detect_anomalies(db, pid)
                    for a in anomalies:
                        logger.warning(f"[ANOMALY DETECTED] Project {pid}: {a['explanation']}")
                except Exception as e:
                    logger.error(f"Error detecting anomalies for project {pid}: {e}")
