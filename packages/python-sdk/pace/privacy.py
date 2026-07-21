import re
from typing import Dict, Any, Optional

FORBIDDEN_KEYS = {"prompt", "completion", "messages", "content", "authorization", "api_key", "secret", "bearer", "password"}

def sanitize_metadata(
    metadata: Optional[Dict[str, Any]],
    max_bytes: int = 4096,
    denylist: Optional[set] = None
) -> Dict[str, Any]:
    if not metadata:
        return {}

    active_denylist = FORBIDDEN_KEYS.union(denylist or set())
    sanitized: Dict[str, Any] = {}

    for k, v in metadata.items():
        if k.lower() in active_denylist:
            continue
        # Convert values to strings or primitives, avoid storing large objects
        if isinstance(v, (str, int, float, bool)) or v is None:
            sanitized[k] = v
        else:
            sanitized[k] = str(v)[:200]

    return sanitized
