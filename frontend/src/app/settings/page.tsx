"use client";

import { motion } from "framer-motion";
import { Save, Shield, Smartphone, Palette, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* General Branding */}
        <section className="glass p-8 rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold">Branding & Appearance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-white/40 block">Platform Name</label>
              <input 
                type="text" 
                defaultValue="My-Panel" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/40 block">Primary Color</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="color" 
                  defaultValue="#3b66f5" 
                  className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
                />
                <span className="text-sm font-mono text-white/60">#3B66F5</span>
              </div>
            </div>
          </div>
        </section>

        {/* Security & SSL */}
        <section className="glass p-8 rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="text-emerald-400" size={24} />
            <h2 className="text-xl font-bold">Security & SSL</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-4">
                <Globe className="text-white/40" />
                <div>
                  <p className="font-medium">Auto SSL (Let's Encrypt)</p>
                  <p className="text-xs text-white/30">Automatically provision SSL for all custom domains.</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center justify-end px-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full shadow-md" />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button className="premium-gradient px-8 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-blue-500/20">
            <Save size={20} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
