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
                "bot_name": bot_name,
                "zoom": {
                    "request_recording_permission": True
                },
                "recording_config": {
                    "transcript": {
                        "provider": {
                            "aws_transcribe_streaming": {"language_code": "en-US"}
                        }
                    }
                }
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

    def get_bot_status(self, bot_id: str):
        if not self.api_key:
            return None
        req = urllib.request.Request(
            f"{self.base_url}/{bot_id}",
            headers={"Authorization": f"Token {self.api_key}"},
            method="GET"
        )
        try:
            with urllib.request.urlopen(req) as response:
                resp_body = response.read()
                return json.loads(resp_body)
        except Exception as e:
            logger.error(f"Error getting Recall.ai bot status: {e}")
            return None

    def leave_bot(self, bot_id: str):
        if not self.api_key:
            return None
        req = urllib.request.Request(
            f"{self.base_url}/{bot_id}/leave_call",
            data=b"{}",
            headers={"Authorization": f"Token {self.api_key}", "Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req) as response:
                resp_body = response.read()
                return json.loads(resp_body)
        except Exception as e:
            logger.error(f"Error making Recall.ai bot leave: {e}")
            return None

    def get_bot_transcript(self, bot_id: str):
        if not self.api_key:
            return None
        
        # Step 1: Get the bot data
        req = urllib.request.Request(
            f"{self.base_url}/{bot_id}",
            headers={"Authorization": f"Token {self.api_key}", "Accept": "application/json"},
            method="GET"
        )
        try:
            with urllib.request.urlopen(req) as response:
                bot_data = json.loads(response.read())
        except Exception as e:
            logger.error(f"Error getting Recall.ai bot for transcript: {e}")
            return None
            
        # Step 2: Find the transcript download URL
        transcript_url = None
        for rec in bot_data.get("recordings", []):
            transcript_shortcut = rec.get("media_shortcuts", {}).get("transcript")
            if transcript_shortcut and transcript_shortcut.get("data") and transcript_shortcut["data"].get("download_url"):
                transcript_url = transcript_shortcut["data"]["download_url"]
                break
                
        # If no transcript is found or available yet
        if not transcript_url:
            return ""

        # Step 3: Download the transcript
        try:
            req = urllib.request.Request(transcript_url, method="GET")
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read())
                
                # Format the transcript nicely
                transcript_text = ""
                for msg in data:
                    participant = msg.get("participant", {}) or {}
                    speaker = participant.get("name") or msg.get("name", "Unknown")
                    words = [w.get("text", "") for w in msg.get("words", [])]
                    text = " ".join(words)
                    transcript_text += f"[{speaker}]: {text}\n"
                
                return transcript_text
        except Exception as e:
            logger.error(f"Error getting Recall.ai transcript from download URL: {e}")
            return None
