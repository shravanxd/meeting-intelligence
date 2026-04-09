"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Plus, Search, Filter, ChevronRight, CheckCircle2, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function MattersContent() {
  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [matters, setMatters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedMatters, setSelectedMatters] = useState<Set<string>>(new Set());

  const fetchMatters = () => {
    fetch("http://localhost:8000/matters/")
      .then((res) => res.json())
      .then((data) => {
        setMatters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMatters();
  }, []);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const handleBulkDelete = async () => {
    if (selectedMatters.size === 0) return;
    
    try {
      await Promise.all(
        Array.from(selectedMatters).map((id) =>
          fetch(`http://localhost:8000/matters/${id}`, { method: "DELETE" })
        )
      );
      setSelectedMatters(new Set());
      setIsDeleteMode(false);
      fetchMatters();
    } catch (err) {
      console.error("Failed to delete matters", err);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedMatters);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMatters(newSelected);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col relative">
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-emerald-200 rounded-lg shadow-xl p-4 pr-12 flex items-start gap-4 transform transition-all duration-500 ease-out translate-y-2 opacity-100">
           <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
           <div>
             <h4 className="text-sm font-bold text-slate-900">Intelligence Synced</h4>
             <p className="text-xs text-slate-500 mt-1">The meeting analysis has been successfully attached to the matter.</p>
           </div>
           <button onClick={() => setShowToast(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Client Matters</h1>
          <p className="text-slate-500">Manage all client workspaces, negotiations, and advice records.</p>
        </div>
        <div className="flex items-center gap-3">
          {isDeleteMode ? (
             <div className="flex items-center gap-2">
               <button 
                 onClick={() => { setIsDeleteMode(false); setSelectedMatters(new Set()); }}
                 className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-md shadow-sm text-sm transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleBulkDelete}
                 disabled={selectedMatters.size === 0}
                 className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md shadow-sm text-sm transition-colors flex items-center gap-2"
               >
                 <Trash2 className="w-4 h-4" /> Delete ({selectedMatters.size})
               </button>
             </div>
          ) : (
             <div className="flex items-center gap-2">
               <button 
                 onClick={() => setIsDeleteMode(true)}
                 className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-md shadow-sm text-sm transition-colors"
               >
                 Select to Delete
               </button>
               <Link href="/matters/new" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm text-sm transition-colors flex items-center gap-2">
                 <Plus className="w-4 h-4" /> New Matter
               </Link>
             </div>
          )}
        </div>
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
              {isDeleteMode && <th className="px-6 py-4 w-12"></th>}
              <th className="px-6 py-4">Matter / Client</th>
              <th className="px-6 py-4">Practice Area</th>
              <th className="px-6 py-4">Jurisdiction</th>
              <th className="px-6 py-4">Last Activity</th>
              {!isDeleteMode && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={isDeleteMode ? 6 : 5} className="px-6 py-8 text-center text-slate-500">Loading matters...</td>
              </tr>
            ) : matters.length === 0 ? (
              <tr>
                <td colSpan={isDeleteMode ? 6 : 5} className="px-6 py-8 text-center text-slate-500">No matters found. Create one.</td>
              </tr>
            ) : (
              matters.map((matter, index) => (
                <tr key={matter.id} className={`hover:bg-slate-50 transition-colors group ${index === matters.length - 1 && showToast ? "bg-blue-50/30" : ""} ${selectedMatters.has(matter.id) ? "bg-red-50/40" : ""}`}>
                  {isDeleteMode && (
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedMatters.has(matter.id)}
                        onChange={() => toggleSelect(matter.id)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                      {matter.title}
                      {index === matters.length - 1 && showToast && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-full tracking-wider animate-pulse">Updated</span>}
                    </div>
                    <div className="text-slate-500 mt-0.5 text-xs">{matter.client_name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-medium text-slate-600">{matter.practice_area}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{matter.jurisdiction}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">Just now</td>
                  {!isDeleteMode && (
                    <td className="px-6 py-4 text-right">
                      <Link href={`/matters/${matter.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold uppercase text-[11px] tracking-wider">
                        View Workspace <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </td>
                  )}
                </tr>
              ))
            )}
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
