"use client";

import { motion } from "framer-motion";
import { 
  HardDrive, 
  Plus, 
  ShieldCheck, 
  Key, 
  Database, 
  ExternalLink, 
  Search,
  MoreHorizontal,
  Cloud,
  Layers,
  Settings,
  Lock,
  Eye,
  Trash2
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function StoragePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const storages = [
    { 
      name: "MinIO Local", 
      provider: "MinIO (Self-hosted)", 
      endpoint: "http://10.1.2.208:9000", 
      buckets: 4, 
      usage: "12.4 GB", 
      status: "connected" 
    },
    { 
      name: "AWS Assets", 
      provider: "AWS S3", 
      endpoint: "s3.ap-southeast-1.amazonaws.com", 
      buckets: 2, 
      usage: "450 MB", 
      status: "connected" 
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Storage S3</h1>
          <p className="text-slate-400 font-medium text-sm mt-1 flex items-center space-x-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Connect and manage S3-compatible storage for your Apps</span>
          </p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
          <Plus size={18} />
          <span>Connect Storage</span>
        </button>
      </header>

      {/* Stats Summary */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StorageStat label="Total Storage" value="12.8 GB" icon={<HardDrive size={16} />} />
        <StorageStat label="Total Buckets" value="6" icon={<Layers size={16} />} />
        <StorageStat label="Active Connectors" value="2" icon={<Database size={16} />} />
        <StorageStat label="Data Security" value="Encrypted" icon={<Lock size={16} />} color="text-emerald-500" />
      </section>

      {/* Connection List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold text-slate-500 uppercase tracking-widest text-[10px]">Cloud Connectors</h2>
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter storage..." 
              className={`pl-9 pr-4 py-1.5 rounded-lg border text-xs ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-48 transition-all`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {storages.map((storage, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700 hover:border-emerald-500/30' : 'bg-white border-slate-200 hover:border-emerald-500/30'} transition-all group cursor-pointer shadow-sm`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800 text-emerald-500' : 'bg-slate-50 text-emerald-600'}`}>
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-emerald-500 transition-colors">{storage.name}</h3>
                    <p className="text-sm font-medium text-slate-400">{storage.provider}</p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:border-x border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Endpoint</span>
                    <span className="text-xs font-mono truncate max-w-[150px]">{storage.endpoint}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Buckets</span>
                    <span className="text-sm font-bold">{storage.buckets} Buckets</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Usage</span>
                    <span className="text-sm font-bold">{storage.usage}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Status</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-500 uppercase">{storage.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button title="View credentials" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <Key size={18} className="text-slate-400" />
                  </button>
                  <button title="Configure buckets" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <Settings size={18} className="text-slate-400" />
                  </button>
                  <button title="Delete connector" className={`p-2 rounded-lg hover:bg-red-500/10 group/del transition-colors`}>
                    <Trash2 size={18} className="text-slate-400 group-hover/del:text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Credential Setup UI Preview */}
      <section className={`p-8 rounded-3xl border border-dashed ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-emerald-50/30 border-emerald-200'} flex flex-col items-center text-center`}>
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center mb-6">
          <Key size={32} className="text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">Connect S3 Keys</h3>
        <p className="text-slate-400 text-sm max-w-md mb-8">
          Enter your Access Key and Secret Key to allow automated backups and data storage for your deployed applications.
        </p>
        <div className="flex space-x-4">
          <button className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
            Start Configuration
          </button>
          <button className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-white dark:hover:bg-slate-800 transition-all">
            <ExternalLink size={16} />
            <span>MinIO Documentation</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function StorageStat({ label, value, icon, color = "text-slate-900 dark:text-white" }: { label: string, value: string, icon: React.ReactNode, color?: string }) {
  const { theme } = useTheme();
  return (
    <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center space-x-2 text-slate-400 mb-2">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
      </div>
      <p className={`text-lg font-black ${color}`}>{value}</p>
    </div>
  );
}
