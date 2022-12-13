from proton.api import Session


class ProtonClient:
    def __init__(
        self, username: str, password: str, api_url: str = "https://api.protonmail.com"
    ) -> None:
        self.session = Session(api_url=api_url)
        self.session.authenticate(username, password)
