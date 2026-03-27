"use client";

import { motion } from "framer-motion";
import { 
  LineChart, 
  Server, 
  Activity, 
  Globe, 
  Shield, 
  Package, 
  Network, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  HardDrive,
  Bell,
  Lock,
  Unlock,
  ChevronRight,
  Monitor
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function MonitoringPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const tabs = ["Overview", "Domains", "Servers", "Containers", "Security", "Network", "Settings"];

  return (
    <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20`}>
      <header className="flex justify-between items-center">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Infrastructure Monitoring</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Real-time analytics and insights powered by My-Panel Core</p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
        </div>
      </header>

      {/* Stats Cards Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MonitorCard 
          title="Total Servers" 
          value="6" 
          subValue="136 CPU cores" 
          icon={<Server size={20} />} 
          trend="up"
        />
        <MonitorCard 
          title="Resource Usage" 
          value="1.3%" 
          subValue="CPU usage across all servers" 
          icon={<Activity size={20} />} 
          trend="down"
        />
        <MonitorCard 
          title="Active Domains" 
          value="0" 
          subValue="Protected by Cloudflare" 
          icon={<Globe size={20} />} 
        />
        <MonitorCard 
          title="Security Events" 
          value="0" 
          subValue="Blocked in last 24h" 
          icon={<Shield size={20} />} 
          color="border-red-500/20"
        />
      </section>

      {/* Tab Navigation */}
      <div className={`p-1 rounded-2xl flex items-center mb-8 ${theme === 'dark' ? 'bg-[#1e293b]/50' : 'bg-slate-100'}`}>
        {tabs.map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab 
              ? (theme === 'dark' ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'bg-white text-emerald-600 shadow-sm')
              : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab === "Overview" && <Monitor size={14} />}
            {tab === "Domains" && <Globe size={14} />}
            {tab === "Servers" && <Server size={14} />}
            {tab === "Containers" && <Package size={14} />}
            {tab === "Security" && <Shield size={14} />}
            {tab === "Network" && <Network size={14} />}
            {tab === "Settings" && <Settings size={14} />}
            <span>{tab}</span>
          </button>
        ))}
      </div>

      {/* Detailed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Infrastructure Left Column */}
        <section className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="flex items-center space-x-3 text-lg font-black tracking-tight">
              <Server size={24} className="text-emerald-500" />
              <span>Infrastructure</span>
            </h3>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg">6 ACTIVE</span>
          </div>

          <div className="space-y-4">
            <InfraRow icon={<Server size={18} />} label="Servers" count={6} detail="136 cores" />
            <InfraRow icon={<Package size={18} />} label="Containers" count={0} status="online" />
            <InfraRow icon={<Globe size={18} />} label="Domains" count={0} status="protected" />
          </div>
        </section>

        {/* Resources Middle Column */}
        <section className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="flex items-center space-x-3 text-lg font-black tracking-tight">
              <Activity size={24} className="text-emerald-500" />
              <span>Resources</span>
            </h3>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg">HEALTHY</span>
          </div>

          <div className="space-y-6">
            <ResourceBar label="CPU Usage" value={1.3} color="bg-emerald-500" />
            <ResourceBar label="Memory Usage" value={0} color="bg-emerald-500" />
            <ResourceBar label="Disk Usage" value={0} color="bg-emerald-500" />
          </div>
        </section>

        {/* Security Right Column */}
        <section className={`p-8 rounded-[32px] border ${theme === 'dark' ? 'bg-[#1E293B]/20 border-red-500/10' : 'bg-red-50/10 border-red-100'} shadow-sm`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="flex items-center space-x-3 text-lg font-black tracking-tight">
              <Shield size={24} className="text-red-500" />
              <span>Security</span>
            </h3>
            <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-black rounded-lg uppercase tracking-widest">Protected</span>
          </div>

          <div className="space-y-4">
            <SecurityRow icon={<Bell size={18} />} label="Active Alerts" count={0} color="text-red-500" />
            <SecurityRow icon={<Lock size={18} />} label="Blocked IPs" count={0} color="text-red-500" />
            <SecurityRow icon={<Unlock size={18} />} label="Allowed IPs" count={0} color="text-emerald-500" />
          </div>
        </section>
      </div>
    </div>
  );
}

function MonitorCard({ title, value, subValue, icon, trend, color = "border-slate-800" }: { title: string, value: string, subValue: string, icon: React.ReactNode, trend?: 'up'|'down', color?: string }) {
  const { theme } = useTheme();
  return (
    <div className={`p-6 rounded-3xl border ${theme === 'dark' ? `bg-[#1E293B] ${color}` : 'bg-white border-slate-200'} shadow-sm relative overflow-hidden group hover:shadow-lg transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{title}</p>
          <p className="text-3xl font-black">{value}</p>
        </div>
        <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-50 text-emerald-600'} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {trend && (
           <Activity size={12} className={trend === 'up' ? 'text-emerald-500' : 'text-emerald-500'} />
        )}
        <p className="text-[10px] text-slate-500 font-bold">{subValue}</p>
      </div>
    </div>
  );
}

function InfraRow({ icon, label, count, detail, status }: { icon: React.ReactNode, label: string, count: number, detail?: string, status?: string }) {
  const { theme } = useTheme();
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl ${theme === 'dark' ? 'bg-slate-900/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'} transition-all cursor-pointer`}>
      <div className="flex items-center space-x-3 text-slate-400">
        {icon}
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-lg font-black">{count}</span>
        {detail && <span className="px-2 py-0.5 bg-slate-800 text-[10px] text-slate-300 rounded font-bold uppercase">{detail}</span>}
        {status && <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${status === 'online' ? 'animate-pulse' : ''}`} />}
      </div>
    </div>
  );
}

function ResourceBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span className="text-slate-100">{value}%</span>
      </div>
      <div className="h-1 lg:h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value || 1}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}

function SecurityRow({ icon, label, count, color }: { icon: React.ReactNode, label: string, count: number, color: string }) {
  const { theme } = useTheme();
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl ${theme === 'dark' ? 'bg-slate-900/30' : 'bg-white'} border dark:border-slate-800 border-slate-100`}>
      <div className="flex items-center space-x-3 text-slate-500">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className={`text-xl font-black ${color}`}>{count}</span>
    </div>
  );
}
