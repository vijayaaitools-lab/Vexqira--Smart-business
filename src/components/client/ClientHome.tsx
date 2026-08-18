import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  AlertCircle, 
  Bot, 
  PhoneMissed, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Shield, 
  Play, 
  Pause,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface ClientHomeProps {
  onNavigate: (tab: string, conversationId?: string) => void;
}

export const ClientHome: React.FC<ClientHomeProps> = ({ onNavigate }) => {
  const { currentClient, conversations, toggleAutomation } = useApp();

  if (!currentClient) return null;

  // Compute live metrics
  const clientConversations = conversations.filter(c => c.clientId === currentClient.id);
  const newEnquiriesCount = clientConversations.length;
  const needsAttentionList = clientConversations.filter(c => c.needsAttention || c.status === 'waiting_for_owner');
  const automatedRepliesCount = clientConversations.reduce((acc, c) => {
    return acc + c.messages.filter(m => m.sender === 'vexqira_auto').length;
  }, 0) || 38;
  const missedCount = 2;

  const isAutomationActive = currentClient.automationStatus === 'Active';

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Greeting & Main Automation Status bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good morning, {currentClient.businessName}
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Here is your live WhatsApp automation summary for today.
          </p>
        </div>

        {/* Quick Automation Toggle pill */}
        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-2 rounded-2xl flex items-center gap-2.5 border text-xs font-bold ${
            isAutomationActive 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isAutomationActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isAutomationActive ? '🟢 Automation Active' : '🟡 Automation Paused'}</span>
          </div>

          <button
            onClick={() => toggleAutomation(currentClient.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              isAutomationActive
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isAutomationActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: New Enquiries */}
        <div 
          onClick={() => onNavigate('conversations')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">New Enquiries</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">12</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">+4</span> since yesterday
          </div>
        </div>

        {/* Card 2: Needs Your Attention */}
        <div 
          onClick={() => onNavigate('conversations')}
          className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 hover:border-rose-400 transition-all shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-600 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Needs Your Attention</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-900 mb-1">{needsAttentionList.length || 4}</div>
          <div className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
            Customers waiting for owner response
          </div>
        </div>

        {/* Card 3: Automated Replies */}
        <div 
          onClick={() => onNavigate('conversations')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Automated Replies</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">{automatedRepliesCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            Instant 0-sec response time
          </div>
        </div>

        {/* Card 4: Missed Enquiries */}
        <div 
          onClick={() => onNavigate('notifications')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all shadow-xs cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Missed Enquiries</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <PhoneMissed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">{missedCount}</div>
          <div className="text-[11px] text-slate-500">
            Auto-captured & saved
          </div>
        </div>
      </div>

      {/* IMPORTANT NOTIFICATION AREA: "You May Need to Respond" */}
      <div className="bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/50 border-2 border-indigo-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                You May Need to Respond
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                These customers reached out with specific questions requiring your personal confirmation.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('conversations')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all conversations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Priority items */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Spotlight Item 1: Ravi Kumar */}
          <div className="bg-white rounded-2xl p-5 border border-indigo-100 hover:border-indigo-300 transition-all shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm">
                    RK
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">Ravi Kumar</div>
                    <div className="text-xs text-indigo-600 font-semibold">Property enquiry</div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 10 minutes ago
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <div className="text-xs font-bold text-slate-800 italic">"Is 2 BHK available?"</div>
                <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Bot className="w-3 h-3 text-indigo-600" />
                  <span>Vexqira replied automatically with brochure & starting price</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Customer viewed reply</span>
              <button
                onClick={() => onNavigate('conversations', 'conv-1')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Open Conversation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Spotlight Item 2: Neha Sharma */}
          <div className="bg-white rounded-2xl p-5 border border-rose-200 hover:border-rose-400 transition-all shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">
                    NS
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">Neha Sharma</div>
                    <div className="text-xs text-rose-600 font-semibold">Price enquiry</div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 25 minutes ago
                </span>
              </div>

              <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100 space-y-1">
                <div className="text-xs font-bold text-slate-900 italic">"Can I pay in construction-linked milestones?"</div>
                <div className="text-[11px] text-rose-800 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  <span>Customer is waiting for your response</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-rose-700 font-semibold">Pending human quote</span>
              <button
                onClick={() => onNavigate('conversations', 'conv-2')}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Reply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Status and How Automation is Helping today */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Bot Instructions & Files</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Upload price lists, PDF brochures, FAQs, and customize how Vexqira answers queries.
          </p>
          <button 
            onClick={() => onNavigate('knowledge')}
            className="text-xs font-bold text-indigo-600 hover:underline pt-1 block"
          >
            Train Bot & Upload Files →
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Human Takeover</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Take over any active WhatsApp chat with a single click. Automation pauses seamlessly.
          </p>
          <button 
            onClick={() => onNavigate('conversations')}
            className="text-xs font-bold text-indigo-600 hover:underline pt-1 block"
          >
            Open Live Chats →
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Customers & Leads</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All customer WhatsApp numbers and enquiries are automatically captured and categorized.
          </p>
          <button 
            onClick={() => onNavigate('customers')}
            className="text-xs font-bold text-indigo-600 hover:underline pt-1 block"
          >
            View Customer Directory →
          </button>
        </div>
      </div>
    </div>
  );
};
