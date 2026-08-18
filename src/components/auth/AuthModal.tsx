import React, { useState } from 'react';
import { VexqiraLogo } from '../VexqiraLogo';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, Shield, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'client' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'client'
}) => {
  const { setUserRole, setCurrentClientId, clients } = useApp();
  const [activeTab, setActiveTab] = useState<'client' | 'admin'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDemoClient, setSelectedDemoClient] = useState<string>('client-1');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'client') {
      setCurrentClientId(selectedDemoClient);
      setUserRole('client');
    } else {
      setUserRole('admin');
    }
    onClose();
  };

  const handleQuickDemoLogin = (role: 'client' | 'admin', clientId?: string) => {
    if (role === 'client') {
      if (clientId) setCurrentClientId(clientId);
      setUserRole('client');
    } else {
      setUserRole('admin');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 space-y-2">
          <div className="flex justify-center">
            <VexqiraLogo size="sm" variant="horizontal" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {activeTab === 'client' ? 'Client Dashboard Login' : 'Vexqira Super Admin'}
          </h3>
          <p className="text-xs text-slate-500">
            {activeTab === 'client'
              ? 'Access your WhatsApp automation and customer messages'
              : 'Private portal to manage clients, services, and plans'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'client'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Client Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'admin'
                ? 'bg-slate-900 text-cyan-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Super Admin
          </button>
        </div>

        {/* One Click Instant Demo Access */}
        <div className="mb-6 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-3.5 space-y-2">
          <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-between">
            <span>⚡ Instant Demo Access</span>
            <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">1-Click</span>
          </div>

          {activeTab === 'client' ? (
            <div className="space-y-1.5">
              {clients.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin('client', c.id)}
                  className="w-full text-left bg-white hover:bg-indigo-100/50 p-2 rounded-xl border border-indigo-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.businessName}</div>
                      <div className="text-[10px] text-slate-500">{c.businessType} • {c.ownerName}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold p-3 rounded-xl flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Login as Vexqira Super Admin</span>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email or Phone
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={activeTab === 'client' ? 'vikram@prestigerealty.com' : 'admin@vexqira.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold py-3 rounded-xl shadow-xs transition-colors mt-2"
          >
            Sign In to {activeTab === 'client' ? 'Dashboard' : 'Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};
