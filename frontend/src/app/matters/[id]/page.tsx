"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Clock, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";

export default function MatterWorkspace({ params }: { params: { id: string } }) {
  const [matter, setMatter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/matters/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setMatter(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div className="p-8">Loading workspace...</div>;
  }

  if (!matter) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Matter Not Found</h2>
        <Link href="/matters" className="text-blue-600 hover:underline">
          Return to Matters
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col relative">
      <Link href="/matters" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-6 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Matters
      </Link>

      <header className="mb-8 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold uppercase tracking-wider">
            {matter.client_name}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-4">{matter.title}</h1>
        
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-400" />
            {matter.practice_area}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            {matter.jurisdiction}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Opened: {new Date(matter.created_at).toLocaleDateString()}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
           <h2 className="text-lg font-bold text-slate-800 mb-4">Description</h2>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[150px] text-slate-700">
             {matter.description || "No description provided for this matter."}
           </div>

           <h2 className="text-lg font-bold text-slate-800 mb-4 mt-8">Recent Meetings</h2>
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[200px] text-slate-500">
             <div className="mb-2">No meetings have been attached to this matter yet.</div>
             <Link href="/meetings" className="text-blue-600 font-medium hover:underline">
               Go to Review Queue to attach a meeting
             </Link>
           </div>
        </div>

        <div className="col-span-1 space-y-6">
           <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
             <h3 className="font-semibold text-slate-800 mb-3">Matter Details</h3>
             <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-slate-500">Matter ID</span>
                  <span className="font-medium text-slate-900 truncate max-w-[120px]" title={matter.id}>{matter.id.substring(0,8)}...</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium text-emerald-600">Active</span>
                </li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}