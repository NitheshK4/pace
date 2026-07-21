from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, Tuple

class BaseProviderAdapter(ABC):
    @abstractmethod
    def extract_telemetry(
        self,
        response_or_exc: Any,
        model_name: str,
        latency_ms: int,
        is_error: bool = False
    ) -> Dict[str, Any]:
        """Extracts normalized telemetry fields from provider response/exception."""
        pass
