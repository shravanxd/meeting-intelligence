import os
import urllib.request
import json
import logging

logger = logging.getLogger(__name__)

class RecallService:
    def __init__(self):
        self.api_key = os.getenv("RECALL_API_KEY")
        self.base_url = "https://us-west-2.recall.ai/api/v1/bot"

    def schedule_bot(self, meeting_url: str, bot_name: str = "Meeting Intelligence Bot"):
        if not self.api_key:
            logger.warning("RECALL_API_KEY is not set. Skipping bot creation.")
            return None

        req = urllib.request.Request(
            self.base_url,
            data=json.dumps({
                "meeting_url": meeting_url,
                "bot_name": bot_name
            }).encode("utf-8"),
            headers={
                "Authorization": f"Token {self.api_key}",
                "Content-Type": "application/json"
            },
            method="POST"
        )

        try:
            with urllib.request.urlopen(req) as response:
                resp_body = response.read()
                return json.loads(resp_body)
        except Exception as e:
            logger.error(f"Error creating Recall.ai bot: {e}")
            return None
