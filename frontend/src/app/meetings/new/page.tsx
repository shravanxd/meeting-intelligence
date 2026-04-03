"use client";
import React, { useState } from "react";
import { Video, UploadCloud, Mic, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewMeetingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"join" | "upload" | "record" | "paste">("join");
  const [isCapturing, setIsCapturing] = useState(false);
  const [statusText, setStatusText] = useState("");

  const handleCapture = () => {
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
        <h2 className="text-lg font-semibold text-slate-800">{activeTab === "join" ? "Simulate Agent Join" : activeTab === "upload" ? "Upload Media" : activeTab === "paste" ? "Paste Transcript / File" : "In-Room Recording"}</h2>
        
        {!isCapturing ? (
          <div className="space-y-4 mt-4">
            {activeTab === "paste" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Transcript Text or File (TXT, PDF, Word, MP3, MP4, etc.)</label>
                <textarea className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm h-32" placeholder="Paste your meeting transcript here, or drag and drop a file..."></textarea>
                <div className="mt-2 text-xs text-slate-500">Alternatively, you can drag and drop supported files here.</div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Title</label>
              <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="e.g. Acme Corp Contract Review" defaultValue="Acme Contract Negotiation" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Link to Matter (Optional)</label>
              <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 bg-white" defaultValue="2">
                  <option value="">Select a matter...</option>
                  <option value="1">Smith v. Jones</option>
                  <option value="2">Acme Corp Merger</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end">
              <button onClick={handleCapture} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md shadow-sm text-sm transition-colors">Begin Capture</button>
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 bg-slate-50 mt-4 rounded-lg border border-slate-200 border-dashed">
             <Loader2 className="w-8 h-8 text-blue-600 animate-spin flex-shrink-0" />
             <div className="text-center">
               <p className="text-sm font-medium text-slate-900">{statusText}</p>
               <p className="text-xs text-slate-500 mt-1">This typically takes a few seconds.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
