from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite+aiosqlite:///./claims.db"
    band_api_key: str = ""
    band_agent_id: str = ""
    band_ws_url: str = "wss://app.band.ai/api/v1/socket/websocket"
    band_rest_url: str = "https://app.band.ai"
    aiml_api_key: str = ""
    aiml_base_url: str = "https://api.aimlapi.com/v1"
    model_name: str = "gpt-4o-mini"
    log_level: str = "INFO"


settings = Settings()
