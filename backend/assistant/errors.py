class AssistantQueryError(Exception):
    """Base error for deterministic assistant query handling."""


class AssistantValidationError(AssistantQueryError):
    """Raised when approved query parameters are invalid."""


class AssistantNotFoundError(AssistantQueryError):
    """Raised when an approved entity/result cannot be found."""
