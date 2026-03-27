"use client";

import { motion } from "framer-motion";
import { UserPlus, User, Shield, MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function UserManagement() {
  const users = [
    { id: 1, name: "Admin User", email: "admin@mypanel.local", role: "Administrator", status: "Active" },
    { id: 2, name: "Developer", email: "dev@example.com", role: "Developer", status: "Active" },
    { id: 3, name: "Guest", email: "guest@example.com", role: "Viewer", status: "Inactive" },
  ];

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">User Management</h1>
          <p className="text-white/50">Manage access and permissions for your team.</p>
        </div>
        <button className="premium-gradient px-4 py-2 rounded-xl flex items-center space-x-2 font-medium hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
          <UserPlus size={20} />
          <span>Add User</span>
        </button>
      </header>

      <div className="glass rounded-[32px] overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-8 py-5">User</th>
              <th className="px-8 py-5">Role</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <User className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="text-xs text-white/30">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-2">
                    <Shield size={14} className="text-purple-400" />
                    <span className="text-sm font-medium">{user.role}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/30 border border-white/10'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
