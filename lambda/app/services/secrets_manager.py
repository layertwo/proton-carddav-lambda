import base64
import json
from functools import lru_cache
from typing import Any, Dict

from boto3 import Session


class SecretValueNotFound(Exception):
    pass


class SecretsAdapter:
    def __init__(self, aws_session: Session):
        self._client = aws_session.client("secretsmanager")

    @lru_cache()
    def _get_secret(self, secret_name: str) -> Dict[str, Any]:
        response = self._client.get_secret_value(SecretId=secret_name)
        if "SecretString" in response:
            secret = response["SecretString"]
        else:
            secret = base64.b64decode(response["SecretBinary"])

        return json.loads(secret)

    @lru_cache()
    def get_secret_value(self, secret_name: str, value: str) -> str:
        secret = self._get_secret(secret_name)
        try:
            return secret[value]
        except KeyError:
            raise SecretValueNotFound
