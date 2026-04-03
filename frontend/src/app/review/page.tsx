import React from 'react';
import { Search, ListChecks, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ReviewQueuePage() {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Review Queue</h1>
          <p className="text-slate-500">Approve extracted intelligence, action items, and draft emails before syncing.</p>
        </div>
      </header>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Meeting Title</th>
              <th className="px-6 py-4">Matter</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Added</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">Vendor NDA Negotiation</div>
                <div className="text-slate-500 mt-0.5 text-xs">Meeting #1204</div>
              </td>
              <td className="px-6 py-4 text-slate-700 font-medium">Novus Partnership</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                  Review Required
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500">2 hours ago</td>
              <td className="px-6 py-4 text-right">
                <Link href={`/review/1`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200 shadow-sm transition-colors">
                  Start Review
                </Link>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors group opacity-60">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">Strategy Sync: Acme Initial Call</div>
                <div className="text-slate-500 mt-0.5 text-xs">Meeting #1203</div>
              </td>
              <td className="px-6 py-4 text-slate-700 font-medium">Acme Corp - MSA</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 border border-green-200">
                  Approved
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500">1 day ago</td>
              <td className="px-6 py-4 text-right pr-10">
                —
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}