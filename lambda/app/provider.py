import os
from functools import cached_property, lru_cache

from boto3 import Session

from app.services.proton import ProtonClient
from app.services.secrets_manager import SecretsAdapter


class ConfigProvider:
    @cached_property
    def secret_arn(self) -> str:
        return os.environ["SECRET_ARN"]

    @cached_property
    def aws_region(self) -> str:
        return os.environ["AWS_REGION"]

    @cached_property
    def is_lambda(self) -> bool:
        return "LAMBDA_TASK_ROOT" in os.environ


class ServiceProvider:
    @cached_property
    def config(self) -> ConfigProvider:
        return ConfigProvider()

    @cached_property
    def aws_session(self) -> Session:
        return Session(
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
            aws_session_token=os.environ["AWS_SESSION_TOKEN"],
            region=self.config.aws_region,
        )

    @cached_property
    def secrets_adapter(self) -> SecretsAdapter:
        return SecretsAdapter(aws_session=self.aws_session)

    @cached_property
    def proton_client(self) -> ProtonClient:
        username = self.secrets_adapter.get_secret_value(
            secret_name=self.config.secret_arn, value="username"
        )
        password = self.secrets_adapter.get_secret_value(
            secret_name=self.config.secret_arn, value="password"
        )
        return ProtonClient(username, password)


@lru_cache()
def create_service_provider():
    return ServiceProvider()
