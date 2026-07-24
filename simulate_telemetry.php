<?php
/**
 * Pace Telemetry Simulator for PHP
 * Usage: php simulate_telemetry.php [count]
 */

require_once __DIR__ . '/packages/php-sdk/src/PaceClient.php';

use Pace\PaceClient;

$endpoint = getenv('PACE_ENDPOINT') ?: 'http://localhost:8000';
$count = isset($argv[1]) ? (int)$argv[1] : 10;

echo "🚀 Pace PHP Telemetry Simulator\n";
echo "Target Endpoint: {$endpoint}\n";
echo "Simulating {$count} events...\n";
echo "--------------------------------------------------\n";

// Fetch active project key from Pace API if credentials exist
$apiKey = getenv('PACE_API_KEY') ?: '';

if (empty($apiKey)) {
    // Attempt auto-login to retrieve key from demo server
    $ch = curl_init("{$endpoint}/v1/auth/login");
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'email' => 'demo@pace.dev',
            'password' => 'PaceDemo123!'
        ]),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 3
    ]);
    $res = curl_exec($ch);
    curl_close($ch);

    $loginData = json_decode((string)$res, true);
    if (isset($loginData['access_token'])) {
        $token = $loginData['access_token'];
        $ch2 = curl_init("{$endpoint}/v1/projects");
        curl_setopt_array($ch2, [
            CURLOPT_HTTPHEADER => ["Authorization: Bearer {$token}"],
            CURLOPT_RETURNTRANSFER => true
        ]);
        $projRes = curl_exec($ch2);
        curl_close($ch2);
        $projects = json_decode((string)$projRes, true);

        if (!empty($projects[0]['id'])) {
            $projectId = $projects[0]['id'];
            $ch3 = curl_init("{$endpoint}/v1/projects/{$projectId}/keys");
            curl_setopt_array($ch3, [
                CURLOPT_HTTPHEADER => ["Authorization: Bearer {$token}"],
                CURLOPT_RETURNTRANSFER => true
            ]);
            $keyRes = curl_exec($ch3);
            curl_close($ch3);
            $keys = json_decode((string)$keyRes, true);
            if (!empty($keys[0]['key_prefix'])) {
                // If demo raw key is not returned, we can generate one or use pace_demo_key
                $apiKey = 'pace_demokey_12345';
            }
        }
    }
}

if (empty($apiKey)) {
    $apiKey = 'pace_demokey_12345';
}

$client = new PaceClient($apiKey, $endpoint);

$models = [
    ['provider' => 'openai', 'model' => 'gpt-4o', 'min_in' => 200, 'max_in' => 2500, 'min_out' => 50, 'max_out' => 800],
    ['provider' => 'openai', 'model' => 'gpt-4o-mini', 'min_in' => 100, 'max_in' => 1200, 'min_out' => 30, 'max_out' => 400],
    ['provider' => 'openai', 'model' => 'o3-mini', 'min_in' => 500, 'max_in' => 3000, 'min_out' => 200, 'max_out' => 1500],
    ['provider' => 'anthropic', 'model' => 'claude-3-5-sonnet-20241022', 'min_in' => 300, 'max_in' => 2000, 'min_out' => 100, 'max_out' => 900]
];

$successCount = 0;

for ($i = 1; $i <= $count; $i++) {
    $m = $models[array_rand($models)];
    $inputTokens = rand($m['min_in'], $m['max_in']);
    $outputTokens = rand($m['min_out'], $m['max_out']);
    $latencyMs = rand(150, 2200);
    $statusCode = (rand(1, 20) === 20) ? 429 : 200; // 5% rate limit rate

    $res = $client->record([
        'provider'      => $m['provider'],
        'model'         => $m['model'],
        'input_tokens'  => $inputTokens,
        'output_tokens' => $outputTokens,
        'latency_ms'    => $latencyMs,
        'status_code'   => $statusCode,
        'metadata'      => [
            'app' => 'php-laravel-backend',
            'environment' => 'production',
            'user_tier' => 'enterprise'
        ]
    ]);

    if (!empty($res['success'])) {
        $successCount++;
        echo "  [{$i}/{$count}] ✅ [{$m['provider']}/{$m['model']}] {$inputTokens} in / {$outputTokens} out | {$latencyMs}ms | Status: {$statusCode}\n";
    } else {
        echo "  [{$i}/{$count}] ⚠️ Failed to ingest event: " . json_encode($res) . "\n";
    }

    usleep(100000); // 100ms pause
}

echo "--------------------------------------------------\n";
echo "🎉 Ingestion Complete: {$successCount}/{$count} PHP events recorded.\n";
