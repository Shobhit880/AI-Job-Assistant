import json
import os
from typing import Optional

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def get_client() -> Optional[OpenAI]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    return OpenAI(api_key=api_key)


def get_model() -> str:
    return os.getenv("OPENAI_MODEL", "gpt-4.1-mini")


def json_completion(system_prompt: str, user_prompt: str) -> Optional[dict]:
    client = get_client()
    if client is None:
        return None

    response = client.responses.create(
        model=get_model(),
        input=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    text = response.output_text
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None
