import React, { useState } from 'react';
import { VexqiraLogo } from '../VexqiraLogo';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  MessageSquare, 
  Users, 
  Bell, 
  Settings, 
  LogOut, 
  BookOpen
} from 'lucide-react';
import { ClientHome } from './ClientHome';
import { ClientConversations } from './ClientConversations';
import { ClientCustomers } from './ClientCustomers';
import { ClientKnowledgeBase } from './ClientKnowledgeBase';
import { ClientNotifications } from './ClientNotifications';
import { ClientSettings } from './ClientSettings';

export const ClientLayout: React.FC = () => {
  const { 
    currentClient, 
    setUserRole, 
    notifications, 
    conversations 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'conversations' | 'knowledge' | 'customers' | 'notifications' | 'settings'>('home');
  const [selectedConvId, setSelectedConvId] = useState<string | undefined>();

  if (!currentClient) return null;

  const clientNotifications = notifications.filter(n => n.clientId === currentClient.id);
  const unreadNotifs = clientNotifications.filter(n => !n.read).length;
  const needsReplyCount = conversations.filter(c => c.clientId === currentClient.id && (c.needsAttention || c.status === 'waiting_for_owner')).length;

  const handleNavigate = (tab: string, convId?: string) => {
    if (convId) {
      setSelectedConvId(convId);
    }
    setActiveTab(tab as any);
  };

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home, badge: null },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare, badge: needsReplyCount > 0 ? needsReplyCount : null },
    { id: 'knowledge', label: 'Bot Instructions & Files', icon: BookOpen, badge: `${(currentClient.knowledgeDocuments?.length || 0) + (currentClient.catalogItems?.length || 0)}` },
    { id: 'customers', label: 'Customers', icon: Users, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* DESKTOP LEFT SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200/90 h-screen sticky top-0 shrink-0 shadow-xs z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => setActiveTab('home')}>
            <VexqiraLogo size="sm" showSubtitle />
          </div>
        </div>

        {/* Business Badge */}
        <div className="px-4 py-3">
          <div className="w-full bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                {currentClient.businessName.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{currentClient.businessName}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentClient.businessType}</div>
              </div>
            </div>
            <span className={`w-2 h-2 rounded-full ${currentClient.automationStatus === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComp = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : typeof item.badge === 'number'
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Client Logout */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <button
            onClick={() => setUserRole('public')}
            className="w-full text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 p-2.5 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Top Mobile Bar */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex items-center justify-between shadow-xs">
          <VexqiraLogo size="sm" variant="mark" />
          <div className="text-xs font-extrabold text-slate-900">{currentClient.businessName}</div>
          <button
            onClick={() => setActiveTab('settings')}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-700 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && <ClientHome onNavigate={handleNavigate} />}
          {activeTab === 'conversations' && <ClientConversations selectedConvId={selectedConvId} />}
          {activeTab === 'knowledge' && <ClientKnowledgeBase />}
          {activeTab === 'customers' && <ClientCustomers onOpenChat={(id) => handleNavigate('conversations', id)} />}
          {activeTab === 'notifications' && <ClientNotifications onOpenConversation={(id) => handleNavigate('conversations', id)} />}
          {activeTab === 'settings' && <ClientSettings onLogout={() => setUserRole('public')} />}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-3 z-40 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1 cursor-pointer ${
            activeTab === 'home' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('conversations')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1 relative cursor-pointer ${
            activeTab === 'conversations' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chats</span>
          {needsReplyCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1 cursor-pointer ${
            activeTab === 'knowledge' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Knowledge</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1 cursor-pointer ${
            activeTab === 'customers' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customers</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold p-1 cursor-pointer ${
            activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
