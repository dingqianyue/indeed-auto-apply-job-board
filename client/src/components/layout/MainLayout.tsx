import { useState } from "react";
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';

export function MainLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      {/* Mobile Top Bar */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            J
          </div>
          <span className="font-bold text-xl tracking-tight">Jobnova</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-600 p-2 hover:bg-gray-100 rounded-md"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar - Desktop static, Mobile absolute sliding */}
      <div className={`
        fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out bg-white md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setMobileMenuOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
