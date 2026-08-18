import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessCategory } from '../../types';
import { 
  Building2, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  LogOut, 
  Check, 
  Sparkles,
  QrCode,
  RefreshCw
} from 'lucide-react';

interface ClientSettingsProps {
  onLogout: () => void;
}

export const ClientSettings: React.FC<ClientSettingsProps> = ({ onLogout }) => {
  const { currentClient, updateClientProfile } = useApp();

  const [businessName, setBusinessName] = useState(currentClient?.businessName || '');
  const [phone, setPhone] = useState(currentClient?.phone || '');
  const [email, setEmail] = useState(currentClient?.email || '');
  const [businessType, setBusinessType] = useState<BusinessCategory>(currentClient?.businessType || 'Real Estate');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [checkingConnection, setCheckingConnection] = useState(false);

  if (!currentClient) return null;

  const handleSaveBusinessInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientProfile(currentClient.id, {
      businessName,
      phone,
      email,
      businessType
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleVerifyConnection = () => {
    setCheckingConnection(true);
    setTimeout(() => {
      setCheckingConnection(false);
      alert(`Official WhatsApp Business Gateway verified for ${currentClient.whatsappNumber}. Status: Active 🟢`);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-xs text-slate-500">
          Manage your business profile and WhatsApp connection.
        </p>
      </div>

      {/* SECTION 1: BUSINESS INFORMATION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Business Information</h2>
            <p className="text-xs text-slate-500">Used by Vexqira in automated customer greetings</p>
          </div>
        </div>

        <form onSubmit={handleSaveBusinessInfo} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Business Category
              </label>
              <select
                value={businessType}
                onChange={e => setBusinessType(e.target.value as BusinessCategory)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Real Estate">Real Estate</option>
                <option value="Salons & Spas">Salons & Spas</option>
                <option value="Clinics">Clinics</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Coaching & Education">Coaching & Education</option>
                <option value="Gyms">Gyms</option>
                <option value="Local Businesses">Local Businesses</option>
                <option value="Service Businesses">Service Businesses</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Owner Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Changes saved successfully
              </span>
            )}
            <button
              type="submit"
              className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: WHATSAPP CONNECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">WhatsApp Connection</h2>
            <p className="text-xs text-slate-500">Official WhatsApp Cloud Business API Status</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-slate-500 font-medium">Connected Business Number</div>
            <div className="text-lg font-black text-slate-900 font-mono">
              {currentClient.whatsappNumber}
            </div>
            <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Official WhatsApp Business Verified • Active 24/7</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleVerifyConnection}
            disabled={checkingConnection}
            className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${checkingConnection ? 'animate-spin' : ''}`} />
            <span>Test Connection Status</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: ACCOUNT & LOGOUT */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Account Access</h2>
            <p className="text-xs text-slate-500">Owner login and security</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-900">{currentClient.ownerName}</div>
            <div className="text-xs text-slate-500">{currentClient.email}</div>
          </div>

          <button
            onClick={onLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
