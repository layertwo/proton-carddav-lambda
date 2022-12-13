import os
from functools import cached_property

from boto3 import SecretsManager, Session


class ConfigProvider:
    @cached_property
    def secret_arn(self) -> str:
        return os.environ["SECRET_ARN"]

    @cached_property
    def aws_region(self) -> str:
        return os.environ["AWS_REGION"]


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
    def secret_client(self) -> SecretsManager:
        return self.aws_session.client("secretsmanager")
