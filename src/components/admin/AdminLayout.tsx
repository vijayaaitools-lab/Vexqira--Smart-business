import React, { useState } from 'react';
import { VexqiraLogo } from '../VexqiraLogo';
import { useApp } from '../../context/AppContext';
import { 
  ClientProfile, 
  LeadSubmission, 
  PlanConfig, 
  BusinessCategory 
} from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Layers, 
  CreditCard, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  Shield, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause, 
  Archive, 
  Trash2, 
  Edit3, 
  ArrowRight, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  Smartphone,
  Zap,
  Check,
  X,
  Key
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { 
    clients, 
    leads, 
    plans, 
    setUserRole, 
    setCurrentClientId,
    updateLeadStatus, 
    convertLeadToClient, 
    updateClientStatus, 
    updateClientService, 
    updateClientApiConfig,
    updatePlan, 
    deleteClient,
    resetAllData 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'leads' | 'services' | 'apikeys' | 'plans' | 'payments' | 'usage' | 'settings'>('dashboard');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [editingApiConfigClient, setEditingApiConfigClient] = useState<ClientProfile | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);

  // Computed metrics
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const pausedClients = clients.filter(c => c.status === 'Paused' || c.automationStatus === 'Paused').length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const activeAutomations = clients.filter(c => c.automationStatus === 'Active').length;
  const monthlyRevenue = clients.reduce((sum, c) => {
    const plan = plans.find(p => p.id === c.planId);
    return sum + (plan ? plan.priceMonthly : 49);
  }, 0);
  const expiringPlans = 1;

  const filteredClients = clients.filter(c => 
    c.businessName.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.ownerName.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.businessType.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredLeads = leads.filter(l => 
    l.businessName.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.businessType.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const handleOpenClientDetails = (c: ClientProfile) => {
    setSelectedClient(c);
  };

  const handleSavePlanEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      updatePlan(editingPlan.id, editingPlan);
      setEditingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* DESKTOP ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VexqiraLogo size="sm" theme="dark" variant="mark" />
            <div>
              <div className="font-extrabold text-sm tracking-wider text-white flex items-center gap-1.5">
                <span>VEXQIRA</span>
                <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">ADMIN</span>
              </div>
              <div className="text-[10px] text-slate-400">Super Management Portal</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
            { id: 'clients', label: 'Clients', icon: Users, badge: totalClients },
            { id: 'leads', label: 'Leads', icon: UserPlus, badge: newLeads > 0 ? `${newLeads} New` : null },
            { id: 'services', label: 'Services Control', icon: Layers, badge: null },
            { id: 'apikeys', label: 'API Keys & Gateways', icon: Key, badge: 'Live' },
            { id: 'plans', label: 'Plans & Pricing', icon: CreditCard, badge: null },
            { id: 'payments', label: 'Payments', icon: BarChart3, badge: `$${monthlyRevenue}/mo` },
            { id: 'usage', label: 'Usage & Quota', icon: Zap, badge: null },
            { id: 'settings', label: 'Admin Settings', icon: Settings, badge: null }
          ].map((item) => {
            const isActive = activeTab === item.id;
            const IconComp = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : typeof item.badge === 'string' && item.badge.includes('New')
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer switch */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-900/50">
          <button
            onClick={() => setUserRole('client')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Switch to Client App</span>
          </button>

          <button
            onClick={() => setUserRole('public')}
            className="w-full text-slate-400 hover:text-white text-xs font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        {/* TAB 1: ADMIN DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Vexqira Admin Dashboard</h1>
                <p className="text-xs text-slate-400">High-level platform health, client automations, and revenue</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  WhatsApp Cloud API: 99.98% Uptime
                </span>
              </div>
            </div>

            {/* 7 Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Total Clients</div>
                <div className="text-3xl font-black text-white">{totalClients}</div>
                <div className="text-[11px] text-cyan-400 font-semibold pt-1">Across 4 Industries</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs text-emerald-400 font-bold uppercase mb-1">Active Clients</div>
                <div className="text-3xl font-black text-emerald-300">{activeClients}</div>
                <div className="text-[11px] text-slate-400 pt-1">100% healthy accounts</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs text-amber-400 font-bold uppercase mb-1">Paused Clients</div>
                <div className="text-3xl font-black text-amber-300">{pausedClients}</div>
                <div className="text-[11px] text-slate-400 pt-1">Client initiated pauses</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs text-cyan-400 font-bold uppercase mb-1">New Leads</div>
                <div className="text-3xl font-black text-cyan-300">{newLeads}</div>
                <div className="text-[11px] text-slate-400 pt-1">From public contact form</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs text-indigo-400 font-bold uppercase mb-1">Active Automations</div>
                <div className="text-3xl font-black text-indigo-300">{activeAutomations}</div>
                <div className="text-[11px] text-slate-400 pt-1">24/7 Response Engine</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs text-purple-400 font-bold uppercase mb-1">Monthly Revenue</div>
                <div className="text-3xl font-black text-purple-300">${monthlyRevenue}</div>
                <div className="text-[11px] text-slate-400 pt-1">Recurring subscription</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="text-xs text-rose-400 font-bold uppercase mb-1">Expiring Plans</div>
                <div className="text-3xl font-black text-rose-300">{expiringPlans}</div>
                <div className="text-[11px] text-slate-400 pt-1">Within next 30 days</div>
              </div>
            </div>

            {/* Quick Actions & Recent Leads */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Contact Form Leads */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-white">Recent Inbound Leads</h3>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs font-bold text-cyan-400 hover:underline"
                  >
                    View all ({leads.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {leads.slice(0, 3).map(l => (
                    <div key={l.id} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-white">{l.businessName}</div>
                        <div className="text-[11px] text-slate-400">{l.name} • {l.businessType}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        l.status === 'New' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Quick Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-white">Client Status Summary</h3>
                  <button
                    onClick={() => setActiveTab('clients')}
                    className="text-xs font-bold text-cyan-400 hover:underline"
                  >
                    Manage clients →
                  </button>
                </div>

                <div className="space-y-3">
                  {clients.map(c => (
                    <div key={c.id} className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-white">{c.businessName}</div>
                        <div className="text-[11px] text-slate-400">{c.whatsappNumber} • Plan: {c.planId.toUpperCase()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.automationStatus === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {c.automationStatus}
                        </span>
                        <button
                          onClick={() => {
                            setCurrentClientId(c.id);
                            setUserRole('client');
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg"
                        >
                          Open as Client
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLIENT MANAGEMENT */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Client Management</h1>
                <p className="text-xs text-slate-400">View, configure, pause, or suspend client accounts</p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={clientSearch}
                  onChange={e => setClientSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Clients Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Client</th>
                    <th className="p-4">Business</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4">Automation</th>
                    <th className="p-4">Usage</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredClients.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{c.businessName}</div>
                        <div className="text-[11px] text-slate-400">{c.ownerName} • {c.email}</div>
                      </td>
                      <td className="p-4">{c.businessType}</td>
                      <td className="p-4 font-bold text-cyan-300 uppercase">{c.planId}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          c.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          c.automationStatus === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {c.automationStatus}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px]">
                        {c.monthlyMessagesUsed} / {c.monthlyMessagesLimit}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenClientDetails(c)}
                          className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => {
                            setCurrentClientId(c.id);
                            setUserRole('client');
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-colors"
                        >
                          Login As
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Client Detail & Admin Control Modal */}
            {selectedClient && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
                <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-800 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-white">{selectedClient.businessName}</h3>
                      <div className="text-xs text-slate-400">{selectedClient.ownerName} • {selectedClient.email} • {selectedClient.phone}</div>
                    </div>
                    <button
                      onClick={() => setSelectedClient(null)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* WhatsApp & Plan Details */}
                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <div className="text-slate-400 font-bold uppercase">WhatsApp Cloud Connection</div>
                      <div className="text-sm font-bold text-white font-mono">{selectedClient.whatsappNumber}</div>
                      <div className="text-emerald-400 text-[11px] font-bold">🟢 Active & Verified</div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <div className="text-slate-400 font-bold uppercase">Plan & Billing</div>
                      <div className="text-sm font-bold text-white uppercase">{selectedClient.planId} Tier</div>
                      <div className="text-slate-400 text-[11px]">Renews: {selectedClient.expiryDate}</div>
                    </div>
                  </div>

                  {/* Individual Services Control (Section 20 of requirements) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Individual Services Control</h4>
                    <div className="space-y-2">
                      {selectedClient.services.map(s => (
                        <div key={s.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-xs text-white">{s.name}</div>
                            <div className="text-[11px] text-slate-400">{s.description}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              s.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {s.status}
                            </span>
                            <button
                              onClick={() => {
                                const nextStatus = s.status === 'Active' ? 'Paused' : 'Active';
                                updateClientService(selectedClient.id, s.id, nextStatus);
                                setSelectedClient({
                                  ...selectedClient,
                                  services: selectedClient.services.map(srv => srv.id === s.id ? { ...srv, status: nextStatus } : srv)
                                });
                              }}
                              className="text-xs font-bold text-cyan-400 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg"
                            >
                              {s.status === 'Active' ? 'Pause' : 'Activate'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin Actions: Activate | Pause | Resume | Stop | Suspend | Archive | Delete */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Master Account Controls</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          updateClientStatus(selectedClient.id, 'Active');
                          setSelectedClient({ ...selectedClient, status: 'Active' });
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                      >
                        Activate Account
                      </button>

                      <button
                        onClick={() => {
                          updateClientStatus(selectedClient.id, 'Paused');
                          setSelectedClient({ ...selectedClient, status: 'Paused' });
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                      >
                        Pause Services
                      </button>

                      <button
                        onClick={() => {
                          updateClientStatus(selectedClient.id, 'Suspended');
                          setSelectedClient({ ...selectedClient, status: 'Suspended' });
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                      >
                        Suspend Client
                      </button>

                      <button
                        onClick={() => {
                          updateClientStatus(selectedClient.id, 'Archived');
                          setSelectedClient({ ...selectedClient, status: 'Archived' });
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LEADS FROM PUBLIC CONTACT FORM */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Client Leads</h1>
                <p className="text-xs text-slate-400">Inbound inquiries from the Vexqira public contact form</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={leadSearch}
                  onChange={e => setLeadSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-extrabold text-base text-white">{lead.businessName}</h3>
                        <span className="text-[11px] bg-slate-800 text-cyan-300 px-2.5 py-0.5 rounded-full font-semibold">
                          {lead.businessType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4 mt-1">
                        <span>Contact: <strong>{lead.name}</strong></span>
                        <span>WhatsApp: <strong>{lead.whatsappNumber}</strong></span>
                        <span>Email: <strong>{lead.email}</strong></span>
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-3">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-700 text-cyan-300 text-xs font-bold px-3 py-2 rounded-xl"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Demo">Demo</option>
                        <option value="Converted">Converted</option>
                        <option value="Not Interested">Not Interested</option>
                      </select>

                      {lead.status !== 'Converted' && (
                        <button
                          onClick={() => convertLeadToClient(lead.id)}
                          className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
                        >
                          Convert to Client
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-400 font-bold uppercase text-[10px]">What they want to automate:</div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {lead.automationNeeds.map(need => (
                          <span key={need} className="bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded text-[11px]">
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 font-bold uppercase text-[10px]">Inquiry Message:</div>
                      <p className="text-slate-300 italic bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        "{lead.message}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES CONTROL */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Services Control Matrix</h1>
              <p className="text-xs text-slate-400">Toggle modular Vexqira automation features per client</p>
            </div>

            <div className="grid gap-6">
              {clients.map(c => (
                <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-extrabold text-base text-white">{c.businessName}</h3>
                      <div className="text-xs text-slate-400">{c.businessType} • {c.whatsappNumber}</div>
                    </div>
                    <span className="text-xs font-bold text-cyan-300 bg-slate-800 px-3 py-1 rounded-full">
                      Plan: {c.planId.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {c.services.map(srv => (
                      <div key={srv.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-white">{srv.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              srv.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {srv.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{srv.description}</p>
                        </div>

                        <button
                          onClick={() => {
                            const next = srv.status === 'Active' ? 'Paused' : 'Active';
                            updateClientService(c.id, srv.id, next);
                          }}
                          className={`w-full py-1.5 text-xs font-bold rounded-lg transition-colors ${
                            srv.status === 'Active'
                              ? 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {srv.status === 'Active' ? 'Pause Service' : 'Activate Service'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: API KEYS & GATEWAYS (SUPER ADMIN ONLY) */}
        {activeTab === 'apikeys' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Client WhatsApp & API Gateway Config</h1>
                <p className="text-xs text-slate-400">Manage Meta WhatsApp Cloud API credentials, access tokens, and AI engine per client</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-950 border border-indigo-500/40 text-indigo-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  Admin-Only Access
                </span>
              </div>
            </div>

            <div className="grid gap-6">
              {clients.map(c => {
                const isEditing = editingApiConfigClient?.id === c.id;
                const config = isEditing ? editingApiConfigClient.apiConfig : c.apiConfig;

                return (
                  <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-extrabold text-base text-white">{c.businessName}</h3>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            c.apiConfig?.connectionStatus === 'Connected'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {c.apiConfig?.connectionStatus || 'Needs Setup'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Owner: {c.ownerName} • Registered WhatsApp: <span className="font-mono text-cyan-300">{c.whatsappNumber}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => {
                                if (editingApiConfigClient && editingApiConfigClient.apiConfig) {
                                  updateClientApiConfig(c.id, {
                                    ...editingApiConfigClient.apiConfig,
                                    connectionStatus: 'Connected',
                                    lastTestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  });
                                  setEditingApiConfigClient(null);
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
                            >
                              Save & Verify Keys
                            </button>
                            <button
                              onClick={() => setEditingApiConfigClient(null)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingApiConfigClient(c)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>Edit API Credentials</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Credentials Form / Display */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Phone Number ID</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={config?.phoneNumberId || ''}
                            onChange={e => setEditingApiConfigClient({
                              ...editingApiConfigClient!,
                              apiConfig: { ...config!, phoneNumberId: e.target.value }
                            })}
                            placeholder="e.g. 109283746592019"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                          />
                        ) : (
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] truncate">
                            {config?.phoneNumberId || 'Not configured'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">WABA Account ID</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={config?.wabaId || ''}
                            onChange={e => setEditingApiConfigClient({
                              ...editingApiConfigClient!,
                              apiConfig: { ...config!, wabaId: e.target.value }
                            })}
                            placeholder="e.g. 987654321098765"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                          />
                        ) : (
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] truncate">
                            {config?.wabaId || 'Not configured'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">AI Engine Provider</label>
                        {isEditing ? (
                          <select
                            value={config?.aiEngine || 'Vexqira Cloud AI'}
                            onChange={e => setEditingApiConfigClient({
                              ...editingApiConfigClient!,
                              apiConfig: { ...config!, aiEngine: e.target.value as any }
                            })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 text-xs focus:outline-none focus:border-cyan-500"
                          >
                            <option value="Vexqira Cloud AI">Vexqira Cloud AI (Managed)</option>
                            <option value="Direct Meta Rules">Direct Meta Fast Rules</option>
                            <option value="Custom OpenAI">Custom OpenAI GPT-4o</option>
                          </select>
                        ) : (
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-cyan-300 font-bold text-[11px]">
                            {config?.aiEngine || 'Vexqira Cloud AI'}
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Meta System User Access Token</label>
                        {isEditing ? (
                          <input
                            type="password"
                            value={config?.systemAccessToken || ''}
                            onChange={e => setEditingApiConfigClient({
                              ...editingApiConfigClient!,
                              apiConfig: { ...config!, systemAccessToken: e.target.value }
                            })}
                            placeholder="EAAGxxxxxxxxxxxxxxxxxxxxxxxx..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                          />
                        ) : (
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-400 font-mono text-[11px]">
                            {config?.systemAccessToken ? '••••••••••••••••••••••••••••••••••••••••' : 'No token set'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-slate-300 font-bold">Client Webhook URL: </span>
                        <code className="text-cyan-300">{config?.webhookUrl || `https://api.vexqira.com/v1/webhook/${c.id}`}</code>
                      </div>
                      <div className="text-slate-400 font-mono">
                        Verify Token: <span className="text-purple-300 font-bold">{config?.verifyToken || 'vexqira_secure_token'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: PLANS CONFIGURATION */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Plans & Pricing</h1>
              <p className="text-xs text-slate-400">Configure pricing, message limits, and feature sets without modifying code</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-lg text-white">{plan.name}</h3>
                      {plan.popular && (
                        <span className="bg-cyan-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">${plan.priceMonthly}</span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>

                    <p className="text-xs text-slate-400">{plan.description}</p>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1 font-mono">
                      <div>Message Limit: <span className="text-cyan-300 font-bold">{plan.messageLimit.toLocaleString()} /mo</span></div>
                      <div>Customer Limit: <span className="text-cyan-300 font-bold">{plan.customerLimit.toLocaleString()}</span></div>
                      <div>Team Seats: <span className="text-cyan-300 font-bold">{plan.teamLimit}</span></div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Features included:</div>
                      {plan.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Edit Plan Settings
                  </button>
                </div>
              ))}
            </div>

            {/* Plan Edit Modal */}
            {editingPlan && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
                <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 shadow-2xl relative space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-extrabold text-white">Edit {editingPlan.name} Plan</h3>
                    <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>

                  <form onSubmit={handleSavePlanEdits} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-400 mb-1">Monthly Price ($)</label>
                      <input
                        type="number"
                        value={editingPlan.priceMonthly}
                        onChange={e => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-400 mb-1">Monthly Message Limit</label>
                      <input
                        type="number"
                        value={editingPlan.messageLimit}
                        onChange={e => setEditingPlan({ ...editingPlan, messageLimit: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-400 mb-1">Customer Limit</label>
                      <input
                        type="number"
                        value={editingPlan.customerLimit}
                        onChange={e => setEditingPlan({ ...editingPlan, customerLimit: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingPlan(null)}
                        className="px-4 py-2 text-slate-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition-colors"
                      >
                        Save Plan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6 & 7: PAYMENTS & USAGE */}
        {(activeTab === 'payments' || activeTab === 'usage') && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {activeTab === 'payments' ? 'Revenue & Subscription Billing' : 'Usage & Quota Metrics'}
              </h1>
              <p className="text-xs text-slate-400">Real-time usage tracking across active client WhatsApp numbers</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-bold">Total Monthly Invoices</div>
                <div className="text-3xl font-black text-white mt-1">${monthlyRevenue}</div>
                <div className="text-[11px] text-emerald-400 font-semibold pt-1">100% Paid • Auto-renewal on</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-bold">Total Messages Handled</div>
                <div className="text-3xl font-black text-cyan-300 mt-1">2,040</div>
                <div className="text-[11px] text-slate-400 pt-1">Across all clients this month</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-400 uppercase font-bold">Avg Automation Delivery</div>
                <div className="text-3xl font-black text-purple-300 mt-1">0.6s</div>
                <div className="text-[11px] text-emerald-400 font-semibold pt-1">Zero dropped webhook events</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: ADMIN SETTINGS & RESET */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Vexqira Platform Settings</h1>
              <p className="text-xs text-slate-400">Master configuration, WhatsApp gateway credentials, and demo data reset</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="font-extrabold text-sm text-white">Official WhatsApp Business Cloud Gateway</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Vexqira connects directly via the official Meta WhatsApp Business Cloud API. Webhook status is live with automated retry queues.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                  Status: 🟢 Gateway Healthy • Meta API v20.0 Connected
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-3">
                <h3 className="font-extrabold text-sm text-rose-400">Reset Demo Data</h3>
                <p className="text-xs text-slate-400">
                  Clears local storage modifications and restores default clients, leads, and messages.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Reset all demo data back to clean factory state?')) {
                      resetAllData();
                      alert('Data reset successfully!');
                    }
                  }}
                  className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset All Platform Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
