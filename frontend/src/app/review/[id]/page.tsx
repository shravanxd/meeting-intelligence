"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, FileText, Download, Target, MessageSquare, Loader2, Send } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatLog, setChatLog] = useState<{q: string, a: string}[]>([]);
  const [question, setQuestion] = useState("");
  const [chatting, setChatting] = useState(false);

  useEffect(() => {
    // Check if we have a demo transcript to analyze
    const demoTranscript = localStorage.getItem('demo_transcript');
    if (demoTranscript) {
      setLoading(true);
      fetch('http://localhost:8000/review/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: demoTranscript })
      })
      .then(res => res.json())
      .then(res => {
         setData(res);
         setLoading(false);
      })
      .catch(err => {
         console.error(err);
         setData({ summary: 'Failed to analyze.', action_items: [], speakers: [] });
         setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleAsk = () => {
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion("");
    setChatLog(prev => [...prev, { q, a: "" }]);
    setChatting(true);
    const demoTranscript = localStorage.getItem('demo_transcript') || "No transcript found";
    
    fetch('http://localhost:8000/review/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: demoTranscript,
        question: q
      })
    })
    .then(res => res.json())
    .then(res => {
      setChatting(false);
      setChatLog(prev => prev.map((item, idx) => 
        idx === prev.length - 1 ? { ...item, a: res.answer } : item
      ));
    })
    .catch(err => {
      console.error(err);
      setChatting(false);
      setChatLog(prev => prev.map((item, idx) => 
        idx === prev.length - 1 ? { ...item, a: "Error connecting to AI." } : item
      ));
    });
  };


  const [loadingApprove, setLoadingApprove] = useState(false);
  const router = require('next/navigation').useRouter();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-600 font-medium">Analyzing Meeting Transcript & Extracting Intelligence...</p>
      </div>
    );
  }





  // In a real app we would load data per params.id
  return (
    <div className="flex h-screen bg-slate-50 flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/review" className="text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Acme Contract Negotiation ({params.id})</h1>
            <div className="flex items-center gap-3 text-sm mt-1">
              <span className="flex items-center gap-1 text-slate-500"><Clock className="w-4 h-4" /> Today, 10:00 AM</span>
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">Needs Review</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">Discard</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <CheckCircle className="w-4 h-4" /> Approve to Matter
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Side - Extraction Panel */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800 text-sm">Extracted Intelligence</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Executive Summary</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{data?.summary || "Client reviewed the initial draft for the Acme Corp merger. Key disagreements centered around liability caps and timeline. Agreed to revise Section 4."}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Action Items</h3>
              <ul className="space-y-2">
                {data?.action_items ? (
                  data.action_items.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                      <input type="checkbox" className="mt-1" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.task}</p>
                        <p className="text-xs text-slate-500 mt-1">Assignee: {item.assignee || 'Unassigned'}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-3 bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                      <input type="checkbox" className="mt-1" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">Revise liability cap in Section 4.</p>
                        <p className="text-xs text-slate-500 mt-1">Assignee: John Doe</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                      <input type="checkbox" className="mt-1" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">Send updated draft to opposing counsel.</p>
                        <p className="text-xs text-slate-500 mt-1">Assignee: Jane Smith</p>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Transcript & Context */}
        <div className="w-1/2 flex flex-col bg-slate-50">
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
             <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800 text-sm">Transcript Evidence</span>
             </div>
             <button className="text-slate-500 hover:text-slate-800 p-1"><Download className="w-4 h-4" /></button>
          </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
             {data?.speakers && data.speakers.length > 0 ? (
               data.speakers.map((speaker: any, idx: number) => (
                 <div key={idx} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-xs mt-1`}>{speaker.initials || 'SP'}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-slate-900">{speaker.name || 'Speaker'}</span>
                        <span className="text-xs text-slate-400">{speaker.time || '00:00'}</span>
                      </div>
                      <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">{speaker.text}</p>
                    </div>
                 </div>
               ))
             ) : (
               <p className="text-sm text-slate-500 italic">No transcript snippets parsed or snippet data is empty.</p>
             )}
          </div>
          
          {/* Ask AI Section */}
          <div className="px-6 py-4 border-t border-slate-200 bg-white">
            <div className="mb-3 space-y-3 max-h-32 overflow-y-auto">
               {chatLog.map((log, i) => (
                 <div key={i} className="text-sm">
                    <div className="font-semibold text-blue-700">Q: {log.q}</div>
                    <div className="text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 mt-1"><span className="font-bold mr-2">A:</span><div className="prose prose-sm max-w-none mt-1"><ReactMarkdown remarkPlugins={[remarkGfm]}>{log.a}</ReactMarkdown></div></div>
                 </div>
               ))}
               {chatting && <div className="text-sm text-slate-500 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Thinking...</div>}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm" 
                placeholder="Ask anything about the transcript... (e.g. what document was X?)" 
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
                disabled={chatting || loading}
              />
              <button 
                onClick={handleAsk}
                disabled={chatting || loading || !question.trim()}
                className="bg-slate-800 text-white px-3 py-2 rounded-md hover:bg-slate-900 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}