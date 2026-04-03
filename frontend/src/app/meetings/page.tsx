"use client";
import React from 'react';
import Link from 'next/link';
import { Plus, Video, Calendar } from 'lucide-react';

export default function MeetingsPage() {
  const meetings = [
    { id: 1, title: 'Acme Corp Merger - Initial Negotiation', date: '2026-04-03', duration: '45m', matter: 'Acme Corp Merger', status: 'Pending Review' },
    { id: 2, title: 'Smith v. Jones Settlement Discussion', date: '2026-04-01', duration: '1h 15m', matter: 'Smith v. Jones', status: 'Approved' },
    { id: 3, title: 'Internal Weekly Sync', date: '2026-03-29', duration: '30m', matter: 'Internal', status: 'Approved' }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Meetings</h1>
          <p className="text-slate-500 text-sm">Manage recorded meetings and extracted intelligence.</p>
        </div>
        <Link href="/meetings/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Log New Meeting
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
            <tr>
              <th className="py-3 px-4">Meeting Title</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Matter</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {meetings.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-md"><Video className="w-4 h-4" /></div>
                  <span className="font-medium text-slate-800">{m.title}</span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {m.date}</div>
                </td>
                <td className="py-3 px-4 text-slate-600">{m.matter}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${m.status === 'Pending Review' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {m.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link href={`/review/${m.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {m.status === 'Pending Review' ? 'Review' : 'View'}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}