"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, FileText, Download, Target, MessageSquare, Loader2, Send, Calendar, Mail } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatLog, setChatLog] = useState<{q: string, a: string}[]>([]);
  const [question, setQuestion] = useState("");
  const [chatting, setChatting] = useState(false);

  useEffect(() => {
    // Attempt fetching the actual backend data by ID
    const fetchMeeting = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/review/${unwrappedParams.id}`);
        if (res.ok) {
          const meetingData = await res.json();
          setData(meetingData);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Backend fetch failed, falling back to local demo transcript", err);
      }

      // Check if we have a demo transcript to analyze (fallback)
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
    };

    fetchMeeting();
  }, [unwrappedParams.id]);

  const handleAsk = () => {
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion("");
    setChatLog(prev => [...prev, { q, a: "" }]);
    setChatting(true);
    const payload = {
      transcript: data?.transcript_text || localStorage.getItem('demo_transcript') || "No transcript found",
      summary: data?.summary || "",
      action_items: JSON.stringify(data?.action_items || []),
      question: q
    };
    fetch('http://localhost:8000/review/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
      setChatting(false);
      setChatLog(prev => prev.map((item, idx) => 
        idx === prev.length - 1 ? { ...item, a: res.answer } : item
      ));
      if (res.added_action_items && res.added_action_items.length > 0) {
        setData((prev: any) => ({
           ...prev,
           action_items: [...(prev?.action_items || []), ...res.added_action_items]
        }));
      }
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
  const [loadingSendReview, setLoadingSendReview] = useState(false);
  const router = require('next/navigation').useRouter();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-600 font-medium">Analyzing Meeting Transcript & Extracting Intelligence...</p>
      </div>
    );
  }





  const generateEmailData = () => {
    if (!data) return { subject: "", body: "", to: "" };
    
    const cleanSummary = (data.summary || "")
      .replace(/—/g, '-')
      .replace(/\*/g, '')
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .trim();

    const tasks = (data.action_items || []).map((item: {task: string, assignee?: string}) => `- ${item.task} (Assignee: ${item.assignee || 'Unassigned'})`).join('\n');
    
    const emailSubject = `Follow Up: ${data.title || "Meeting"}`.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    
    const emailBody = `Hi Team,\n\nHere is a brief summary of our discussion:\n${cleanSummary}\n\nAction Items:\n${tasks}\n\nBest regards,\nLegal Buddy`;

    let members: string[] = [];
    if (data.participants && Array.isArray(data.participants)) {
      members = data.participants.map((p: string | {name?: string}) => {
         const nameStr = typeof p === 'string' ? p : (p.name || '');
         const name = nameStr.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
         return name && name !== 'unknown' ? `${name}@company.com` : '';
      }).filter(Boolean);
    }
    
    const to = Array.from(new Set(members)).join(',');
    return { subject: emailSubject, body: emailBody, to };
  };

  const mailData = generateEmailData();
  const outlookLink = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(mailData.to)}&subject=${encodeURIComponent(mailData.subject)}&body=${encodeURIComponent(mailData.body)}`;


  // In a real app we would load data per params.id
  return (
    <div className="flex h-screen bg-slate-50 flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/review" className="text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{data?.title || `Acme Contract Negotiation (${unwrappedParams.id})`}</h1>
            <div className="flex items-center gap-3 text-sm mt-1">
              <span className="flex items-center gap-1 text-slate-500"><Clock className="w-4 h-4" /> {data?.date || "Today, 10:00 AM"}</span>
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">{data?.status || "Needs Review"}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {data?.status === "in_call" || data?.status === "joining_call" || data?.status === "in_waiting_room" ? (
             <button 
               onClick={async () => { 
                await fetch(`http://localhost:8000/meetings/${unwrappedParams.id}/end`, { method: 'POST' }); 
                window.location.reload(); 
               }} 
               className="px-4 py-2 border border-red-300 text-red-600 bg-white rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
             >
               End Session
             </button>
          ) : null}
          <button 
            onClick={async () => {
              setLoadingSendReview(true);
              await fetch(`http://localhost:8000/review/${unwrappedParams.id}/send-to-review`, { method: 'PUT' });
              setLoadingSendReview(false);
              router.push('/meetings');
            }}
            className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-md text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            disabled={loadingSendReview}
          >
            {loadingSendReview ? 'Sending...' : 'Send to Review'}
          </button>
          <button onClick={async () => { await fetch(`http://localhost:8000/review/${unwrappedParams.id}`, { method: 'DELETE' }); router.push('/meetings'); }} className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">Discard</button>
          <button 
            onClick={async () => { 
                setLoadingApprove(true);
                await fetch(`http://localhost:8000/review/${unwrappedParams.id}/review`, { method: 'PUT' }); 
                setLoadingApprove(false);
                router.push('/meetings'); 
            }} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            disabled={loadingApprove}
          >
            <CheckCircle className="w-4 h-4" /> {loadingApprove ? 'Approving...' : 'Approve to Matter'}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        <PanelGroup orientation="horizontal" id="review-layout">
        {/* Left Side - Extraction Panel */}
        <Panel defaultSize={50} minSize={20} className="flex flex-col border-r border-slate-200 bg-white">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800 text-sm">Extracted Intelligence</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-800">Executive Summary</h3>
                {(data?.summary || data?.action_items) && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Follow Up Email:</span>
                    <button onClick={() => window.open(outlookLink, '_blank')} className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-medium transition-colors">
                      <Mail className="w-3 h-3" /> Outlook
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{data?.summary || "Meeting intelligence is being processed. Please wait..."}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Action Items</h3>
              <ul className="space-y-2">
                {data?.action_items ? (
                  data.action_items.map((item: any, idx: number) => {
                    const isScheduling = /meeting|schedule|call|deal|sync|prepare/i.test(item.task);                                                         
                    const isEmailing = /email|reach out|contact|send|message/i.test(item.task);
                    
                    let startDate = new Date();
                    const monthMatch = item.task.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?/i);
                    const pmMatch = item.task.match(/(\d{1,2})(?::\d{2})?\s*(am|pm)/i);
                    
                    if (monthMatch) {
                      const monthName = monthMatch[1].toLowerCase();
                      const day = parseInt(monthMatch[2], 10);
                      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                      const monthIndex = months.findIndex(m => monthName.startsWith(m));
                      if (monthIndex !== -1) {
                         startDate.setMonth(monthIndex);
                         startDate.setDate(day);
                         startDate.setHours(9, 0, 0, 0);
                      }
                    } else {
                      startDate.setDate(startDate.getDate() + 1);
                      startDate.setHours(9, 0, 0, 0); 
                    }
                    
                    if (pmMatch) {
                      let hr = parseInt(pmMatch[1], 10);
                      if (pmMatch[2].toLowerCase() === 'pm' && hr !== 12) hr += 12;
                      if (pmMatch[2].toLowerCase() === 'am' && hr === 12) hr = 0;
                      startDate.setHours(hr, 0, 0, 0);
                    }

                    const endDate = new Date(startDate.getTime() + 45 * 60000);
                    const fmtDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
                    const datesStr = `${fmtDate(startDate)}/${fmtDate(endDate)}`;

                    const guessedEmail = item.assignee ? `${item.assignee.split(' ')[0].toLowerCase()}@company.com` : '';
                    
                    const calTitle = `Legal Follow-up: ${data?.title || 'Client Matter'}`;
                    const desc = `Agenda Topics & Context:\n${data?.summary || 'Follow-up discussion regarding recent case developments.'}\n\nTask Reference:\n- ${item.task}`;
                    
                    const calLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calTitle)}&dates=${datesStr}&details=${encodeURIComponent(desc)}&add=${encodeURIComponent(guessedEmail)}&location=${encodeURIComponent('Google Meet')}`;
                    return (
                        <li key={idx} className="flex items-start gap-3 bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <p className="text-sm font-medium text-slate-800">{item.task}</p>
                            <p className="text-xs text-slate-500 mt-1">Assignee: {item.assignee || 'Unassigned'}</p>
                            <div className="flex gap-2 mt-2">
                                {isScheduling && (
                                    <a href={calLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                        <Calendar className="w-3.5 h-3.5" /> Schedule Google Meet
                                    </a>
                                )}
                                {isEmailing && (
                                    <button onClick={() => window.open(`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(guessedEmail)}&subject=${encodeURIComponent(calTitle)}&body=${encodeURIComponent(desc)}`, '_blank')} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                                        <Mail className="w-3.5 h-3.5" /> Send Email
                                    </button>
                                )}
                            </div>
                          </div>
                      </li>
                    );
                  })
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
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-slate-200 hover:bg-blue-400 transition-colors cursor-col-resize flex flex-col justify-center items-center group">
           <div className="h-8 w-[2px] bg-slate-400 rounded-full group-hover:bg-white transition-colors"></div>
        </PanelResizeHandle>

        {/* Right Side - Transcript & Context */}
        <Panel defaultSize={50} minSize={20} className="flex flex-col bg-slate-50">
          <PanelGroup orientation="vertical" id="review-right-layout">
             <Panel defaultSize={65} minSize={20} className="flex flex-col min-h-0">
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex flex-col gap-3">
             <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800 text-sm">Transcript</span>
               </div>
               <button className="text-slate-500 hover:text-slate-800 p-1"><Download className="w-4 h-4" /></button>
             </div>
             
             {/* Mention People / Participants */}
             {data?.speakers && data.speakers.length > 0 && (
               <div className="flex flex-wrap gap-2">
                 <span className="text-xs text-slate-500 flex items-center mr-1">In meeting:</span>
                 {Array.from(new Set(data.speakers.map((s: any) => s.name).filter(Boolean))).map((name: any, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => setQuestion(prev => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + `@${name} `)}
                     className="px-2 py-1 text-xs bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md border border-slate-200 transition-colors flex items-center gap-1"
                   >
                     <span className="text-slate-400">@</span>{name}
                   </button>
                 ))}
               </div>
             )}
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
             </Panel>
             <PanelResizeHandle className="h-1 bg-slate-200 hover:bg-blue-400 transition-colors cursor-row-resize flex justify-center items-center group shrink-0">
                <div className="w-8 h-[2px] bg-slate-400 rounded-full group-hover:bg-white transition-colors"></div>
             </PanelResizeHandle>
             <Panel defaultSize={35} minSize={15} className="flex flex-col bg-white">
          {/* Ask AI Section */}
          <div className="px-6 py-4 flex flex-col h-full min-h-0">
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2 border border-transparent">
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
             </Panel>
          </PanelGroup>
        </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}