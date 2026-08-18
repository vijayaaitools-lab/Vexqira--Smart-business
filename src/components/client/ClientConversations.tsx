import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Send, 
  Bot, 
  User, 
  Check, 
  CheckCheck, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Sparkles, 
  Phone, 
  Info,
  RefreshCw,
  PlusCircle,
  FileText
} from 'lucide-react';

interface ClientConversationsProps {
  selectedConvId?: string;
}

export const ClientConversations: React.FC<ClientConversationsProps> = ({ selectedConvId }) => {
  const { 
    currentClient, 
    conversations, 
    toggleTakeover, 
    sendChatMessage, 
    updateCustomerNotes 
  } = useApp();

  const clientConversations = conversations.filter(c => c.clientId === currentClient?.id);
  
  const [activeId, setActiveId] = useState<string>(
    selectedConvId || (clientConversations.length > 0 ? clientConversations[0].id : '')
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'needs_attention' | 'automated'>('all');
  const [replyText, setReplyText] = useState('');
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [simCustomerInput, setSimCustomerInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConvId) {
      setActiveId(selectedConvId);
    }
  }, [selectedConvId]);

  const activeConversation = clientConversations.find(c => c.id === activeId) || clientConversations[0];

  useEffect(() => {
    if (activeConversation) {
      setNotesInput(activeConversation.notes || '');
      scrollToBottom();
    }
  }, [activeConversation?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const filteredList = clientConversations.filter(c => {
    const matchesSearch = 
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerPhone.includes(searchQuery) ||
      c.enquiryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'needs_attention') return c.needsAttention || c.status === 'waiting_for_owner';
    if (filterTab === 'automated') return c.takeoverMode === 'vexqira';
    return true;
  });

  const handleSendManualReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConversation) return;

    // Send as human agent
    sendChatMessage(activeConversation.id, replyText, 'human_agent');
    setReplyText('');
    scrollToBottom();
  };

  const handleSimulateCustomerMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simCustomerInput.trim() || !activeConversation) return;

    // Customer sends message
    sendChatMessage(activeConversation.id, simCustomerInput, 'customer');
    const question = simCustomerInput;
    setSimCustomerInput('');
    scrollToBottom();

    // If Vexqira automation is active on this conversation and client automation is on, auto-reply!
    if (activeConversation.takeoverMode === 'vexqira' && currentClient?.automationStatus === 'Active') {
      setTimeout(() => {
        let autoReply = "Thank you for your message! Our automated assistant has recorded your inquiry and will share all details with you.";
        const lower = question.toLowerCase();
        if (lower.includes('price') || lower.includes('cost')) {
          autoReply = "Our units start from ₹82 Lakhs onwards. Vikram will send you the breakdown shortly!";
        } else if (lower.includes('visit') || lower.includes('see') || lower.includes('tour')) {
          autoReply = "We can arrange a site visit today at 4:30 PM or tomorrow at 11:00 AM. Would either work?";
        }
        sendChatMessage(activeConversation.id, autoReply, 'vexqira_auto');
        scrollToBottom();
      }, 1000);
    }
  };

  const handleSaveNotes = () => {
    if (activeConversation) {
      updateCustomerNotes(activeConversation.id, notesInput);
      alert('Notes saved successfully');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden h-[calc(100vh-140px)] min-h-[580px] flex flex-col md:flex-row">
      {/* LEFT SIDE: CUSTOMER CONVERSATION LIST */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 ${activeConversation && 'hidden md:flex'}`}>
        {/* Search & Header */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Conversations</h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {clientConversations.length} Active
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 border-none rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterTab('all')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterTab === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTab('needs_attention')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterTab === 'needs_attention' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs Reply ({clientConversations.filter(c => c.needsAttention).length})
            </button>
            <button
              onClick={() => setFilterTab('automated')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterTab === 'automated' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Automated
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredList.map(conv => {
            const isSelected = activeConversation?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 relative ${
                  isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-100/80 bg-white'
                }`}
              >
                {/* Avatar with status indicator */}
                <div className="relative">
                  <div className={`w-11 h-11 rounded-full ${conv.avatarColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                    {conv.customerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  {conv.takeoverMode === 'vexqira' ? (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[9px] shadow-xs" title="Vexqira Handling">
                      🤖
                    </span>
                  ) : (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center text-[9px] shadow-xs" title="Manual Takeover">
                      👤
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{conv.customerName}</span>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">{conv.lastMessageTime}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium truncate mb-1">
                    {conv.lastMessage}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium truncate max-w-[120px]">
                      {conv.enquiryType}
                    </span>

                    {conv.needsAttention && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" /> Needs Reply
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: ACTIVE CONVERSATION & HUMAN TAKEOVER */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-slate-100/40 relative">
          {/* Conversation Top Header */}
          <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveId('')}
                className="md:hidden text-xs font-bold text-indigo-600 bg-slate-100 px-2 py-1 rounded-lg"
              >
                ← Back
              </button>
              <div className={`w-10 h-10 rounded-full ${activeConversation.avatarColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center text-sm`}>
                {activeConversation.customerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-900">{activeConversation.customerName}</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                    {activeConversation.enquiryType}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{activeConversation.customerPhone}</span>
                  <span>•</span>
                  <span className={activeConversation.takeoverMode === 'vexqira' ? 'text-indigo-600 font-bold' : 'text-amber-600 font-bold'}>
                    {activeConversation.takeoverMode === 'vexqira' ? '🤖 Vexqira Automation' : '👤 Manual Human Control'}
                  </span>
                </div>
              </div>
            </div>

            {/* HUMAN TAKEOVER CONTROLS (Rule 9: Reply Myself vs Let Vexqira Handle) */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    if (activeConversation.takeoverMode !== 'manual') toggleTakeover(activeConversation.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeConversation.takeoverMode === 'manual'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Reply Myself</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeConversation.takeoverMode !== 'vexqira') toggleTakeover(activeConversation.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeConversation.takeoverMode === 'vexqira'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Let Vexqira Handle</span>
                </button>
              </div>

              <button
                onClick={() => setShowNotesDrawer(!showNotesDrawer)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                  showNotesDrawer ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Customer Notes"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Notes</span>
              </button>
            </div>
          </div>

          {/* Attention Banner if customer is waiting */}
          {activeConversation.needsAttention && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 flex items-center justify-between text-xs text-rose-800">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{activeConversation.attentionReason || 'Customer is waiting for your response'}</span>
              </div>
              <button
                onClick={() => {
                  if (activeConversation.takeoverMode !== 'manual') toggleTakeover(activeConversation.id);
                  setReplyText('Hi ' + activeConversation.customerName.split(' ')[0] + ', I can assist you with this directly. ');
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors"
              >
                Quick Takeover
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="text-center my-2">
              <span className="bg-slate-200/70 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Official WhatsApp Encrypted Channel
              </span>
            </div>

            {activeConversation.messages.map(msg => {
              const isCustomer = msg.sender === 'customer';
              const isAuto = msg.sender === 'vexqira_auto';
              const isHuman = msg.sender === 'human_agent';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs relative ${
                      isCustomer
                        ? 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
                        : isAuto
                        ? 'bg-indigo-50 text-indigo-950 rounded-br-none border border-indigo-200'
                        : 'bg-indigo-600 text-white rounded-br-none'
                    }`}
                  >
                    {/* Header tag */}
                    <div className="flex items-center justify-between gap-3 mb-1 pb-1 border-b border-black/5 text-[11px] font-bold">
                      {isCustomer && <span className="text-slate-700">{activeConversation.customerName}</span>}
                      {isAuto && (
                        <span className="text-indigo-700 flex items-center gap-1">
                          🤖 Automated reply
                        </span>
                      )}
                      {isHuman && (
                        <span className="text-indigo-200 flex items-center gap-1">
                          👤 You (Manual reply)
                        </span>
                      )}
                      <span className={`text-[10px] font-normal ${isHuman ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Replies */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick presets:</span>
            <button
              onClick={() => setReplyText('Yes, I can share the complete brochure and pricing with you right away.')}
              className="whitespace-nowrap bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors text-[11px]"
            >
              "Share brochure & pricing"
            </button>
            <button
              onClick={() => setReplyText('Are you available for a 5-minute phone call to explain the available options?')}
              className="whitespace-nowrap bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors text-[11px]"
            >
              "Request short call"
            </button>
            <button
              onClick={() => setReplyText('Our property manager Vikram is available to meet you on site this Saturday at 11 AM.')}
              className="whitespace-nowrap bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors text-[11px]"
            >
              "Confirm site visit"
            </button>
          </div>

          {/* Input Toolbar */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2">
            <form onSubmit={handleSendManualReply} className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={
                  activeConversation.takeoverMode === 'manual'
                    ? "Type your personal manual WhatsApp reply..."
                    : "Type a manual reply (sending will record as You)..."
                }
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Test incoming simulator helper */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
              <form onSubmit={handleSimulateCustomerMessage} className="flex items-center gap-2 w-full">
                <span className="font-semibold text-slate-600 shrink-0">🧪 Test Incoming:</span>
                <input
                  type="text"
                  value={simCustomerInput}
                  onChange={e => setSimCustomerInput(e.target.value)}
                  placeholder="Simulate customer message (e.g. 'Can I book a visit?')"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                />
                <button
                  type="submit"
                  disabled={!simCustomerInput.trim()}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-2.5 py-1 rounded-lg font-bold text-xs transition-colors shrink-0"
                >
                  Simulate Message
                </button>
              </form>
            </div>
          </div>

          {/* Notes Sidebar / Drawer */}
          {showNotesDrawer && (
            <div className="absolute top-16 right-4 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-20 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-slate-900">Customer Notes</span>
                <button onClick={() => setShowNotesDrawer(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>
              </div>
              <textarea
                rows={4}
                value={notesInput}
                onChange={e => setNotesInput(e.target.value)}
                placeholder="Add private notes about this customer (e.g. budget, timeline)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleSaveNotes}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl transition-colors"
              >
                Save Notes
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <Bot className="w-12 h-12 text-slate-300 mb-2" />
          <p className="font-bold text-slate-600 text-sm">Select a conversation to begin</p>
          <p className="text-xs text-slate-400">Manage automated responses and take over customer chats anytime.</p>
        </div>
      )}
    </div>
  );
};
