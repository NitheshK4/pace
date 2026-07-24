<?php

namespace PaceApi\Services;

use PDO;

class AnomalyDetector {
    public static function detectAnomalies(PDO $pdo, string $projectId): array {
        // Average latency baseline
        $avgStmt = $pdo->prepare("SELECT AVG(latency_ms) FROM usage_events WHERE project_id = ?");
        $avgStmt->execute([$projectId]);
        $avgLatency = (float)($avgStmt->fetchColumn() ?: 0.0);

        // Fetch high-latency anomalies (>= 2x baseline) or status errors
        $anomStmt = $pdo->prepare("
            SELECT event_id, provider, model, latency_ms, cost_usd, status_code, time
            FROM usage_events
            WHERE project_id = ? AND (latency_ms >= ? OR status_code >= 400)
            ORDER BY id DESC LIMIT 20
        ");
        $threshold = max($avgLatency * 2.0, 1000.0);
        $anomStmt->execute([$projectId, $threshold]);
        $rows = $anomStmt->fetchAll();

        $anomalies = [];
        foreach ($rows as $r) {
            $reason = [];
            if ((float)$r['latency_ms'] >= $threshold) {
                $reason[] = "Latency spike ({$r['latency_ms']}ms vs avg {$avgLatency}ms)";
            }
            if ((int)$r['status_code'] >= 400) {
                $reason[] = "HTTP Error {$r['status_code']}";
            }

            $anomalies[] = [
                'event_id'    => $r['event_id'],
                'provider'    => $r['provider'],
                'model'       => $r['model'],
                'latency_ms'  => (int)$r['latency_ms'],
                'cost_usd'    => $r['cost_usd'] !== null ? (float)$r['cost_usd'] : null,
                'status_code' => (int)$r['status_code'],
                'time'        => $r['time'],
                'anomalies'   => $reason
            ];
        }

        return [
            'project_id'       => $projectId,
            'baseline_latency' => round($avgLatency, 2),
            'anomalies_count'  => count($anomalies),
            'items'            => $anomalies
        ];
    }
}
