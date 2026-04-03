import React from 'react';
import { Activity, Clock } from 'lucide-react';

export default function ActivityLogPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Audit Log</h1>
        <p className="text-slate-500">Immutable chronological record of matter updates, meeting syncs, and system actions.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 relative">
        <div className="absolute left-[38px] top-6 bottom-6 w-px bg-slate-200 transform -translate-x-1/2"></div>
        
        <ul className="space-y-8">
          <li className="relative pl-10">
            <span className="absolute left-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center -translate-x-2.5 z-10 border border-blue-200 shadow-sm top-0.5">
              <Activity className="w-3 h-3 text-blue-600" />
            </span>
            <div className="flex flex-col bg-slate-50 p-4 rounded-lg border border-slate-100 shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-800 text-sm">Meeting Processed & Pending Review</span>
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">2 hours ago</span>
              </div>
              <p className="text-slate-600 text-xs mt-1">Vendor NDA Negotiation (Meeting #1204)</p>
              <div className="text-slate-500 text-xs mt-2 bg-white px-3 py-2 rounded border border-slate-200 font-mono flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> 45 Mins Duration Processed
              </div>
            </div>
          </li>
          
          <li className="relative pl-10">
            <span className="absolute left-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center -translate-x-2.5 z-10 border border-green-200 shadow-sm top-0.5">
              <Activity className="w-3 h-3 text-green-600" />
            </span>
            <div className="flex flex-col bg-slate-50 p-4 rounded-lg border border-slate-100 shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-800 text-sm">Matter Created</span>
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">1 day ago</span>
              </div>
              <p className="text-slate-600 text-xs mt-1">Novus Partnership Setup</p>
              <div className="text-slate-500 text-xs mt-2 bg-white px-3 py-2 rounded border border-slate-200 font-mono">
                User: AI Admin
              </div>
            </div>
          </li>
          
          <li className="relative pl-10 opacity-70">
            <span className="absolute left-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center -translate-x-2.5 z-10 border border-slate-200 shadow-sm top-0.5">
              <Activity className="w-3 h-3 text-slate-600" />
            </span>
            <div className="flex flex-col bg-slate-50 p-4 rounded-lg border border-slate-100 shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-800 text-sm">Meeting Approved & Synced</span>
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">2 days ago</span>
              </div>
              <p className="text-slate-600 text-xs mt-1">Strategy Sync: Acme Initial Call</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}