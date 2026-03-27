"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Cloud, 
  Database, 
  Globe, 
  LayoutDashboard, 
  Package, 
  Plus, 
  Settings, 
  ShieldCheck, 
  Terminal,
  Users,
  LogOut,
  Activity,
  HardDrive,
  Network,
  Cpu,
  ChevronRight,
  MoreHorizontal,
  Folder
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 overflow-hidden font-sans">
      {/* Sidebar - Light Version like Easypanel */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 space-y-6 hidden md:flex">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Cloud size={18} />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">My-Panel</span>
            <p className="text-[10px] text-slate-400 font-medium">v1.0.0 • EN</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" href="/" />
          <SidebarItem icon={<Package size={18} />} label="Applications" href="/apps" />
          <SidebarItem icon={<Database size={18} />} label="Databases" href="/databases" />
          <SidebarItem icon={<Globe size={18} />} label="Domains" href="/domains" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" href="/settings" />
        </nav>

        <div className="pt-4 border-t border-slate-100 space-y-1">
          <SidebarItem icon={<Users size={18} />} label="Users" href="/users" />
          <div className="flex items-center justify-between px-3 py-2 text-slate-500 hover:text-slate-900 cursor-pointer rounded-lg transition-colors group">
            <div className="flex items-center space-x-3">
              <Activity size={18} />
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <div className="w-8 h-4 bg-slate-200 rounded-full flex items-center px-1">
              <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <button 
            onClick={() => {
              document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
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
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <div className="flex items-center space-x-2">
            <button className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1 hover:bg-slate-200">
              <Plus size={16} />
              <span>New</span>
            </button>
          </div>
        </header>

        <ProjectSection title="Infrastructure" apps={[
          { name: "main-proxy", type: "proxy", status: "online", role: "Traefik" },
          { name: "redis-cache", type: "redis", status: "online", role: "Redis" },
          { name: "postgres-db", type: "database", status: "online", role: "PostgreSQL" }
        ]} />

        <ProjectSection title="Customer Portal" apps={[
          { name: "portal-web", type: "app", status: "online", role: "Next.js" },
          { name: "portal-api", type: "api", status: "online", role: "Node.js" }
        ]} />

        <ProjectSection title="Internal Tools" apps={[
          { name: "monitoring", type: "app", status: "degraded", role: "Grafana" }
        ]} />
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, href = "/" }: { icon: React.ReactNode, label: string, href?: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href}>
      <div className={`
        flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium
        ${active ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
      `}>
        {icon}
        <span>{label}</span>
      </div>
    </Link>
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
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-6 relative overflow-hidden group hover:shadow-md transition-all">
      {/* Decorative top bar like Easypanel */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${color}`} />
      
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Simple Progress Circle */}
        <svg className="w-16 h-16 transform -rotate-90">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
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

      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{label}</p>
        <p className="text-2xl font-black text-slate-900 leading-tight">{value}</p>
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

function ProjectSection({ title, apps }: { title: string, apps: any[] }) {
  return (
    <div className="mb-10 group">
      <div className="flex items-center space-x-2 mb-4">
        <Folder size={18} className="text-slate-400" />
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold">{apps.length}</span>
        <div className="flex-1 h-[1px] bg-slate-100 ml-4 group-hover:bg-slate-200 transition-colors" />
        <Plus size={16} className="text-slate-300 hover:text-slate-600 cursor-pointer" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {apps.map((app, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group/app">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${app.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                  <Package size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover/app:text-emerald-600 transition-colors">{app.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{app.role}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${app.status === 'online' ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse`} />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-50 pt-3">
              <span>UPTIME: 12d 4h</span>
              <ChevronRight size={14} className="text-slate-300 group-hover/app:text-slate-600 group-hover/app:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
