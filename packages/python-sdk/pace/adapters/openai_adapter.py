import uuid
from typing import Any, Dict
from pace.adapters.base import BaseProviderAdapter

class OpenAIAdapter(BaseProviderAdapter):
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
                "provider": "openai",
                "model": model_name,
                "endpoint": "chat.completions.create",
                "input_tokens": 0,
                "output_tokens": 0,
                "cached_input_tokens": 0,
                "reasoning_tokens": 0,
                "latency_ms": latency_ms,
                "status_code": status_code,
                "request_id": None,
            }

        # Response object or dictionary
        usage = getattr(response_or_exc, "usage", None)
        if isinstance(response_or_exc, dict):
            usage = response_or_exc.get("usage")

        input_tokens = 0
        output_tokens = 0
        cached_tokens = 0
        reasoning_tokens = 0

        if usage:
            if hasattr(usage, "prompt_tokens"):
                input_tokens = getattr(usage, "prompt_tokens", 0) or 0
                output_tokens = getattr(usage, "completion_tokens", 0) or 0
                
                # Check prompt_tokens_details for cached tokens
                details = getattr(usage, "prompt_tokens_details", None)
                if details:
                    cached_tokens = getattr(details, "cached_tokens", 0) or 0
                
                # Check completion_tokens_details for reasoning tokens
                comp_details = getattr(usage, "completion_tokens_details", None)
                if comp_details:
                    reasoning_tokens = getattr(comp_details, "reasoning_tokens", 0) or 0
            elif isinstance(usage, dict):
                input_tokens = usage.get("prompt_tokens", 0) or 0
                output_tokens = usage.get("completion_tokens", 0) or 0

        req_id = getattr(response_or_exc, "id", None)
        if isinstance(response_or_exc, dict):
            req_id = response_or_exc.get("id")

        return {
            "event_id": str(uuid.uuid4()),
            "provider": "openai",
            "model": getattr(response_or_exc, "model", model_name) or model_name,
            "endpoint": "chat.completions.create",
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cached_input_tokens": cached_tokens,
            "reasoning_tokens": reasoning_tokens,
            "latency_ms": latency_ms,
            "status_code": 200,
            "request_id": req_id,
        }
