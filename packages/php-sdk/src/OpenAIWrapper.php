<?php

namespace Pace;

/**
 * Helper class for OpenAI and Anthropic PHP integrations with Pace.
 */
class OpenAIWrapper {
    private PaceClient $paceClient;

    public function __construct(PaceClient $paceClient) {
        $this->paceClient = $paceClient;
    }

    /**
     * Creates Guzzle or cURL config options preconfigured to route via Pace Local Proxy.
     *
     * @param string $openAiApiKey Your OpenAI API key
     * @param string $proxyUrl Pace Local Proxy address (default http://127.0.0.1:8787)
     * @return array Guzzle client option array
     */
    public static function createProxyConfig(string $openAiApiKey, string $proxyUrl = 'http://127.0.0.1:8787/v1/'): array {
        return [
            'base_uri' => rtrim($proxyUrl, '/') . '/',
            'headers'  => [
                'Authorization' => 'Bearer ' . $openAiApiKey,
                'Content-Type'  => 'application/json'
            ]
        ];
    }

    /**
     * Utility method to measure an LLM closure execution and record telemetry automatically.
     *
     * @param string $provider Provider name (openai, anthropic)
     * @param string $model Model name (e.g. gpt-4o)
     * @param callable $callable Function performing the LLM request
     * @param array $extraMetadata Extra metadata
     * @return mixed Return value of the callable
     * @throws \Throwable
     */
    public function measureAndRecord(string $provider, string $model, callable $callable, array $extraMetadata = []) {
        $startTime = microtime(true);
        $statusCode = 200;
        $inputTokens = 0;
        $outputTokens = 0;

        try {
            $result = $callable();
            $latencyMs = (int)round((microtime(true) - $startTime) * 1000);

            // Attempt to extract token counts if object structure matches OpenAI or Anthropic responses
            if (is_object($result)) {
                if (isset($result->usage)) {
                    $inputTokens = $result->usage->prompt_tokens ?? $result->usage->input_tokens ?? 0;
                    $outputTokens = $result->usage->completion_tokens ?? $result->usage->output_tokens ?? 0;
                }
            } elseif (is_array($result) && isset($result['usage'])) {
                $inputTokens = $result['usage']['prompt_tokens'] ?? $result['usage']['input_tokens'] ?? 0;
                $outputTokens = $result['usage']['completion_tokens'] ?? $result['usage']['output_tokens'] ?? 0;
            }

            $this->paceClient->record([
                'provider'      => $provider,
                'model'         => $model,
                'input_tokens'  => $inputTokens,
                'output_tokens' => $outputTokens,
                'latency_ms'    => $latencyMs,
                'status_code'   => 200,
                'metadata'      => $extraMetadata
            ]);

            return $result;
        } catch (\Throwable $e) {
            $latencyMs = (int)round((microtime(true) - $startTime) * 1000);
            $statusCode = $e->getCode() >= 400 && $e->getCode() < 600 ? $e->getCode() : 500;

            $this->paceClient->record([
                'provider'    => $provider,
                'model'       => $model,
                'latency_ms'  => $latencyMs,
                'status_code' => $statusCode,
                'metadata'    => array_merge($extraMetadata, ['error' => $e->getMessage()])
            ]);

            throw $e;
        }
    }
}
