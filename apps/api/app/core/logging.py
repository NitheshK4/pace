import logging
import json
import re
from typing import Any, Dict

# Patterns to redact
SENSITIVE_PATTERNS = [
    (re.compile(r'pace_[a-zA-Z0-9_\-]+'), '[REDACTED_PACE_KEY]'),
    (re.compile(r'sk-[a-zA-Z0-9_\-]+'), '[REDACTED_PROVIDER_KEY]'),
    (re.compile(r'Bearer\s+[^\s"\'\`]+', re.IGNORECASE), 'Bearer [REDACTED]'),
    (re.compile(r'authorization:\s*[^\s"\'\`]+', re.IGNORECASE), 'authorization: [REDACTED]'),
]

class RedactingFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        message = super().format(record)
        for pattern, replacement in SENSITIVE_PATTERNS:
            message = pattern.sub(replacement, message)
        return message

def setup_logging():
    handler = logging.StreamHandler()
    formatter = RedactingFormatter(
        '{"time": "%(asctime)s", "name": "%(name)s", "level": "%(levelname)s", "message": %(message)s}'
    )
    handler.setFormatter(formatter)
    
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.handlers = [handler]

logger = logging.getLogger("pace")
