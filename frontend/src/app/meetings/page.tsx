"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Video, Calendar, Loader2, Trash2 } from 'lucide-react';

interface MeetingData {
  id: string;
  title: string;
  date: string;
  duration: string;
  matter: string;
  status: string;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedMeetings, setSelectedMeetings] = useState<Set<string>>(new Set());

  const handleBulkDelete = async () => {
      if(!confirm(`Are you sure you want to delete ${selectedMeetings.size} meeting(s)?`)) return;
      
      const idsToDelete = Array.from(selectedMeetings);
      setMeetings(prev => prev.filter(m => !idsToDelete.includes(m.id)));
      setSelectedMeetings(new Set());
      setIsDeleteMode(false);

      for (const id of idsToDelete) {
          try {
              await fetch(`http://localhost:8000/meetings/${id}`, { method: 'DELETE' });
          } catch(err) {
              console.error('Failed to delete meeting', id, err);
          }
      }
  };

  const toggleSelection = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSet = new Set(selectedMeetings);
    if (newSet.has(id)) {
        newSet.delete(id);
    } else {
        newSet.add(id);
    }
    setSelectedMeetings(newSet);
  };

  useEffect(() => {
    fetch('http://localhost:8000/meetings')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
            setMeetings(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Meetings</h1>
          <p className="text-slate-500 text-sm">Manage recorded meetings and extracted intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
            {selectedMeetings.size > 0 && (
                <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
                  <Trash2 className="w-4 h-4" /> Delete ({selectedMeetings.size})
                </button>
            )}
            <button 
                onClick={() => {
                    setIsDeleteMode(!isDeleteMode);
                    if (isDeleteMode) setSelectedMeetings(new Set());
                }} 
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm ${isDeleteMode ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              {isDeleteMode ? 'Cancel Selection' : 'Select to Delete'}
            </button>
            <Link href="/meetings/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Log New Meeting
            </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[200px]">
        {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        ) : (
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
            <tr>
              {isDeleteMode && <th className="py-3 px-4 w-12 text-center">Select</th>}
              <th className="py-3 px-4">Meeting Title</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Matter</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {meetings.length === 0 && (
                <tr>
                    <td colSpan={isDeleteMode ? 6 : 5} className="py-8 text-center text-slate-500">No meetings recorded yet.</td>
                </tr>
            )}
            {meetings.map((m) => (
              <tr 
                key={m.id} 
                className={`hover:bg-slate-50/50 transition-colors ${selectedMeetings.has(m.id) ? 'bg-red-50/50 hover:bg-red-50/80' : ''}`}
                onClick={(e) => {
                    if(isDeleteMode) toggleSelection(e, m.id);
                }}
              >
                {isDeleteMode && (
                    <td className="py-3 px-4 text-center">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                            checked={selectedMeetings.has(m.id)}
                            onChange={(e) => toggleSelection(e, m.id)}
                        />
                    </td>
                )}
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className={`p-2 rounded-md ${selectedMeetings.has(m.id) ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-slate-800">{m.title}</span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {m.date}</div>
                </td>
                <td className="py-3 px-4 text-slate-600">{m.matter !== 'None' ? m.matter : 'General'}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${m.status === 'Pending Review' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {m.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-3 items-center">
                  <Link href={`/review/${m.id}`} className="text-blue-600 hover:text-blue-800 font-medium" onClick={(e) => { if(isDeleteMode) e.preventDefault(); }}>
                    {m.status === 'Pending Review' ? 'Review' : 'View'}
                  </Link>
                  {/* Remove inline individual delete button to match requested header bulk UX */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
