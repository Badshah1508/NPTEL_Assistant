import json
import logging
from typing import Dict, Any, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

class BaseLLMProvider:
    async def generate_json(self, prompt: str, system_prompt: str) -> Dict[str, Any]:
        raise NotImplementedError

class MockLLMProvider(BaseLLMProvider):
    async def generate_json(self, prompt: str, system_prompt: str) -> Dict[str, Any]:
        """Offline deterministic mock provider for fallback when no API key is supplied."""
        return {
            "status": "mock",
            "message": "Mock deterministic output for local development."
        }

class OllamaProvider(BaseLLMProvider):
    def __init__(self, base_url: str = settings.OLLAMA_BASE_URL, model: str = "llama3.1:8b"):
        self.base_url = base_url.rstrip("/")
        self.model = model

    async def generate_json(self, prompt: str, system_prompt: str) -> Dict[str, Any]:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt + "\nReturn ONLY valid JSON matching the requested schema. No markdown ticks, no preamble."},
                {"role": "user", "content": prompt}
            ],
            "format": "json",
            "stream": False,
            "options": {"temperature": 0.2}
        }
        async with httpx.AsyncClient(timeout=120.0) as client:
            res = await client.post(url, json=payload)
            res.raise_for_status()
            data = res.json()
            content = data.get("message", {}).get("content", "{}")
            return json.loads(content)

class OpenAIProvider(BaseLLMProvider):
    def __init__(self, api_key: str = settings.OPENAI_API_KEY, model: str = "gpt-4o"):
        self.api_key = api_key
        self.model = model

    async def generate_json(self, prompt: str, system_prompt: str) -> Dict[str, Any]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }
        async with httpx.AsyncClient(timeout=120.0) as client:
            res = await client.post(url, headers=headers, json=payload)
            res.raise_for_status()
            data = res.json()
            content = data["choices"][0]["message"]["content"]
            return json.loads(content)

class GeminiProvider(BaseLLMProvider):
    def __init__(self, api_key: str = settings.GEMINI_API_KEY, model: str = "gemini-1.5-flash"):
        self.api_key = api_key
        self.model = model

    async def generate_json(self, prompt: str, system_prompt: str) -> Dict[str, Any]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": f"SYSTEM INSTRUCTIONS:\n{system_prompt}\n\nUSER PROMPT:\n{prompt}"}]}
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.2
            }
        }
        async with httpx.AsyncClient(timeout=120.0) as client:
            res = await client.post(url, json=payload)
            res.raise_for_status()
            data = res.json()
            content = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(content)

def get_llm_provider() -> BaseLLMProvider:
    provider_type = settings.AI_PROVIDER.lower()
    if provider_type == "ollama":
        return OllamaProvider(base_url=settings.OLLAMA_BASE_URL, model=settings.AI_MODEL if settings.AI_MODEL != "studypilot-v1" else "llama3.1:8b")
    elif provider_type == "openai" and settings.OPENAI_API_KEY:
        return OpenAIProvider(api_key=settings.OPENAI_API_KEY, model=settings.AI_MODEL if settings.AI_MODEL != "studypilot-v1" else "gpt-4o")
    elif provider_type == "gemini" and settings.GEMINI_API_KEY:
        return GeminiProvider(api_key=settings.GEMINI_API_KEY, model=settings.AI_MODEL if settings.AI_MODEL != "studypilot-v1" else "gemini-1.5-flash")
    else:
        return MockLLMProvider()
