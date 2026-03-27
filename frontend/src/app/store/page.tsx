"use client";

import { motion } from "framer-motion";
import { Search, Plus, Cloud, Globe, Database, Cpu } from "lucide-react";
import { useTheme } from "next-themes";

export default function AppStore() {
  const { theme } = useTheme();

  const apps = [
    { name: "MinIO", desc: "S3-Compatible Storage", icon: <Cloud className="text-blue-500" /> },
    { name: "WordPress", desc: "CMS & Website Builder", icon: <Globe className="text-blue-500" /> },
    { name: "PostgreSQL", desc: "Relational Database", icon: <Database className="text-blue-500" /> },
    { name: "Redis", desc: "In-memory Data Structure Store", icon: <Cpu className="text-red-500" /> },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>App Store</h1>
          <p className="text-slate-400 text-sm">One-click deployment for your favorite services.</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className={`pl-10 pr-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64 text-sm`}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4 }}
            className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50'} transition-all cursor-pointer shadow-sm group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                {app.icon}
              </div>
              <button className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                <Plus size={18} />
              </button>
            </div>
            <h3 className="text-lg font-bold mb-1">{app.name}</h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">{app.desc}</p>
            <button className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-sm font-bold hover:opacity-90 transition-opacity">
              Deploy Instance
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
