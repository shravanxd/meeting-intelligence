import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
            <div className="font-bold text-lg mb-8 tracking-tight text-slate-800">
              Legal Buddy <span className="text-blue-600 block text-xs tracking-normal mt-1">by Novus AI</span>
            </div>
            
            <nav className="flex-1 space-y-2 text-sm font-medium">
              <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-700">
                Dashboard
              </a>
              <a href="/matters" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                Matters
              </a>
              <a href="/meetings" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                Meetings
              </a>
              <a href="/review" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                Review Queue
              </a>
              <a href="/activity" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                Audit Log
              </a>
            </nav>
            
            <div className="mt-auto items-center flex pt-4 border-t border-slate-200">
              <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0"></div>
              <div className="ml-3 text-sm">
                <p className="font-medium text-slate-700">AI Admin</p>
                <p className="text-xs text-slate-500">Legal Team</p>
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
