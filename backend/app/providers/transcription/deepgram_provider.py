import os
from deepgram import DeepgramClient, PrerecordedOptions
from typing import Optional
from ...core.config import settings

class DeepgramTranscriptionProvider:
    def __init__(self):
        self.api_key = settings.DEEPGRAM_API_KEY
        self.client = DeepgramClient(self.api_key) if self.api_key else None

    def transcribe_audio_file(self, file_path: str) -> Optional[str]:
        if not self.client:
            print("DEEPGRAM_API_KEY is not set")
            return None
        
        try:
            with open(file_path, "rb") as buffer:
                payload = {"buffer": buffer}
                options = PrerecordedOptions(
                    model="nova-2",
                    smart_format=True,
                    diarize=True
                )
                response = self.client.listen.prerecorded.v("1").transcribe_file(payload, options)
                
                # Extract text
                transcript = response.results.channels[0].alternatives[0].transcript
                return transcript
        except Exception as e:
            print(f"Deepgram transcription failed: {str(e)}")
            return None
