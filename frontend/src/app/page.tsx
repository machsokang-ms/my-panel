"use client";

import { motion } from "framer-motion";
import { 
  Cloud, 
  Database, 
  Package, 
  Plus, 
  Activity, 
  HardDrive, 
  Network, 
  Cpu, 
  ChevronRight, 
  Folder 
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Stats Grid - Easypanel Style */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard 
          label="CPU" 
          value="8.1%" 
          detail="Load 0.39, 0.42, 0.35" 
          color="bg-orange-500" 
          icon={<Cpu size={16} />}
          progress={8.1}
        />
        <StatsCard 
          label="Memory" 
          value="59.0%" 
          detail="4.8 GB / 8.1 GB" 
          color="bg-blue-500" 
          icon={<Activity size={16} />}
          progress={59}
        />
        <StatsCard 
          label="Disk" 
          value="36.9%" 
          detail="26.4 GB / 71.7 GB" 
          color="bg-emerald-500" 
          icon={<HardDrive size={16} />}
          progress={36.9}
        />
        <StatsCard 
          label="Network" 
          value="0.00" 
          detail="MB/s Up | MB/s Down" 
          color="bg-slate-500" 
          icon={<Network size={16} />}
          progress={0}
          isNetwork
        />
      </section>

      {/* Projects Layout */}
      <header className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Projects</h2>
        <div className="flex items-center space-x-2">
          <button className={`${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'} px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1 hover:bg-slate-200 dark:hover:bg-slate-700`}>
            <Plus size={16} />
            <span>New</span>
          </button>
        </div>
      </header>

      <ProjectSection title="Infrastructure" theme={theme as string} apps={[
        { name: "main-proxy", type: "proxy", status: "online", role: "Traefik" },
        { name: "redis-cache", type: "redis", status: "online", role: "Redis" },
        { name: "postgres-db", type: "database", status: "online", role: "PostgreSQL" }
      ]} />

      <ProjectSection title="Customer Portal" theme={theme as string} apps={[
        { name: "portal-web", type: "app", status: "online", role: "Next.js" },
        { name: "portal-api", type: "api", status: "online", role: "Node.js" }
      ]} />

      <ProjectSection title="Internal Tools" theme={theme as string} apps={[
        { name: "monitoring", type: "app", status: "degraded", role: "Grafana" }
      ]} />
    </>
  );
}

function StatsCard({ label, value, detail, color, icon, progress, isNetwork = false }: { 
  label: string, 
  value: string, 
  detail: string, 
  color: string, 
  icon: React.ReactNode,
  progress: number,
  isNetwork?: boolean
}) {
  const { theme } = useTheme();
  
  return (
    <div className={`${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-2xl border shadow-sm flex items-center space-x-6 relative overflow-hidden group hover:shadow-md transition-all`}>
      {/* Decorative top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${color}`} />
      
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className={theme === 'dark' ? 'text-slate-800' : 'text-slate-100'} />
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
            strokeDasharray={175.9} 
            strokeDashoffset={175.9 - (175.9 * progress) / 100} 
            className={color.replace('bg-', 'text-')}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center ${color.replace('bg-', 'text-')} opacity-60`}>
          {icon}
        </div>
      </div>

      <div className="flex-1 text-left">
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{label}</p>
        <p className="text-2xl font-black leading-tight tracking-tight">{value}</p>
        <p className="text-[10px] text-slate-500 font-medium">{detail}</p>
      </div>

      {!isNetwork && (
        <div className="h-8 w-12 flex items-end space-x-0.5">
          {[4, 7, 5, 8, 6, 9, 7].map((h, i) => (
            <div key={i} className={`w-1 rounded-t-sm ${color} opacity-${20 + (i * 10)}`} style={{ height: `${h * 10}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectSection({ title, apps, theme }: { title: string, apps: any[], theme: string }) {
  return (
    <div className="mb-10 group text-left">
      <div className="flex items-center space-x-2 mb-4">
        <Folder size={18} className="text-slate-400" />
        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{title}</h3>
        <span className={`text-[10px] px-1.5 py-0.5 ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded font-bold`}>{apps.length}</span>
        <div className={`flex-1 h-[1px] ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} ml-4 group-hover:bg-emerald-500/20 transition-colors`} />
        <Plus size={16} className="text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {apps.map((app, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -2 }}
            className={`${theme === 'dark' ? 'bg-[#1E293B] border-slate-700 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50'} p-4 rounded-xl border hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer group/app`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3 text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${app.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'} group-hover/app:scale-110 transition-transform`}>
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold group-hover/app:text-emerald-500 transition-colors">{app.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{app.role}</p>
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${app.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-orange-500'} animate-pulse`} />
            </div>
            <div className={`flex justify-between items-center text-[10px] text-slate-400 font-bold border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-50'} pt-3 mt-1`}>
              <span className="flex items-center space-x-1">
                <Activity size={10} className="text-emerald-500" />
                <span>ONLINE</span>
              </span>
              <ChevronRight size={14} className="text-slate-300 group-hover/app:text-emerald-500 group-hover/app:translate-x-1 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
