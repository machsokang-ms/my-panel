"use client";

import { motion } from "framer-motion";
import { Cloud, Database, Globe, Plus, Search } from "lucide-react";

const templates = [
  { id: 'minio', name: 'MinIO', desc: 'S3-Compatible Storage', icon: <Cloud /> },
  { id: 'wordpress', name: 'WordPress', desc: 'CMS & Website Builder', icon: <Globe /> },
  { id: 'postgres', name: 'PostgreSQL', desc: 'Relational Database', icon: <Database /> },
];

export default function AppStore() {
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">App Store</h1>
          <p className="text-white/50">One-click deployment for your favorite services.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <motion.div 
            key={template.id}
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-3xl group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                {template.icon}
              </div>
              <button className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold mb-1">{template.name}</h3>
            <p className="text-white/40 text-sm mb-6">{template.desc}</p>
            <button className="w-full py-3 bg-white/5 rounded-xl font-medium border border-white/5 hover:bg-white/10 transition-colors">
              Deploy Instance
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
