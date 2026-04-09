import re

with open("/Users/shravan/Desktop/Meeting-Intelligence/transcript_meet.txt", "r") as f:
    raw_text = f.read()

lines = raw_text.split('\n')

cleaned_lines = []
current_speaker = "Unknown"
speaker_regex = re.compile(r"^(.+?)\s+(\d+\s+minutes?.*)$")

skip_next = False

for i, line in enumerate(lines):
    line = line.strip()
    if not line:
        continue
        
    match = speaker_regex.match(line)
    if match:
        # It's a speaker line like "Shawn 0 minutes 29 seconds"
        speaker = match.group(1).strip()
        time_str = match.group(2).strip()
        current_speaker = f"{speaker} [{time_str}]"
        continue
        
    # Skip common artifacts
    if len(line) <= 2 and line.isalpha() and line.isupper():
        continue
    if re.match(r"^\d{1,2}:\d{2}$", line):
        continue
    if re.match(r"^\d+\s+minutes?\s+\d+\s+seconds?$", line):
        continue
    if i < len(lines) - 1 and re.match(r"^\d+\s+minutes?.*$", lines[i+1].strip()):
        # This line is just the speaker name before the standalone time
        continue
        
    if line == "stopped transcription":
        continue
        
    # Otherwise it's spoken text
    if not cleaned_lines or not cleaned_lines[-1].startswith(current_speaker):
        cleaned_lines.append(f"\n{current_speaker}:\n{line}")
    else:
        cleaned_lines.append(line)

with open("/Users/shravan/Desktop/Meeting-Intelligence/transcript_meet.txt", "w") as f:
    f.write("\n".join(cleaned_lines).strip())
    
print("Done")
