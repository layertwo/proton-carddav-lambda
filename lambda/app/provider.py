import os
from functools import cached_property, lru_cache

from boto3 import Session

from app.services.proton import ProtonClient
from app.services.secrets_manager import SecretsAdapter


class ServiceProvider:
    @cached_property
    def secret_arn(self) -> str:
        return os.environ["SECRET_ARN"]

    @cached_property
    def aws_region(self) -> str:
        return os.environ["AWS_REGION"]

    @cached_property
    def is_lambda(self) -> bool:
        return "LAMBDA_TASK_ROOT" in os.environ

    @cached_property
    def is_desktop(self) -> bool:
        return "DEV_DESKTOP" in os.environ

    @cached_property
    def aws_session(self) -> Session:
        return Session(
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
            aws_session_token=os.environ["AWS_SESSION_TOKEN"],
            region=self.aws_region,
        )

    @cached_property
    def secrets_adapter(self) -> SecretsAdapter:
        return SecretsAdapter(aws_session=self.aws_session)

    @cached_property
    def proton_username(self) -> str:
        if self.is_desktop:
            return os.environ["PROTON_USERNAME"]
        return self.secrets_adapter.get_secret_value(secret_name=self.secret_arn, value="username")

    @cached_property
    def proton_password(self) -> str:
        if self.is_desktop:
            return os.environ["PROTON_PASSWORD"]
        return self.secrets_adapter.get_secret_value(secret_name=self.secret_arn, value="password")

    @cached_property
    def proton_client(self) -> ProtonClient:
        return ProtonClient(self.proton_username, self.proton_password)


@lru_cache(maxsize=1)
def create_service_provider():
    return ServiceProvider()
