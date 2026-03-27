"use client";

import { motion } from "framer-motion";
import { Database, Plus, RefreshCw, Trash2 } from "lucide-react";

export default function DatabaseManager() {
  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Databases</h1>
          <p className="text-white/50">Manage your relational and NoSQL databases.</p>
        </div>
        <button className="premium-gradient px-4 py-2 rounded-xl flex items-center space-x-2 font-medium hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
          <Plus size={20} />
          <span>Create DB</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <DatabaseItem name="Production DB" type="PostgreSQL 15" status="Active" size="1.2 GB" />
        <DatabaseItem name="User Cache" type="Redis 7.0" status="Active" size="256 MB" />
        <DatabaseItem name="Analytics" type="MongoDB 6.0" status="Active" size="4.8 GB" />
      </div>
    </div>
  );
}

function DatabaseItem({ name, type, status, size }: { name: string, type: string, status: string, size: string }) {
  return (
    <div className="glass p-6 rounded-3xl flex items-center justify-between group border-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center space-x-6">
        <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
          <Database className="text-amber-500" size={28} />
        </div>
        <div>
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="flex items-center space-x-3 text-sm text-white/40">
            <span>{type}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>{size}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-8">
        <div className="text-right">
          <p className="text-emerald-400 font-medium text-sm flex items-center justify-end space-x-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>{status}</span>
          </p>
          <p className="text-white/20 text-xs">Uptime: 14d 2h</p>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white/60">
            <RefreshCw size={18} />
          </button>
          <button className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 text-red-400">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
