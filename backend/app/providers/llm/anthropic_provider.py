import anthropic
import json
from typing import Optional
from ...core.config import settings
from ...schemas.schemas import ExtractionSchema

class AnthropicLLMProvider:
    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        self.client = anthropic.Anthropic(api_key=self.api_key) if self.api_key else None

    def extract_structured_data(self, transcript: str) -> Optional[ExtractionSchema]:
        if not self.client:
            print("ANTHROPIC_API_KEY is not set")
            return None

        prompt = f"""
You are a senior paralegal and workflow extraction assistant. Do not invent facts. Pull ONLY from the provided meeting transcript.
Please structure the extraction as JSON that adheres strictly to the schema provided.

Transcript:
{transcript}
"""

        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=4000,
                temperature=0.1,
                system="You are an expert legal assistant. Your goal is to process meeting transcripts and output highly structured JSON using only explicitly stated facts. Return ONLY valid JSON, no markdown blocks, no preamble.",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            result_text = response.content[0].text
            resultJson = json.loads(result_text)
            
            # Validate with pydantic
            validated_data = ExtractionSchema(**resultJson)
            return validated_data

        except Exception as e:
            print(f"Anthropic extraction failed: {str(e)}")
            return None
