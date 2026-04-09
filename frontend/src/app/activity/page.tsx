"use client";
import React, { useState, useEffect } from 'react';
import { Activity, Clock, FileText, CheckCircle, Video } from 'lucide-react';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/activity")
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getIcon = (type: string) => {
    if (type.includes('MATTER')) return <FileText className="w-3 h-3 text-green-600" />;
    if (type.includes('REVIEW')) return <CheckCircle className="w-3 h-3 text-amber-600" />;
    return <Video className="w-3 h-3 text-blue-600" />;
  };

  const getColor = (type: string) => {
    if (type.includes('MATTER')) return "bg-green-100 border-green-200";
    if (type.includes('REVIEW')) return "bg-amber-100 border-amber-200";
    return "bg-blue-100 border-blue-200";
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Audit Log</h1>
        <p className="text-slate-500">Immutable chronological record of matter updates, meeting syncs, and system actions.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 relative">
        <div className="absolute left-[38px] top-6 bottom-6 w-px bg-slate-200 transform -translate-x-1/2"></div>
        {loading ? (
             <p className="pl-10 text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4 animate-spin"/> Loading audit trail...</p>
        ) : logs.length === 0 ? (
           <p className="pl-10 text-slate-500">No activity yet. System initialization clean.</p>
        ) : (
          <ul className="space-y-8">
            {logs.map((log: any, idx: number) => (
              <li key={idx} className="relative pl-10">
                <span className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center -translate-x-2.5 z-10 border shadow-sm top-0.5 ${getColor(log.event_type)}`}>
                  {getIcon(log.event_type)}
                </span>
                <div className="flex flex-col bg-slate-50 p-4 rounded-lg border border-slate-100 shadow-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800 text-sm">{log.event_type.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{formatTime(log.timestamp)}</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1">Entity ID: {log.entity_id}</p>
                  <div className="text-slate-500 text-[11px] mt-2 bg-white px-3 py-2 rounded border border-slate-200 font-mono flex flex-col gap-1 overflow-x-auto">
                    <span><strong>Actor:</strong> {log.actor}</span>
                    <span><strong>Payload:</strong> {JSON.stringify(log.metadata_json)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}