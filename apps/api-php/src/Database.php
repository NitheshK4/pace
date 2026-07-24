<?php

namespace PaceApi;

use PDO;

class Database {
    private static ?PDO $pdo = null;

    public static function getConnection(): PDO {
        if (self::$pdo === null) {
            $dbPath = getenv('DATABASE_PATH') ?: __DIR__ . '/../pace.db';
            self::$pdo = new PDO("sqlite:" . $dbPath);
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            self::initSchema(self::$pdo);
        }
        return self::$pdo;
    }

    private static function initSchema(PDO $pdo): void {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS project_api_keys (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                key_prefix TEXT NOT NULL,
                key_hash TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS pricing_rates (
                id TEXT PRIMARY KEY,
                provider TEXT NOT NULL,
                model TEXT NOT NULL,
                input_cost_per_1k REAL NOT NULL,
                output_cost_per_1k REAL NOT NULL,
                cache_read_cost_per_1k REAL DEFAULT 0,
                reasoning_cost_per_1k REAL DEFAULT 0,
                effective_from TEXT NOT NULL,
                is_deprecated INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS usage_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id TEXT NOT NULL,
                event_id TEXT NOT NULL,
                time TEXT NOT NULL,
                provider TEXT NOT NULL,
                model TEXT NOT NULL,
                endpoint TEXT,
                input_tokens INTEGER DEFAULT 0,
                output_tokens INTEGER DEFAULT 0,
                cached_input_tokens INTEGER DEFAULT 0,
                reasoning_tokens INTEGER DEFAULT 0,
                cost_usd REAL,
                latency_ms INTEGER DEFAULT 0,
                status_code INTEGER DEFAULT 200,
                metadata_json TEXT,
                created_at TEXT NOT NULL,
                UNIQUE(project_id, event_id)
            );
        ");

        self::seedDefaultPricing($pdo);
    }

    private static function seedDefaultPricing(PDO $pdo): void {
        $rates = [
            ['id' => 'pr_1', 'provider' => 'openai', 'model' => 'gpt-4o', 'input' => 0.00250, 'output' => 0.01000, 'cache' => 0.00125, 'reasoning' => 0.01000],
            ['id' => 'pr_2', 'provider' => 'openai', 'model' => 'gpt-4o-mini', 'input' => 0.00015, 'output' => 0.00060, 'cache' => 0.000075, 'reasoning' => 0.00060],
            ['id' => 'pr_3', 'provider' => 'openai', 'model' => 'o1', 'input' => 0.01500, 'output' => 0.06000, 'cache' => 0.00750, 'reasoning' => 0.06000],
            ['id' => 'pr_4', 'provider' => 'openai', 'model' => 'o3-mini', 'input' => 0.00110, 'output' => 0.00440, 'cache' => 0.00055, 'reasoning' => 0.00440],
            ['id' => 'pr_5', 'provider' => 'anthropic', 'model' => 'claude-3-5-sonnet-20241022', 'input' => 0.00300, 'output' => 0.01500, 'cache' => 0.00030, 'reasoning' => 0.01500],
            ['id' => 'pr_6', 'provider' => 'anthropic', 'model' => 'claude-3-5-haiku-20241022', 'input' => 0.00080, 'output' => 0.00400, 'cache' => 0.00008, 'reasoning' => 0.00400],
            ['id' => 'pr_7', 'provider' => 'anthropic', 'model' => 'claude-3-opus-20240229', 'input' => 0.01500, 'output' => 0.07500, 'cache' => 0.00150, 'reasoning' => 0.07500]
        ];

        $stmt = $pdo->prepare("SELECT COUNT(*) FROM pricing_rates WHERE provider = ? AND model = ?");
        $insert = $pdo->prepare("
            INSERT INTO pricing_rates (id, provider, model, input_cost_per_1k, output_cost_per_1k, cache_read_cost_per_1k, reasoning_cost_per_1k, effective_from, is_deprecated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
        ");

        $now = gmdate('Y-m-d\TH:i:s\Z');

        foreach ($rates as $r) {
            $stmt->execute([$r['provider'], $r['model']]);
            if ($stmt->fetchColumn() == 0) {
                $insert->execute([$r['id'], $r['provider'], $r['model'], $r['input'], $r['output'], $r['cache'], $r['reasoning'], $now]);
            }
        }
    }
}
