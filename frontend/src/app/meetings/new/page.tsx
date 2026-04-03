"use client";
import React, { useState } from 'react';
import { Video, UploadCloud, Mic } from 'lucide-react';

export default function NewMeetingPage() {
  const [activeTab, setActiveTab] = useState<'join' | 'upload' | 'record'>('join');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Log New Meeting</h1>
        <p className="text-slate-500 text-sm">Capture, transcribe, and extract intelligence from a client or internal meeting.</p>
      </header>

      <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-lg border border-slate-200 inline-block">
        <button onClick={() => setActiveTab('join')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'join' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-600'}`}><Video className="w-4 h-4" /> Join Live Meeting</button>
        <button onClick={() => setActiveTab('upload')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'upload' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-600'}`}><UploadCloud className="w-4 h-4" /> Upload Recording</button>
        <button onClick={() => setActiveTab('record')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'record' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-600'}`}><Mic className="w-4 h-4" /> Record on Device</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-800">{activeTab === 'join' ? 'Simulate Agent Join' : activeTab === 'upload' ? 'Upload Media' : 'In-Room Recording'}</h2>
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Title</label>
            <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="e.g. Acme Corp Contract Review" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link to Matter (Optional)</label>
            <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 bg-white">
                <option value="">Select a matter...</option>
                <option value="1">Smith v. Jones</option>
                <option value="2">Acme Corp Merger</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md shadow-sm text-sm transition-colors">Begin Capture</button>
          </div>
        </div>
      </div>
    </div>
  );
}