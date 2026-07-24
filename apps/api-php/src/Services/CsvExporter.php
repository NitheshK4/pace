<?php

namespace PaceApi\Services;

use PDO;

class CsvExporter {
    public static function exportCsv(PDO $pdo, string $projectId): string {
        $stmt = $pdo->prepare("
            SELECT event_id, time, provider, model, endpoint, input_tokens, output_tokens, cached_input_tokens, reasoning_tokens, cost_usd, latency_ms, status_code
            FROM usage_events
            WHERE project_id = ?
            ORDER BY id DESC
        ");
        $stmt->execute([$projectId]);
        $rows = $stmt->fetchAll();

        $output = fopen('php://temp', 'r+');
        fputcsv($output, [
            'Event ID', 'Time (UTC)', 'Provider', 'Model', 'Endpoint',
            'Input Tokens', 'Output Tokens', 'Cached Tokens', 'Reasoning Tokens',
            'Cost (USD)', 'Latency (ms)', 'Status Code'
        ]);

        foreach ($rows as $r) {
            fputcsv($output, [
                $r['event_id'],
                $r['time'],
                $r['provider'],
                $r['model'],
                $r['endpoint'],
                $r['input_tokens'],
                $r['output_tokens'],
                $r['cached_input_tokens'],
                $r['reasoning_tokens'],
                $r['cost_usd'] !== null ? number_format((float)$r['cost_usd'], 6, '.', '') : 'NULL',
                $r['latency_ms'],
                $r['status_code']
            ]);
        }

        rewind($output);
        $csvString = stream_get_contents($output);
        fclose($output);

        return $csvString;
    }
}
