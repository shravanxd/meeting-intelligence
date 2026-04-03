import React from 'react';
import { Plus, Search, Filter, Briefcase, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function MattersPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Client Matters</h1>
          <p className="text-slate-500">Manage all client workspaces, negotiations, and advice records.</p>
        </div>
        <Link href="/matters/new" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Matter
        </Link>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by client, title, or ID..." 
            className="w-full border border-slate-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button className="border border-slate-300 rounded-md px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Matter / Client</th>
              <th className="px-6 py-4">Practice Area</th>
              <th className="px-6 py-4">Jurisdiction</th>
              <th className="px-6 py-4">Last Activity</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { id: '1', title: 'Acme Corp - MSA Negotiation', client: 'Acme Corp', practice: 'Commercial', jurisdiction: 'NY, USA', time: '2 hours ago' },
              { id: '2', title: 'Novus Partnership Setup', client: 'Novus Labs', practice: 'Corporate', jurisdiction: 'DE, USA', time: '1 day ago' },
            ].map((matter) => (
              <tr key={matter.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">{matter.title}</div>
                  <div className="text-slate-500 mt-0.5 text-xs">{matter.client}</div>
                </td>
                <td className="px-6 py-4 text-slate-700">{matter.practice}</td>
                <td className="px-6 py-4 text-slate-700">{matter.jurisdiction}</td>
                <td className="px-6 py-4 text-slate-500">{matter.time}</td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/matters/${matter.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    View Workspace <ChevronRight className="w-4 h-4 ml-1" />
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