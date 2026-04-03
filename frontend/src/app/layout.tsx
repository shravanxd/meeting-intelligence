import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Briefcase, Video, ListChecks, Activity } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legal Buddy by Novus AI",
  description: "A meeting intelligence demo for a sovereign legal operating system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="hidden w-64 md:flex flex-col bg-white border-r border-slate-200 p-4">
            <div className="font-bold text-lg mb-8 tracking-tight text-slate-800 px-3">
              Legal Buddy <span className="text-blue-600 block text-xs tracking-normal mt-1">by Novus AI</span>
            </div>
            
            <nav className="flex-1 space-y-1.5 text-sm font-medium">
              <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link href="/matters" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">
                <Briefcase className="w-4 h-4" /> Matters
              </Link>
              <Link href="/meetings" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">
                <Video className="w-4 h-4" /> Meetings
              </Link>
              <Link href="/review" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">
                <ListChecks className="w-4 h-4" /> Review Queue
              </Link>
              <Link href="/activity" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">
                <Activity className="w-4 h-4" /> Audit Log
              </Link>
            </nav>
            
            <div className="mt-auto items-center flex pt-4 border-t border-slate-200 px-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">LT</div>
              <div className="ml-3 text-sm truncate">
                <p className="font-medium text-slate-700 truncate">AI Admin</p>
                <p className="text-xs text-slate-500 truncate">Legal Team</p>
              </div>
            </div>
          </aside>
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
} 