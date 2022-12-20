from typing import Dict, Any
import logging
import sys

from aws_lambda_context import LambdaContext, LambdaDict

from app.provider import create_service_provider

logger = logging.getLogger(__name__)


def handler(event: LambdaDict, context: LambdaContext) -> Dict[str, Any]:
    service_provider = create_service_provider()
    logger.info(f"is desktop: {service_provider.is_desktop}")
    proton_client = service_provider.proton_client

    # TODO
    return {}
