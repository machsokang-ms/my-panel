"use client";

import { motion } from "framer-motion";
import { 
  Server, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Shield, 
  Cpu, 
  Activity, 
  HardDrive,
  MoreVertical,
  Wifi,
  Terminal,
  Settings as SettingsIcon,
  RefreshCw
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ServersPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servers, setServers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    ip_address: '',
    cpu_cores: 1,
    ram_gb: 1
  });

  useEffect(() => {
    setMounted(true);
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const res = await fetch('http://10.1.2.208/api/servers');
      const data = await res.json();
      setServers(data);
    } catch (err) {
      console.error("Failed to fetch servers", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://10.1.2.208/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchServers();
        setFormData({ name: '', ip_address: '', cpu_cores: 1, ram_gb: 1 });
      }
    } catch (err) {
      console.error("Failed to add server", err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Server Cluster</h1>
          <p className="text-slate-400 font-medium text-sm mt-1 flex items-center space-x-2">
            <Shield size={14} className="text-emerald-500" />
            <span>High-Availability Cluster Management</span>
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Add New Node</span>
        </button>
      </header>

      {/* Cluster Health Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HealthCard 
          label="Total Nodes" 
          value={servers.length.toString()} 
          detail={`${servers.filter(s => s.status === 'active' || s.status === 'online').length} Online • ${servers.filter(s => s.status !== 'active' && s.status !== 'online').length} Offline`} 
          icon={<Server size={20} />} 
          status={servers.some(s => s.status === 'offline') ? 'warning' : 'online'}
        />
        <HealthCard 
          label="Uptime Progress" 
          value="99.98%" 
          detail="Last 30 Days" 
          icon={<Activity size={20} />} 
          status="online"
        />
        <HealthCard 
          label="Connectivity" 
          value="Good" 
          detail="Avg Latency: 4ms" 
          icon={<Wifi size={20} />} 
          status="online"
        />
      </section>

      {/* Node List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold text-slate-500 uppercase tracking-widest text-[10px]">Active Nodes</h2>
          <button 
            onClick={fetchServers}
            className="text-emerald-500 hover:text-emerald-600 text-xs font-bold flex items-center space-x-1"
          >
            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            <span>Sync All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Nodes...</div>
          ) : servers.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">No nodes added yet</div>
          ) : servers.map((node, i) => (
            <motion.div 
              key={node.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-all group relative overflow-hidden`}
            >
              {/* Status Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${node.status === 'active' || node.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${node.status === 'active' || node.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                    <Server size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight flex items-center space-x-2">
                      <span>{node.name}</span>
                      {(node.status === 'active' || node.status === 'online') ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <AlertTriangle size={16} className="text-slate-400" />
                      )}
                    </h3>
                    <p className="text-sm font-mono text-slate-400">{node.ip_address} • <span className="text-[10px] uppercase font-bold">{node.region || 'Local'}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 lg:border-x px-8 border-slate-100 dark:border-slate-800">
                  <NodeStat icon={<Cpu size={14} />} label="CPU" value={`${node.cpu_cores} Cores`} />
                  <NodeStat icon={<Activity size={14} />} label="MEM" value={`${node.ram_gb} GB`} />
                  <NodeStat icon={<HardDrive size={14} />} label="APPS" value="Active" />
                </div>

                <div className="flex items-center space-x-2">
                  <button className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'} transition-colors`}>
                    <Terminal size={18} className="text-slate-500" />
                  </button>
                  <button className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'} transition-colors`}>
                    <SettingsIcon size={18} className="text-slate-500" />
                  </button>
                  <div className="h-8 w-[1px] bg-slate-100 dark:border-slate-800 mx-2" />
                  <button 
                    onClick={async () => {
                      await fetch(`http://10.1.2.208/api/servers/${node.id}`, { method: 'DELETE' });
                      fetchServers();
                    }}
                    className={`p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors`}
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <div className="flex items-center space-x-4">
                  <span>SYSTEM: {node.os || 'Ubuntu 22.04 LTS'}</span>
                  <span>CONNECTED SINCE: {node.created_at ? new Date(node.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' || node.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="uppercase tracking-widest">{node.status || 'active'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Server Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-lg rounded-3xl p-8 shadow-2xl ${theme === 'dark' ? 'bg-[#0F172A] border border-slate-800' : 'bg-white'}`}
          >
            <h2 className="text-2xl font-black mb-6">Add New Server Node</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Node Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Production-Node-01"
                  className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">IP Address / SSH Host</label>
                <input 
                  type="text" 
                  required
                  placeholder="10.1.2.x or domain.com"
                  className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                  value={formData.ip_address}
                  onChange={(e) => setFormData({...formData, ip_address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">CPU Cores</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                    value={formData.cpu_cores}
                    onChange={(e) => setFormData({...formData, cpu_cores: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">RAM (GB)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                    value={formData.ram_gb}
                    onChange={(e) => setFormData({...formData, ram_gb: parseInt(e.target.value)})}
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
                  Confirm Node
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function HealthCard({ label, value, detail, icon, status }: { label: string, value: string, detail: string, icon: React.ReactNode, status: string }) {
  const { theme } = useTheme();
  return (
    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} shadow-sm relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 p-4 opacity-5 ${status === 'online' ? 'text-emerald-500' : 'text-orange-500'}`}>
        {icon}
      </div>
      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className={`text-[10px] font-bold ${status === 'online' ? 'text-emerald-500' : 'text-slate-400'}`}>{detail}</p>
    </div>
  );
}

function NodeStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col items-center lg:items-start">
      <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase">{label}</span>
      </div>
      <span className="text-sm font-bold truncate max-w-[100px]">{value}</span>
    </div>
  );
}
