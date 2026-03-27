"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.token) {
        // Set cookie for middleware
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="mesh-background opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 rounded-[40px] w-full max-w-md relative z-10 border-white/10 shadow-2xl shadow-blue-500/10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-white/40 mt-2">Login to manage your infrastructure</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full premium-gradient py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 mt-4"
          >
            <span>Sign In</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/30 text-sm">
            Don't have an account? <span className="text-blue-400 font-medium cursor-not-allowed uppercase">Contact Admin</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
