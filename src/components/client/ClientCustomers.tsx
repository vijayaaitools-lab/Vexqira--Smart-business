import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerConversation } from '../../types';
import { 
  Search, 
  User, 
  Phone, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Bot, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  Edit3,
  Check
} from 'lucide-react';

interface ClientCustomersProps {
  onOpenChat: (convId: string) => void;
}

export const ClientCustomers: React.FC<ClientCustomersProps> = ({ onOpenChat }) => {
  const { currentClient, conversations, updateCustomerNotes } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerConversation | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  const clientConversations = conversations.filter(c => c.clientId === currentClient?.id);

  const filtered = clientConversations.filter(c => 
    c.customerName.toLowerCase().includes(search.toLowerCase()) ||
    c.customerPhone.includes(search) ||
    c.enquiryType.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDetail = (c: CustomerConversation) => {
    setSelectedCustomer(c);
    setNotesText(c.notes || '');
    setEditingNotes(false);
  };

  const handleSaveNotes = () => {
    if (selectedCustomer) {
      updateCustomerNotes(selectedCustomer.id, notesText);
      setSelectedCustomer({ ...selectedCustomer, notes: notesText });
      setEditingNotes(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customers</h1>
          <p className="text-xs text-slate-500">
            Simple directory of every prospect and customer who reached out on WhatsApp.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search customers by name, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Customer List Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(cust => (
          <div
            key={cust.id}
            onClick={() => handleOpenDetail(cust)}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${cust.avatarColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                    {cust.customerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cust.customerName}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{cust.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                  {cust.enquiryType}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <div className="text-xs text-slate-600 italic line-clamp-1">
                  "{cust.lastMessage}"
                </div>
                <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between pt-1">
                  <span>Last contacted: {cust.lastMessageTime}</span>
                  <span className={cust.takeoverMode === 'vexqira' ? 'text-indigo-600 font-semibold' : 'text-amber-600 font-semibold'}>
                    {cust.takeoverMode === 'vexqira' ? '🤖 Automated' : '👤 Manual'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>View Customer Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${selectedCustomer.avatarColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center text-base shadow-xs`}>
                  {selectedCustomer.customerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{selectedCustomer.customerName}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>{selectedCustomer.customerPhone}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-semibold">{selectedCustomer.enquiryType}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Automation Status</div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    {selectedCustomer.takeoverMode === 'vexqira' ? '🟢 Vexqira Handling' : '🟡 Manual Takeover'}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Last Contact</div>
                  <div className="font-bold text-slate-900">{selectedCustomer.lastMessageTime}</div>
                </div>
              </div>

              {/* Last Conversation snippet */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-700">Last Conversation Message</div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 italic leading-relaxed">
                  "{selectedCustomer.lastMessage}"
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">Internal Notes</span>
                  {!editingNotes && (
                    <button
                      onClick={() => setEditingNotes(true)}
                      className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Notes
                    </button>
                  )}
                </div>

                {editingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={notesText}
                      onChange={e => setNotesText(e.target.value)}
                      placeholder="Add buyer requirements, budget, timeline..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNotes(false)}
                        className="px-3 py-1.5 text-slate-600 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNotes}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 min-h-[50px]">
                    {selectedCustomer.notes || <span className="text-slate-400 italic">No notes recorded yet.</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  const id = selectedCustomer.id;
                  setSelectedCustomer(null);
                  onOpenChat(id);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Conversation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
