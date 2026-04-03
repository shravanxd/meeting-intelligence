"use client";
import React from 'react';
import { ArrowLeft, CheckCircle, Clock, FileText, Download, Target, MessageSquare } from 'lucide-react';
import Link from 'next/link';


export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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

  const [loadingApprove, setLoadingApprove] = React.useState(false);
  const router = require('next/navigation').useRouter();


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
              <p className="text-sm text-slate-600 leading-relaxed">
                Client reviewed the initial draft for the Acme Corp merger. Key disagreements centered around liability caps and timeline. Agreed to revise Section 4.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Action Items</h3>
              <ul className="space-y-2">
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
             {/* Mock Transcript */}
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold text-xs mt-1">JD</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-900">John Doe</span>
                    <span className="text-xs text-slate-400">00:15</span>
                  </div>
                  <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">So regarding Section 4, the cap is currently at 5 million. We need it to be 10 million.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-700 font-bold text-xs mt-1">AC</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-900">Alice Counsel</span>
                    <span className="text-xs text-slate-400">00:45</span>
                  </div>
                  <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-blue-500">I can present that to our board, but I'll need a revised draft showing those specific cap changes today. Also, let's make sure Jane sends it out to the opposing team.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}