import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  PhoneMissed, 
  AlertCircle, 
  MessageSquare, 
  CheckCheck, 
  ArrowRight, 
  Settings, 
  Mail, 
  Smartphone,
  Check
} from 'lucide-react';

interface ClientNotificationsProps {
  onOpenConversation: (convId: string) => void;
}

export const ClientNotifications: React.FC<ClientNotificationsProps> = ({ onOpenConversation }) => {
  const { 
    currentClient, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    updateClientProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'feed' | 'preferences'>('feed');

  if (!currentClient) return null;

  const clientNotifications = notifications.filter(n => n.clientId === currentClient.id);
  const unreadCount = clientNotifications.filter(n => !n.read).length;

  const handleTogglePref = (key: keyof typeof currentClient.notificationPreferences) => {
    if (key === 'channels') return;
    const currentVal = currentClient.notificationPreferences[key];
    updateClientProfile(currentClient.id, {
      notificationPreferences: {
        ...currentClient.notificationPreferences,
        [key]: !currentVal
      }
    });
  };

  const handleToggleChannel = (channel: 'inApp' | 'email' | 'whatsapp') => {
    const currentVal = currentClient.notificationPreferences.channels[channel];
    updateClientProfile(currentClient.id, {
      notificationPreferences: {
        ...currentClient.notificationPreferences,
        channels: {
          ...currentClient.notificationPreferences.channels,
          [channel]: !currentVal
        }
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500">
            Real-time alerts for incoming enquiries, missed contacts, and human takeover requests.
          </p>
        </div>

        {/* Tab switch & Mark All Read */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'feed' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Alerts {unreadCount > 0 && `(${unreadCount})`}</span>
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'preferences' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Preferences</span>
            </button>
          </div>

          {activeTab === 'feed' && unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {activeTab === 'feed' ? (
        <div className="space-y-3">
          {clientNotifications.map((notif) => {
            const isAttention = notif.type === 'needs_attention';
            const isMissed = notif.type === 'missed_call';

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.read
                    ? isAttention
                      ? 'bg-rose-50/80 border-rose-200 shadow-xs'
                      : 'bg-indigo-50/60 border-indigo-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isAttention
                      ? 'bg-rose-500 text-white'
                      : isMissed
                      ? 'bg-amber-500 text-white'
                      : 'bg-indigo-600 text-white'
                  }`}>
                    {isAttention ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : isMissed ? (
                      <PhoneMissed className="w-5 h-5" />
                    ) : (
                      <MessageSquare className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                      {notif.description}
                    </p>
                    <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                      {notif.timeAgo}
                    </div>
                  </div>
                </div>

                {notif.conversationId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(notif.id);
                      onOpenConversation(notif.conversationId!);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-end sm:self-center shrink-0 ${
                      isAttention
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <span>{notif.actionLabel || 'Reply Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Notification Preferences Tab */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Notification Triggers</h3>
            <p className="text-xs text-slate-500">Choose which events send you an alert.</p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'newEnquiry', label: 'New customer enquiry', desc: 'When a new customer sends their first message' },
              { key: 'needsAttention', label: 'Customer needs my response', desc: 'When a question requires custom pricing or human confirmation' },
              { key: 'missedEnquiry', label: 'Missed enquiry', desc: 'When a customer contacts outside configured business hours' },
              { key: 'appointmentEnquiry', label: 'Appointment enquiry', desc: 'When a customer requests a site visit or appointment booking' },
              { key: 'automationProblem', label: 'Automation notice', desc: 'If WhatsApp connection status changes' }
            ].map(item => {
              const checked = currentClient.notificationPreferences[item.key as keyof typeof currentClient.notificationPreferences] as boolean;

              return (
                <div
                  key={item.key}
                  onClick={() => handleTogglePref(item.key as any)}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.label}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    checked ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      checked ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">Notification Delivery Channels</h3>
            <p className="text-xs text-slate-500 mb-4">Select where you want to receive alerts.</p>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { key: 'inApp', label: 'In-App Alert', icon: Bell },
                { key: 'email', label: 'Email Digest', icon: Mail },
                { key: 'whatsapp', label: 'WhatsApp Alert', icon: Smartphone }
              ].map(ch => {
                const active = currentClient.notificationPreferences.channels[ch.key as 'inApp' | 'email' | 'whatsapp'];
                const IconComp = ch.icon;

                return (
                  <button
                    key={ch.key}
                    type="button"
                    onClick={() => handleToggleChannel(ch.key as any)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      active
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold">{ch.label}</span>
                    </div>
                    {active && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
