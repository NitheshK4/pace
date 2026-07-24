<?php

namespace PaceApi\Services;

use PDO;

class BudgetService {
    public static function getBudgetStatus(PDO $pdo, string $projectId, float $monthlyCapUsd): array {
        $firstOfMonth = gmdate('Y-m-01\T00:00:00\Z');

        $stmt = $pdo->prepare("
            SELECT SUM(cost_usd) as current_spend
            FROM usage_events
            WHERE project_id = ? AND time >= ?
        ");
        $stmt->execute([$projectId, $firstOfMonth]);
        $spend = (float)($stmt->fetchColumn() ?: 0.0);

        $percentage = $monthlyCapUsd > 0 ? round(($spend / $monthlyCapUsd) * 100.0, 2) : 0.0;
        $isExceeded = $monthlyCapUsd > 0 && $spend >= $monthlyCapUsd;

        return [
            'project_id'       => $projectId,
            'monthly_limit_usd'=> $monthlyCapUsd,
            'current_spend_usd'=> round($spend, 4),
            'percentage_used'  => $percentage,
            'is_exceeded'      => $isExceeded
        ];
    }
}
