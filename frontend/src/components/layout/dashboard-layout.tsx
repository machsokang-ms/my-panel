"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  Folder,
  Menu,
  X,
  Server,
  Github,
  GitBranch,
  Search
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-[#0F172A] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'} overflow-hidden font-sans transition-colors duration-300`}>
      {/* Sidebar - Desktop */}
      <aside className={`w-64 ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} border-r flex flex-col p-4 space-y-6 hidden md:flex z-50`}>
        <Branding theme={theme as string} />
        <Navigation theme={theme as string} />
        <BottomSection theme={theme as string} setTheme={setTheme} />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 left-0 bottom-0 w-64 ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'} border-r flex flex-col p-4 space-y-6 z-[70] md:hidden shadow-2xl`}
          >
            <div className="flex justify-end pr-2 pt-2">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <Branding theme={theme as string} />
            <Navigation theme={theme as string} />
            <BottomSection theme={theme as string} setTheme={setTheme} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1E293B] border-b dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <Cloud size={18} />
            </div>
            <span className="font-bold">My-Panel</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto relative scroll-smooth p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function Branding({ theme }: { theme: string }) {
  return (
    <div className="flex items-center space-x-3 px-3 py-2">
      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-emerald-500/20 shadow-lg">
        <Cloud size={18} />
      </div>
      <div>
        <span className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>My-Panel</span>
        <p className="text-[10px] text-slate-400 font-medium">v1.0.0 • EN</p>
      </div>
    </div>
  );
}

function Navigation({ theme }: { theme: string }) {
  return (
    <nav className="flex-1 space-y-1">
      <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" href="/" theme={theme} />
      <SidebarItem icon={<Server size={18} />} label="Servers" href="/servers" theme={theme} />
      <SidebarItem icon={<Package size={18} />} label="Applications" href="/apps" theme={theme} />
      <SidebarItem icon={<GitBranch size={18} />} label="Repositories" href="/repositories" theme={theme} />
      <SidebarItem icon={<Database size={18} />} label="Databases" href="/databases" theme={theme} />
      <SidebarItem icon={<HardDrive size={18} />} label="Storage" href="/storage" theme={theme} />
      <SidebarItem icon={<Globe size={18} />} label="Domains" href="/domains" theme={theme} />
      <SidebarItem icon={<Settings size={18} />} label="Settings" href="/settings" theme={theme} />
    </nav>
  );
}

function BottomSection({ theme, setTheme }: { theme: string, setTheme: (t: string) => void }) {
  return (
    <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'} space-y-1`}>
      <SidebarItem icon={<Users size={18} />} label="Users" href="/users" theme={theme} />
      
      {/* Dark Mode Toggle */}
      <div 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`flex items-center justify-between px-3 py-2 text-slate-500 ${theme === 'dark' ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900'} cursor-pointer rounded-lg transition-all group`}
      >
        <div className="flex items-center space-x-3">
          <Activity size={18} />
          <span className="text-sm font-medium">Dark Mode</span>
        </div>
        <div className={`w-8 h-4 ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-200'} rounded-full flex items-center px-1 transition-colors relative`}>
          <div className={`w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-all duration-200 absolute ${theme === 'dark' ? 'right-1' : 'left-1'}`} />
        </div>
      </div>

      <button 
        onClick={() => {
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 transition-all font-medium text-sm"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}

function SidebarItem({ icon, label, href = "/", theme }: { icon: React.ReactNode, label: string, href?: string, theme: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ x: 4 }}
        className={`
          flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium
          ${active 
            ? (theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/50') 
            : (theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50')}
        `}
      >
        <span className={active ? 'text-emerald-500' : ''}>{icon}</span>
        <span>{label}</span>
      </motion.div>
    </Link>
  );
}
