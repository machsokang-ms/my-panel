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
  Terminal 
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-transparent text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass m-4 rounded-3xl flex flex-col p-6 space-y-8 hidden md:flex">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cloud size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">My-Panel</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <SidebarItem icon={<Package size={20} />} label="Applications" />
          <SidebarItem icon={<Database size={20} />} label="Databases" />
          <SidebarItem icon={<Globe size={20} />} label="App Store" />
          <SidebarItem icon={<Terminal size={20} />} label="Logs" />
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <SidebarItem icon={<ShieldCheck size={20} />} label="SSL" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back</h1>
            <p className="text-white/50 text-sm">Everything is running smoothly today.</p>
          </div>
          <button className="premium-gradient px-4 py-2 rounded-xl flex items-center space-x-2 font-medium hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-blue-500/20">
            <Plus size={20} />
            <span>New App</span>
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Live Apps" value="12" icon={<Package className="text-blue-400" />} />
          <StatCard label="Memory Used" value="4.2 GB" icon={<BarChart3 className="text-purple-400" />} />
          <StatCard label="Storage" value="82%" icon={<Database className="text-amber-400" />} />
          <StatCard label="SSL Active" value="100%" icon={<ShieldCheck className="text-emerald-400" />} />
        </section>

        {/* Recent Apps */}
        <section>
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-xl font-semibold">Running Applications</h2>
            <button className="text-sm text-blue-400 hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <AppItem name="Main API" status="Running" url="api.example.com" uptime="12d 4h" />
            <AppItem name="Dashboard UI" status="Running" url="panel.example.com" uptime="12d 4h" />
            <AppItem name="Redis Cache" status="Degraded" url="redis:6379" uptime="2d 1h" color="text-amber-400" />
            <AppItem name="Postgres DB" status="Running" url="db:5432" uptime="45d 8h" />
          </div>
        </section>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
      ${active ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}
    `}>
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-5 rounded-2xl flex items-center justify-between"
    >
      <div>
        <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
        {icon}
      </div>
    </motion.div>
  );
}

function AppItem({ name, status, url, uptime, color = "text-emerald-400" }: { name: string, status: string, url: string, uptime: string, color?: string }) {
  return (
    <div className="glass p-5 rounded-3xl hover:bg-white/10 transition-colors border-white/5 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <Package className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-white/30 text-xs font-mono">{url}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 text-sm font-medium ${color}`}>
          <div className={`w-2 h-2 rounded-full ${color.replace('text', 'bg')} animate-pulse`} />
          <span>{status}</span>
        </div>
      </div>
      <div className="flex justify-between items-center text-xs text-white/40 font-medium">
        <span>Uptime: {uptime}</span>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="px-3 py-1 bg-white/5 rounded-lg hover:bg-white/10">Manage</button>
          <button className="px-3 py-1 bg-white/5 rounded-lg hover:bg-white/10">Logs</button>
        </div>
      </div>
    </div>
  );
}
