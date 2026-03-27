"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, 
  Database, 
  Globe, 
  Plus, 
  Search, 
  Terminal, 
  Server, 
  CheckCircle2, 
  AlertCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function AppStore() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<any>(null);

  // Deploy form state
  const [deployForm, setDeployForm] = useState({
    name: '',
    domain: '',
    env: {} as any
  });

  useEffect(() => {
    setMounted(true);
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("http://10.1.2.208/api/templates");
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setDeployResult(null);

    try {
      const res = await fetch("http://10.1.2.208/api/apps/install", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          name: deployForm.name,
          domain: deployForm.domain,
          env: deployForm.env
        })
      });
      const data = await res.json();
      setDeployResult(data);
    } catch (error: any) {
      setDeployResult({ success: false, error: error.message });
    } finally {
      setIsDeploying(false);
    }
  };

  const openDeployModal = (template: any) => {
    setSelectedTemplate(template);
    setDeployForm({
      name: '',
      domain: '',
      env: { ...template.defaultEnv }
    });
    setDeployResult(null);
  };

  if (!mounted) return null;

  return (
    <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20`}>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>App Marketplace</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Deploy production-ready stacks in seconds with My-Panel Core</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className={`pl-11 pr-6 py-2.5 rounded-2xl border text-sm font-medium transition-all w-full md:w-80 ${
              theme === 'dark' ? 'bg-[#1E293B] border-slate-700 focus:border-blue-500/50' : 'bg-white border-slate-200 focus:border-blue-500/50 shadow-sm'
            }`}
          />
        </div>
      </header>

      {/* Featured Banner */}
      <section className={`p-8 rounded-[32px] overflow-hidden relative ${theme === 'dark' ? 'bg-blue-500/5 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'}`}>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">
            <Zap size={14} fill="currentColor" />
            <span>Instant Deployment</span>
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tight">One-Click Production Stacks</h2>
          <p className="text-slate-400 font-medium mb-6">Every app deployed via My-Panel is automatically isolated, secured with TLS certificates, and optimized for high performance.</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none translate-x-1/4">
           <Server size={300} strokeWidth={1} />
        </div>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3].map(i => (
            <div key={i} className={`h-64 rounded-[32px] animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`} />
          ))
        ) : (
          templates.map((template) => (
            <motion.div 
              key={template.id}
              whileHover={{ y: -5 }}
              onClick={() => openDeployModal(template)}
              className={`p-8 rounded-[32px] border cursor-pointer group transition-all relative overflow-hidden ${
                theme === 'dark' ? 'bg-[#1E293B] border-slate-700 hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                  theme === 'dark' ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                  {template.icon === 'Cloud' && <Cloud size={32} />}
                  {template.icon === 'Globe' && <Globe size={32} />}
                  {template.icon === 'Database' && <Database size={32} />}
                  {!(['Cloud', 'Globe', 'Database'].includes(template.icon)) && <Terminal size={32} />}
                </div>
                <div className="p-2 rounded-xl bg-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={20} className="text-blue-500" />
                </div>
              </div>
              
              <h3 className="text-xl font-black mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{template.name}</h3>
              <p className="text-slate-400 font-medium text-sm line-clamp-2 mb-8">{template.description}</p>
              
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-500 transition-colors mt-auto">
                <span>Deploy Stack</span>
                <ChevronRight size={14} />
              </div>

              {/* Decorative gradient */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all rounded-full" />
            </motion.div>
          ))
        )}
      </div>

      {/* Deploy Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-xl rounded-[40px] shadow-2xl relative overflow-hidden ${
                theme === 'dark' ? 'bg-[#0F172A] border border-slate-800' : 'bg-white'
              }`}
            >
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-500/10 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-10">
                {!deployResult && !isDeploying ? (
                  <>
                    <div className="flex items-center space-x-6 mb-8">
                       <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${
                        theme === 'dark' ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {selectedTemplate.icon === 'Cloud' && <Cloud size={32} />}
                        {selectedTemplate.icon === 'Globe' && <Globe size={32} />}
                        {selectedTemplate.icon === 'Database' && <Database size={32} />}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Deploy {selectedTemplate.name}</h2>
                        <p className="text-slate-400 text-sm font-medium">Configure and launch your instance</p>
                      </div>
                    </div>

                    <form onSubmit={handleDeploy} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Instance Name</label>
                        <input 
                          type="text" required placeholder="my-awesome-app"
                          className={`w-full px-5 py-4 rounded-2xl border font-medium ${
                            theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                          value={deployForm.name}
                          onChange={(e) => setDeployForm({...deployForm, name: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Domain Address</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" required placeholder="app.yourdomain.com"
                            className={`w-full pl-12 pr-5 py-4 rounded-2xl border font-medium ${
                              theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                            value={deployForm.domain}
                            onChange={(e) => setDeployForm({...deployForm, domain: e.target.value})}
                          />
                        </div>
                        <p className="text-[10px] text-emerald-500 font-bold ml-1 flex items-center space-x-1 uppercase">
                          <ShieldCheck size={10} />
                          <span>Auto-SSL enabled via Let's Encrypt</span>
                        </p>
                      </div>

                      <div className="pt-4">
                        <button 
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center space-x-3"
                        >
                          <Zap size={20} fill="white" />
                          <span>Launch Instance</span>
                        </button>
                      </div>
                    </form>
                  </>
                ) : isDeploying ? (
                  <div className="py-20 text-center space-y-6">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Server size={32} className="text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tight">Deploying {selectedTemplate.name}...</h3>
                      <p className="text-slate-400 text-sm font-medium mt-2">Provisioning container and configuring routing</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-8">
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${deployResult.success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {deployResult.success ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">
                        {deployResult.success ? 'Launch Successful' : 'Launch Failed'}
                      </h3>
                      <p className="text-slate-400 font-medium mt-2">
                        {deployResult.success 
                          ? `Your ${selectedTemplate.name} is now online at ${deployResult.domain}`
                          : deployResult.error || 'An unexpected error occurred during deployment'
                        }
                      </p>
                    </div>
                    {deployResult.success && (
                      <div className={`p-4 rounded-2xl text-left border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                         <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Access Details</p>
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-mono truncate max-w-[200px]">{deployResult.domain}</span>
                            <a href={`https://${deployResult.domain}`} target="_blank" className="text-blue-500 hover:underline flex items-center space-x-1 font-bold text-xs uppercase">
                              <span>Open App</span>
                              <ChevronRight size={14} />
                            </a>
                         </div>
                      </div>
                    )}
                    <button 
                      onClick={() => setSelectedTemplate(null)}
                      className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                        theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200 shadow-sm'
                      }`}
                    >
                      Close Marketplace
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
