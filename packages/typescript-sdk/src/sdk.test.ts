import assert from 'node:assert';
import { test, describe } from 'node:test';
import { PaceClient, ResilientTelemetryQueue } from './index.js';

describe('Pace TypeScript SDK', () => {
  test('initializes client and queues telemetry without throwing', () => {
    const client = new PaceClient({
      apiKey: 'pace_test_key_12345',
      endpoint: 'http://localhost:8000',
      flushIntervalMs: 10000,
    });

    client.record({
      provider: 'openai',
      model: 'gpt-4o',
      input_tokens: 100,
      output_tokens: 50,
      latency_ms: 120,
    });

    const stats = client.getStats();
    assert.strictEqual(stats.pendingEvents, 1);
    client.shutdown();
  });

  test('drops oldest items when queue exceeds max size', () => {
    const queue = new ResilientTelemetryQueue({
      apiKey: 'pace_test_key_12345',
      maxQueueSize: 2,
      flushIntervalMs: 10000,
    });

    queue.enqueue({ provider: 'openai', model: 'gpt-4o', input_tokens: 10, output_tokens: 5, latency_ms: 100 });
    queue.enqueue({ provider: 'openai', model: 'gpt-4o', input_tokens: 20, output_tokens: 5, latency_ms: 100 });
    queue.enqueue({ provider: 'openai', model: 'gpt-4o', input_tokens: 30, output_tokens: 5, latency_ms: 100 });

    assert.strictEqual(queue.getStats().pendingEvents, 2);
    queue.stop();
  });
});
