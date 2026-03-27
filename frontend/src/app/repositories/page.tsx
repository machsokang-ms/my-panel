"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  GitBranch, 
  Plus, 
  Github, 
  Globe, 
  Search, 
  MoreVertical, 
  ExternalLink, 
  X, 
  Check, 
  Info,
  Lock,
  ChevronDown,
  Timer
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function RepositoriesPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const repositories = [
    { name: "my-panel-frontend", provider: "GitHub", url: "https://github.com/machsokang-ms/my-panel", branch: "main", status: "synced" },
    { name: "api-backend-core", provider: "GitHub", url: "https://github.com/org/api-core", branch: "develop", status: "outdated" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Repositories</h1>
          <p className="text-slate-400 font-medium text-sm mt-1 flex items-center space-x-2">
            <GitBranch size={14} className="text-emerald-500" />
            <span>Connect source code to automate your deployments</span>
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Add Repository</span>
        </button>
      </header>

      {/* Repo List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold text-slate-500 uppercase tracking-widest text-[10px]">Connected Sources</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search repos..." 
              className={`pl-9 pr-4 py-2 rounded-xl text-xs border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64 transition-all`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {repositories.map((repo, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700 hover:border-emerald-500/30' : 'bg-white border-slate-200 hover:border-emerald-500/30'} transition-all group shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}>
                    <Github size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{repo.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
                      <Globe size={12} />
                      <span className="truncate max-w-[200px]">{repo.url}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-12">
                  <div className="hidden md:flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Default Branch</span>
                    <div className="flex items-center space-x-1 font-mono text-sm font-bold text-emerald-500">
                      <GitBranch size={14} />
                      <span>{repo.repo?.branch || 'main'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter mb-1">Status</span>
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${repo.status === 'synced' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {repo.status}
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <MoreVertical size={18} className="text-slate-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Repository Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`relative w-full max-w-lg ${theme === 'dark' ? 'bg-[#1E293B] text-white' : 'bg-white text-slate-900'} rounded-[32px] shadow-2xl overflow-hidden border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-black tracking-tight">Add Repository</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-8">Add a new source code repository to your organization.</p>

                <div className={`p-1 rounded-2xl flex items-center mb-8 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
                  <button className={`flex-1 py-2 rounded-[14px] text-sm font-bold transition-all ${theme === 'dark' ? 'bg-[#1E293B] shadow-lg text-white' : 'bg-white shadow-sm text-slate-900'}`}>Manual</button>
                  <button className="flex-1 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">OAuth</button>
                </div>

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Repository Name</label>
                    <input 
                      type="text" 
                      placeholder="my-repository"
                      className={`w-full px-4 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'} outline-none transition-all font-medium text-sm`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Repository URL</label>
                    <input 
                      type="text" 
                      placeholder="https://github.com/username/repo.git"
                      className={`w-full px-4 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'} outline-none transition-all font-medium text-sm`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Provider</label>
                      <div className="relative">
                        <select className={`w-full px-4 py-3 rounded-2xl border appearance-none ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none font-medium text-sm`}>
                          <option>GitHub</option>
                          <option>GitLab</option>
                          <option>Bitbucket</option>
                          <option>Custom Git</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Default Branch</label>
                      <input 
                        type="text" 
                        defaultValue="main"
                        className={`w-full px-4 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none font-medium text-sm`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Project (Optional)</label>
                    <div className="relative">
                      <select className={`w-full px-4 py-3 rounded-2xl border appearance-none ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none font-medium text-sm`}>
                        <option>None</option>
                        <option>Production Cluster</option>
                        <option>Staging</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Token (Optional)</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••••••"
                      className={`w-full px-4 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'} outline-none font-medium text-sm`}
                    />
                    <p className="text-[10px] text-slate-500 font-medium px-1 flex items-center space-x-1">
                      <Info size={10} />
                      <span>Required for private repositories. Store securely in your password manager.</span>
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className={`flex-1 py-3 rounded-2xl font-bold text-sm border ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'} transition-all`}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-[1.5] py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      Add Repository
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
