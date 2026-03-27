"use client";

import { motion } from "framer-motion";
import { Save, Shield, Palette, Globe, Cloud, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [settings, setSettings] = useState({
    platformName: "My-Panel",
    primaryColor: "#3b66f5",
    logoUrl: "",
    autoSSL: true
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data) {
        setSettings({
          platformName: data.platform_name || "My-Panel",
          primaryColor: data.primary_color || "#3b66f5",
          logoUrl: data.logo_url || "",
          autoSSL: !!data.auto_ssl
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    const formData = new FormData();
    formData.append("platformName", settings.platformName);
    formData.append("primaryColor", settings.primaryColor);
    formData.append("autoSSL", String(settings.autoSSL));
    if (selectedFile) {
      formData.append("logo", selectedFile);
    }

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const updated = await res.json();
        setMessage("Settings saved successfully!");
        setSettings({
          platformName: updated.platform_name,
          primaryColor: updated.primary_color,
          logoUrl: updated.logo_url,
          autoSSL: !!updated.auto_ssl
        });
        setSelectedFile(null);
      } else {
        setMessage("Failed to save settings.");
      }
    } catch (err) {
      console.error("Error saving settings", err);
      setMessage("Error connecting to server.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 border border-emerald-500/20"
          >
            <Check size={16} />
            <span>{message}</span>
          </motion.div>
        )}
      </div>

      <div className="space-y-6">
        {/* General Branding */}
        <section className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-3 mb-8">
            <Palette className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold">Branding & Appearance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block pl-1">Platform Name</label>
                <input 
                  type="text" 
                  value={settings.platformName}
                  onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                  placeholder="My-Panel"
                  className={`w-full px-5 py-3.5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-lg`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block pl-1">Primary Color</label>
                <div className={`flex items-center space-x-4 px-4 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <input 
                    type="color" 
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    className="w-10 h-10 rounded-xl bg-transparent border-none cursor-pointer"
                  />
                  <span className="text-base font-mono font-black uppercase">{settings.primaryColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block pl-1">Platform Logo</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center space-y-4 hover:border-blue-500/50 transition-all cursor-pointer group overflow-hidden ${theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50/50'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                
                {previewUrl || settings.logoUrl ? (
                  <div className="relative w-24 h-24 group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={previewUrl || settings.logoUrl} 
                      alt="Logo Preview" 
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                      <Cloud className="text-white" size={24} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 ${theme === 'dark' ? 'bg-slate-800 text-blue-500' : 'bg-white text-blue-600 shadow-md'}`}>
                      <Cloud size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">Click to upload logo</p>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">PNG, SVG or JPEG (max 2MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Security & SSL */}
        <section className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="text-emerald-500" size={24} />
            <h2 className="text-xl font-bold">Security & SSL</h2>
          </div>
          
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400 shadow-sm'}`}>
                  <Globe size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg">Auto SSL (Let's Encrypt)</p>
                  <p className="text-xs font-medium text-slate-400">Automatically provision SSL for all custom domains.</p>
                </div>
              </div>
              <button 
                onClick={() => setSettings({...settings, autoSSL: !settings.autoSSL})}
                className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-300 ${settings.autoSSL ? 'bg-blue-600' : 'bg-slate-400'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${settings.autoSSL ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center space-x-3 shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={22} />
            )}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
