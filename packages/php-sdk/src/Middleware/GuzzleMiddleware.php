<?php

namespace Pace\Middleware;

use Pace\PaceClient;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

/**
 * PSR-7 / Guzzle HTTP Client middleware for intercepting OpenAI / Anthropic requests.
 */
class GuzzleMiddleware {
    private PaceClient $paceClient;

    public function __construct(PaceClient $paceClient) {
        $this->paceClient = $paceClient;
    }

    public function __invoke(callable $handler): callable {
        return function (RequestInterface $request, array $options) use ($handler) {
            $startTime = microtime(true);
            $uriPath = $request->getUri()->getPath();

            return $handler($request, $options)->then(
                function (ResponseInterface $response) use ($startTime, $request, $uriPath) {
                    $latencyMs = (int)round((microtime(true) - $startTime) * 1000);
                    $statusCode = $response->getStatusCode();

                    $bodyStr = (string)$response->getBody();
                    $data = json_decode($bodyStr, true);

                    $provider = str_contains($uriPath, 'anthropic') ? 'anthropic' : 'openai';
                    $model = $data['model'] ?? 'unknown';
                    $inputTokens = $data['usage']['prompt_tokens'] ?? $data['usage']['input_tokens'] ?? 0;
                    $outputTokens = $data['usage']['completion_tokens'] ?? $data['usage']['output_tokens'] ?? 0;

                    $this->paceClient->record([
                        'provider'      => $provider,
                        'model'         => $model,
                        'endpoint'      => $uriPath,
                        'input_tokens'  => $inputTokens,
                        'output_tokens' => $outputTokens,
                        'latency_ms'    => $latencyMs,
                        'status_code'   => $statusCode
                    ]);

                    return $response;
                }
            );
        };
    }
}
