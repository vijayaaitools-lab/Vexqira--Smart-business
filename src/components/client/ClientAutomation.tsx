import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AutomationRule } from '../../types';
import { 
  Bot, 
  Play, 
  Pause, 
  HelpCircle, 
  UserCheck, 
  Clock, 
  Bell, 
  Edit, 
  Check, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';

export const ClientAutomation: React.FC = () => {
  const { currentClient, toggleAutomation, updateAutomationRule } = useApp();
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [tempGreeting, setTempGreeting] = useState('');
  const [tempKeywords, setTempKeywords] = useState('');
  const [tempQuestions, setTempQuestions] = useState('');

  if (!currentClient) return null;

  const isAutomationActive = currentClient.automationStatus === 'Active';

  const handleOpenEdit = (rule: AutomationRule) => {
    setEditingRule(rule);
    setTempGreeting(rule.config.greetingText || '');
    setTempKeywords(rule.config.keywords?.join(', ') || '');
    setTempQuestions(rule.config.questions?.join('\n') || '');
  };

  const handleSaveRule = () => {
    if (!editingRule) return;

    const updates: Partial<AutomationRule> = {
      config: {
        ...editingRule.config,
        greetingText: tempGreeting || editingRule.config.greetingText,
        keywords: tempKeywords ? tempKeywords.split(',').map(k => k.trim()) : editingRule.config.keywords,
        questions: tempQuestions ? tempQuestions.split('\n').filter(q => q.trim()) : editingRule.config.questions
      }
    };

    updateAutomationRule(currentClient.id, editingRule.id, updates);
    setEditingRule(null);
  };

  const handleToggleRule = (ruleId: string, currentEnabled: boolean) => {
    updateAutomationRule(currentClient.id, ruleId, { enabled: !currentEnabled });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">WhatsApp Automation</h1>
        <p className="text-xs text-slate-500">
          Control how Vexqira automatically greets, assists, and qualifies your WhatsApp enquiries.
        </p>
      </div>

      {/* MAIN AUTOMATION STATUS CONTROL BANNER */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 transition-all shadow-sm ${
        isAutomationActive
          ? 'bg-gradient-to-r from-emerald-50 via-white to-indigo-50/40 border-emerald-300'
          : 'bg-gradient-to-r from-amber-50 via-white to-rose-50/40 border-amber-300'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className={`w-3.5 h-3.5 rounded-full ${isAutomationActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <h2 className="text-xl font-black text-slate-900">
                {isAutomationActive ? '🟢 Automation Active' : '🟡 Automation Paused'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
              {isAutomationActive
                ? 'Vexqira is currently handling your customer enquiries automatically 24/7.'
                : 'Your customers will not receive automated replies while automation is paused.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAutomationActive ? (
              <button
                onClick={() => toggleAutomation(currentClient.id)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-xs transition-all flex items-center gap-2 text-xs"
              >
                <Pause className="w-4 h-4" />
                <span>Pause Automation</span>
              </button>
            ) : (
              <button
                onClick={() => toggleAutomation(currentClient.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 text-xs"
              >
                <Play className="w-4 h-4" />
                <span>Resume Automation</span>
              </button>
            )}
          </div>
        </div>

        {!isAutomationActive && (
          <div className="mt-4 p-3 bg-amber-100/70 rounded-xl border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Incoming WhatsApp messages will remain unanswered until you resume automation or reply manually.</span>
          </div>
        )}
      </div>

      {/* 5 SIMPLE AUTOMATION CARDS */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Automated Capabilities
        </h3>

        <div className="grid gap-4">
          {currentClient.automations.map((rule) => {
            const isEnabled = rule.enabled && isAutomationActive;

            return (
              <div
                key={rule.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-extrabold text-sm text-slate-900">{rule.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isEnabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {isEnabled ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                    {rule.description}
                  </p>

                  {/* Snippet preview */}
                  {rule.type === 'auto_reply' && rule.config.greetingText && (
                    <div className="bg-slate-50 p-2 rounded-lg text-[11px] text-slate-600 italic border border-slate-100 line-clamp-1">
                      "{rule.config.greetingText}"
                    </div>
                  )}

                  {rule.type === 'faq' && rule.config.keywords && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rule.config.keywords.map(kw => (
                        <span key={kw} className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleToggleRule(rule.id, rule.enabled)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      rule.enabled
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {rule.enabled ? 'Pause' : 'Enable'}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(rule)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simple Edit Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Edit {editingRule.title}
              </h3>
              <button
                onClick={() => setEditingRule(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {editingRule.type === 'auto_reply' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Greeting Message Template
                  </label>
                  <textarea
                    rows={4}
                    value={tempGreeting}
                    onChange={e => setTempGreeting(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {editingRule.type === 'faq' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Trigger Keywords (separated by comma)
                  </label>
                  <input
                    type="text"
                    value={tempKeywords}
                    onChange={e => setTempKeywords(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Example: 2 BHK, price, location, brochure, timing
                  </p>
                </div>
              )}

              {editingRule.type === 'lead_capture' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Qualification Questions (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={tempQuestions}
                    onChange={e => setTempQuestions(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {(editingRule.type === 'followup' || editingRule.type === 'notification') && (
                <div className="bg-indigo-50 p-4 rounded-xl text-indigo-900 leading-relaxed font-medium">
                  This automation automatically triggers based on client message status and priority detection.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEditingRule(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRule}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
