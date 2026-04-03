export default function Home() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Workspace Dashboard</h1>
        <p className="text-slate-500">Overview of recent matters and meetings ready for review.</p>
      </header>

      {/* Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Matters", value: "2" },
          { label: "Meetings Processed", value: "14" },
          { label: "Pending Review", value: "1", color: "text-amber-600" },
          { label: "Tasks Generated", value: "32" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-1">{stat.label}</h3>
            <p className={`text-2xl font-semibold tracking-tight ${stat.color || 'text-slate-800'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <section className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800">Pending Review</h2>
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">1 Action Required</span>
            </div>
            <div className="divide-y divide-slate-100">
              
              <div className="p-6 hover:bg-slate-50 transition flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-slate-900 mb-1">Vendor NDA Negotiation</h3>
                  <p className="text-sm text-slate-500 mb-3">Matter: Novus Partnership • Added 2 hours ago</p>
                  
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Extraction</span>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Draft Email</span>
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Billable</span>
                  </div>
                </div>
                <a href="/review/1" className="text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors shadow-sm">
                  Start Review
                </a>
              </div>

            </div>
          </div>

        </section>

        {/* Side Column */}
        <section className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
               <a href="/meetings/new" className="block w-full text-left px-4 py-3 rounded-md bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition group">
                <h4 className="font-medium text-slate-900 group-hover:text-blue-700 text-sm">Log New Meeting</h4>
                <p className="text-xs text-slate-500 mt-0.5">Join, upload, or start a recording</p>
               </a>
               <button className="block w-full text-left px-4 py-3 rounded-md bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition group">
                <h4 className="font-medium text-slate-900 group-hover:text-blue-700 text-sm">Create Matter</h4>
                <p className="text-xs text-slate-500 mt-0.5">Initialize a new client workspace</p>
               </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}