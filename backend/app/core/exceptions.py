from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

logger = logging.getLogger("sage.security")

class DomainException(Exception):
    """Base Exception for Domain Level Errors"""
    def __init__(self, message: str, code: str = "BAD_REQUEST", status_code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.code = code
        self.status_code = status_code

async def domain_exception_handler(request: Request, exc: DomainException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": {"code": exc.code, "message": exc.message}}
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Format payload errors without exposing internal python objects
    errors = []
    for error in exc.errors():
        loc = " -> ".join([str(x) for x in error["loc"] if x != "body"])
        errors.append({"field": loc, "message": error["msg"]})
        
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "اطلاعات ورودی معتبر نیست.",
                "details": errors
            }
        }
    )

async def unhandled_exception_handler(request: Request, exc: Exception):
    # Log the real exception internally, return generic harmless error to caller
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "خطای غیرمنتظره‌ای در سرور رخ داده است."
            }
        }
    )