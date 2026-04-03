"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Plus, Search, Filter, ChevronRight, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function MattersContent() {
  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col relative">
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-emerald-200 rounded-lg shadow-xl p-4 pr-12 flex items-start gap-4 transform transition-all duration-500 ease-out translate-y-2 opacity-100">
           <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
           <div>
             <h4 className="text-sm font-bold text-slate-900">Intelligence Synced</h4>
             <p className="text-xs text-slate-500 mt-1">The meeting analysis has been successfully attached to the "Acme Corp - MSA Negotiation" matter.</p>
           </div>
           <button onClick={() => setShowToast(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>
      )}

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
            className="w-full border border-slate-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <button className="border border-slate-300 rounded-md px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-2 transition-colors">
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
              { id: "1", title: "Acme Corp - MSA Negotiation", client: "Acme Corp", practice: "Commercial", jurisdiction: "NY, USA", time: "Just now", highlight: showToast },
              { id: "2", title: "Novus Partnership Setup", client: "Novus Labs", practice: "Corporate", jurisdiction: "DE, USA", time: "1 day ago", highlight: false },
            ].map((matter) => (
              <tr key={matter.id} className={`hover:bg-slate-50 transition-colors group ${matter.highlight ? "bg-blue-50/30" : ""}`}>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                    {matter.title}
                    {matter.highlight && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-full tracking-wider animate-pulse">Updated</span>}
                  </div>
                  <div className="text-slate-500 mt-0.5 text-xs">{matter.client}</div>
                </td>
                <td className="px-6 py-4 text-slate-700">
                   <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-medium text-slate-600">{matter.practice}</span>
                </td>
                <td className="px-6 py-4 text-slate-700">{matter.jurisdiction}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{matter.time}</td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/matters/${matter.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold uppercase text-[11px] tracking-wider">
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

export default function MattersPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading matters...</div>}>
       <MattersContent />
    </Suspense>
  );
}
