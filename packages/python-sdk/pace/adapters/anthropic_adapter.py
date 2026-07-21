import uuid
from typing import Any, Dict
from pace.adapters.base import BaseProviderAdapter

class AnthropicAdapter(BaseProviderAdapter):
    def extract_telemetry(
        self,
        response_or_exc: Any,
        model_name: str,
        latency_ms: int,
        is_error: bool = False
    ) -> Dict[str, Any]:
        if is_error:
            status_code = getattr(response_or_exc, "status_code", 500)
            return {
                "event_id": str(uuid.uuid4()),
                "provider": "anthropic",
                "model": model_name,
                "endpoint": "messages.create",
                "input_tokens": 0,
                "output_tokens": 0,
                "cached_input_tokens": 0,
                "reasoning_tokens": 0,
                "latency_ms": latency_ms,
                "status_code": status_code,
                "request_id": None,
            }

        usage = getattr(response_or_exc, "usage", None)
        if isinstance(response_or_exc, dict):
            usage = response_or_exc.get("usage")

        input_tokens = 0
        output_tokens = 0
        cached_tokens = 0

        if usage:
            if hasattr(usage, "input_tokens"):
                input_tokens = getattr(usage, "input_tokens", 0) or 0
                output_tokens = getattr(usage, "output_tokens", 0) or 0
                cached_tokens = getattr(usage, "cache_read_input_tokens", 0) or 0
            elif isinstance(usage, dict):
                input_tokens = usage.get("input_tokens", 0) or 0
                output_tokens = usage.get("output_tokens", 0) or 0
                cached_tokens = usage.get("cache_read_input_tokens", 0) or 0

        req_id = getattr(response_or_exc, "id", None)
        if isinstance(response_or_exc, dict):
            req_id = response_or_exc.get("id")

        return {
            "event_id": str(uuid.uuid4()),
            "provider": "anthropic",
            "model": getattr(response_or_exc, "model", model_name) or model_name,
            "endpoint": "messages.create",
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cached_input_tokens": cached_tokens,
            "reasoning_tokens": 0,
            "latency_ms": latency_ms,
            "status_code": 200,
            "request_id": req_id,
        }
