"use client";
import React, { useState, useEffect, useRef } from "react";
import { Video, UploadCloud, Mic, Loader2, Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewMeetingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"join" | "upload" | "record" | "paste">("join");
  const [isCapturing, setIsCapturing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [transcript, setTranscript] = useState("");
  
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("Acme Contract Negotiation");
  const [matterId, setMatterId] = useState("2");
  const [errorMsg, setErrorMsg] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);

  const handleCapture = async () => {
    if (activeTab === "paste") {
      if (typeof window !== "undefined") {
        localStorage.setItem("demo_transcript", transcript);
      }
      setIsCapturing(true);
      setStatusText("Analyzing transcript...");
      setTimeout(() => router.push("/review/1"), 2000);
      return;
    }

    if (activeTab === "join") {
      if (!meetingUrl.trim()) {
        setErrorMsg("Please enter a meeting link.");
        return;
      }
      setErrorMsg("");
      setIsCapturing(true);
      setStatusText("Dispatching Novus AI Buddy to meeting...");

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/meetings/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: meetingTitle,
            meeting_link: meetingUrl,
            matter_id: matterId || "default",
            consent_confirmed: true,
            participants: [],
            ingestion_mode: "joined",
            status: "scheduled"
          })
        });

        if (!response.ok) {
           throw new Error("API returned failure");
        }

        const data = await response.json();
        
        setStatusText("Bot Dispatched! Waiting for lobby access...");
        
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`${apiUrl}/meetings/${data.id}/status`);
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              console.log("Polled Status:", statusData);
              const botState = statusData.bot_status;
              
              if (botState === "joining_call") setStatusText("Bot is joining the meeting...");
              else if (botState === "in_waiting_room") setStatusText("Bot in Waiting Room...");
              else if (botState === "in_call_not_recording") setStatusText("Bot joined, preparing to record...");
              else if (botState === "in_call_recording") setStatusText("Bot in the Meeting & Recording...");
              else if (botState === "call_ended" || botState === "recording_done" || botState === "done") {
                setStatusText("Meeting ended! Preparing intelligence review...");
                clearInterval(pollInterval);
                setTimeout(() => router.push(`/review/${data.id}`), 2000);
              } else if (botState === "fatal" || botState === "bot_refused") {
                setErrorMsg("Bot failed to join or was rejected from the meeting.");
                clearInterval(pollInterval);
                setIsCapturing(false);
              } else {
                setStatusText(`Bot Status: ${botState || "Initializing..."}`);
              }

              if (statusData.participants && statusData.participants.length > 0) {
                setParticipants(statusData.participants);
              }
            }
          } catch (e) {
            console.error("Polling error", e);
          }
        }, 2000);

      } catch (err) {
        console.error("Error dispatching bot:", err);
        setErrorMsg("Failed to reach API. Make sure the backend server is running.");
        setIsCapturing(false);
      }
      return;
    }

    setIsCapturing(true);
    setStatusText("Connecting to meeting agent...");
    
    setTimeout(() => {
      setStatusText("Processing audio footprint...");
    }, 1500);

    setTimeout(() => {
      setStatusText("Extracting legal intelligence...");
    }, 3000);

    setTimeout(() => {
      router.push("/review/1");
    }, 4500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Log New Meeting</h1>
        <p className="text-slate-500 text-sm">Capture, transcribe, and extract intelligence from a client or internal meeting.</p>
      </header>

      <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-lg border border-slate-200 inline-block">
        <button onClick={() => setActiveTab("join")} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "join" ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-600"}`} disabled={isCapturing}><Video className="w-4 h-4" /> Join Live Meeting</button>
        <button onClick={() => setActiveTab("upload")} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "upload" ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-600"}`} disabled={isCapturing}><UploadCloud className="w-4 h-4" /> Upload Recording</button>
        <button onClick={() => setActiveTab("record")} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "record" ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-600"}`} disabled={isCapturing}><Mic className="w-4 h-4" /> Record on Device</button>          <button onClick={() => setActiveTab("paste")} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "paste" ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-600"}`} disabled={isCapturing}><UploadCloud className="w-4 h-4" /> Paste Transcript / File</button>      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-800">{activeTab === "join" ? "Join Live Meeting" : activeTab === "upload" ? "Upload Media" : activeTab === "paste" ? "Paste Transcript / File" : "In-Room Recording"}</h2>
        
        {!isCapturing ? (
          <div className="space-y-4 mt-4">
            {activeTab === "join" && (
              <div className="mb-4 space-y-4">
                <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                      <img src="/logos/Microsoft_Office_Teams_(2025–present).svg" alt="Teams" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                      <img src="/logos/zoom-logo-41643.png" alt="Zoom" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                      <img src="/logos/Google_Meet_Logo_512px.png" alt="Meet" className="w-5 h-5 object-contain" />
                    </div>
                  </div>
                  <div>
                  <p className="text-sm font-medium text-slate-800">Support for Teams, Zoom, & Meet</p>
                  <p className="text-xs text-slate-500">Paste your link to dispatch Novus AI Buddy to join.</p>
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Link</label>
                   <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <LinkIcon className="h-4 w-4 text-slate-400" />
                   </div>
                      <input 
                        type="url" 
                        value={meetingUrl}
                        onChange={(e) => setMeetingUrl(e.target.value)}
                        className="w-full border border-slate-300 rounded-md pl-10 pr-3 py-2 text-sm" 
                        placeholder="https://meet.google.com/... or https://teams.microsoft.com/..." 
                      />
                   </div>
                   {errorMsg && <p className="text-red-500 mt-1 text-xs">{errorMsg}</p>}
                </div>
              </div>
            )}
            {activeTab === "paste" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Transcript Text or File (TXT, PDF, Word, MP3, MP4, etc.)</label>
                <textarea className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm h-32" placeholder="Paste your meeting transcript here, or drag and drop a file..." value={transcript} onChange={(e) => setTranscript(e.target.value)}></textarea>
                <div className="mt-2 text-xs text-slate-500">Alternatively, you can drag and drop supported files here.</div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Title</label>
              <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="e.g. Acme Corp Contract Review" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link to Matter (Optional)</label>
              <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 bg-white" value={matterId} onChange={(e) => setMatterId(e.target.value)}>
                  <option value="">Select a matter...</option>
                  <option value="1">Smith v. Jones</option>
                  <option value="2">Acme Corp Merger</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleCapture}
                disabled={isCapturing || (activeTab === "paste" && transcript.trim().length === 0)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md shadow-sm text-sm transition-colors"
              >
                {activeTab === "paste" ? "Analyze Transcript" : activeTab === "join" ? "Dispatch Bot" : "Begin Capture"}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 bg-slate-50 mt-4 rounded-lg border border-slate-200 border-dashed">
             <Loader2 className="w-8 h-8 text-blue-600 animate-spin flex-shrink-0" />
             <div className="text-center">
               <p className="text-sm font-medium text-slate-900">{statusText}</p>
               <p className="text-xs text-slate-500 mt-1">This typically takes a few seconds.</p>
             </div>            
            {participants.length > 0 && (
              <div className="mt-6 w-full max-w-sm bg-white border border-slate-200 rounded-md p-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Live Participants ({participants.length})</h4>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {participants.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-xs">
                        {p.name ? p.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <span className="truncate">{p.name || "Unknown"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}          </div>
        )}
      </div>
    </div>
  );
}
