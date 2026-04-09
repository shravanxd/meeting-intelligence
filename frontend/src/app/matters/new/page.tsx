"use client";
import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewMatterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    practice_area: "Commercial",
    jurisdiction: "NY, USA",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/matters/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push("/matters?success=true");
      } else {
        console.error("Failed to create matter");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto h-full flex flex-col relative">
      <Link href="/matters" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-6 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Matters
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">New Client Matter</h1>
        <p className="text-slate-500">Create a new workspace for client negotiations, advice, or disputes.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
             <label className="block text-sm font-medium text-slate-700 mb-1">Matter Title</label>
             <input 
               type="text" 
               required
               value={formData.title}
               onChange={(e) => setFormData({...formData, title: e.target.value})}
               placeholder="e.g. Acme Corp - MSA Negotiation"
               className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
             />
          </div>
          <div className="col-span-2 sm:col-span-1">
             <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
             <input 
               type="text" 
               required
               value={formData.client_name}
               onChange={(e) => setFormData({...formData, client_name: e.target.value})}
               placeholder="e.g. Acme Corp"
               className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
             />
          </div>
          <div className="col-span-2 sm:col-span-1">
             <label className="block text-sm font-medium text-slate-700 mb-1">Practice Area</label>
             <select 
               value={formData.practice_area}
               onChange={(e) => setFormData({...formData, practice_area: e.target.value})}
               className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
             >
                <option value="Commercial">Commercial</option>
                <option value="Corporate">Corporate</option>
                <option value="Litigation">Litigation</option>
                <option value="Real Estate">Real Estate</option>
                <option value="IP">Intellectual Property</option>
             </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
             <label className="block text-sm font-medium text-slate-700 mb-1">Jurisdiction</label>
             <input 
               type="text" 
               value={formData.jurisdiction}
               onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
               placeholder="e.g. NY, USA"
               className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
             />
          </div>
          <div className="col-span-2">
             <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
             <textarea 
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
               placeholder="Brief context about this matter..."
               rows={4}
               className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
             />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
           <button 
             type="submit" 
             disabled={loading}
             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
           >
             {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Matter</>}
           </button>
        </div>
      </form>
    </div>
  );
}