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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const nodes = [
    { 
      name: "Master Node (Primary)", 
      ip: "10.1.2.208", 
      status: "online", 
      cpu: "12%", 
      mem: "2.4GB / 8GB", 
      disk: "45%", 
      os: "Ubuntu 22.04 LTS",
      region: "Cambodia (PP)"
    },
    { 
      name: "Worker Node 01", 
      ip: "10.1.2.209", 
      status: "online", 
      cpu: "5%", 
      mem: "1.1GB / 4GB", 
      disk: "12%", 
      os: "Debian 11",
      region: "Cambodia (PP)"
    },
    { 
      name: "Backup Standby", 
      ip: "192.168.1.50", 
      status: "offline", 
      cpu: "0%", 
      mem: "0 / 4GB", 
      disk: "0%", 
      os: "CentOS 7",
      region: "Remote VPS"
    }
  ];

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
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95">
          <Plus size={18} />
          <span>Add New Node</span>
        </button>
      </header>

      {/* Cluster Health Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HealthCard 
          label="Total Nodes" 
          value="3" 
          detail="2 Online • 1 Offline" 
          icon={<Server size={20} />} 
          status="warning"
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
          <button className="text-emerald-500 hover:text-emerald-600 text-xs font-bold flex items-center space-x-1">
            <RefreshCw size={12} />
            <span>Sync All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {nodes.map((node, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-all group relative overflow-hidden`}
            >
              {/* Status Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${node.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${node.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                    <Server size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight flex items-center space-x-2">
                      <span>{node.name}</span>
                      {node.status === 'online' ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <AlertTriangle size={16} className="text-slate-400" />
                      )}
                    </h3>
                    <p className="text-sm font-mono text-slate-400">{node.ip} • <span className="text-[10px] uppercase font-bold">{node.region}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 lg:border-x px-8 border-slate-100 dark:border-slate-800">
                  <NodeStat icon={<Cpu size={14} />} label="CPU" value={node.cpu} />
                  <NodeStat icon={<Activity size={14} />} label="MEM" value={node.mem} />
                  <NodeStat icon={<HardDrive size={14} />} label="DISK" value={node.disk} />
                </div>

                <div className="flex items-center space-x-2">
                  <button className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'} transition-colors`}>
                    <Terminal size={18} className="text-slate-500" />
                  </button>
                  <button className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'} transition-colors`}>
                    <SettingsIcon size={18} className="text-slate-500" />
                  </button>
                  <div className="h-8 w-[1px] bg-slate-100 dark:border-slate-800 mx-2" />
                  <button className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800`}>
                    <MoreVertical size={18} className="text-slate-400" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <div className="flex items-center space-x-4">
                  <span>SYSTEM: {node.os}</span>
                  <span>CONNECTED SINCE: 12 July 2023</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="uppercase tracking-widest">{node.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
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
