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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storages, setStorages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 's3',
    endpoint: '',
    region: 'us-east-1',
    accessKey: '',
    secretKey: '',
    bucket: ''
  });

  useEffect(() => {
    setMounted(true);
    fetchStorage();
  }, []);

  const fetchStorage = async () => {
    try {
      const res = await fetch('/api/storage');
      const data = await res.json();
      setStorages(data);
    } catch (err) {
      console.error("Failed to fetch storage", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchStorage();
        setFormData({ name: '', type: 's3', endpoint: '', region: 'us-east-1', accessKey: '', secretKey: '', bucket: '' });
      }
    } catch (err) {
      console.error("Failed to add storage", err);
    }
  };

  if (!mounted) return null;

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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Connect Storage</span>
        </button>
      </header>

      {/* Stats Summary */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StorageStat label="Total Storage" value="-- GB" icon={<HardDrive size={16} />} />
        <StorageStat label="Total Buckets" value={storages.length.toString()} icon={<Layers size={16} />} />
        <StorageStat label="Active Connectors" value={storages.length.toString()} icon={<Database size={16} />} />
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
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Storage...</div>
          ) : storages.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">No storage connected yet</div>
          ) : storages.map((storage, i) => (
            <motion.div 
              key={storage.id}
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
                    <h3 className="font-bold text-lg leading-tight group-hover:text-emerald-500 transition-colors uppercase">{storage.name}</h3>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-tighter">{storage.type || 'S3 Compatible'}</p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:border-x border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Endpoint</span>
                    <span className="text-xs font-mono truncate max-w-[150px]">{storage.endpoint || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Bucket</span>
                    <span className="text-sm font-bold truncate max-w-[100px]">{storage.bucket || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Region</span>
                    <span className="text-sm font-bold">{storage.region || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Status</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-500 uppercase">connected</span>
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
                  <button 
                    onClick={async () => {
                      await fetch(`/api/storage/${storage.id}`, { method: 'DELETE' });
                      fetchStorage();
                    }}
                    title="Delete connector" 
                    className={`p-2 rounded-lg hover:bg-red-500/10 group/del transition-colors`}
                  >
                    <Trash2 size={18} className="text-slate-400 group-hover/del:text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Storage Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-lg rounded-3xl p-8 shadow-2xl ${theme === 'dark' ? 'bg-[#0F172A] border border-slate-800' : 'bg-white'}`}
          >
            <h2 className="text-2xl font-black mb-6">Connect S3 Storage</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Name</label>
                  <input 
                    type="text" required placeholder="My-MinIO"
                    className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Type</label>
                  <select 
                    className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="s3">S3 Compatible</option>
                    <option value="aws">AWS S3</option>
                    <option value="minio">MinIO</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Endpoint URL</label>
                <input 
                  type="text" required placeholder="https://s3.your-domain.com"
                  className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                  value={formData.endpoint}
                  onChange={(e) => setFormData({...formData, endpoint: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Access Key</label>
                  <input 
                    type="text" required
                    className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                    value={formData.accessKey}
                    onChange={(e) => setFormData({...formData, accessKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Secret Key</label>
                  <input 
                    type="password" required
                    className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                    value={formData.secretKey}
                    onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Bucket Name</label>
                  <input 
                    type="text" required placeholder="my-app-data"
                    className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                    value={formData.bucket}
                    onChange={(e) => setFormData({...formData, bucket: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Region</label>
                  <input 
                    type="text" placeholder="us-east-1"
                    className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  Confirm Connection
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
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
