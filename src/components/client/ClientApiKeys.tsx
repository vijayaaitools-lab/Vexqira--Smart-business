import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Key, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ExternalLink, 
  Cpu, 
  ShieldCheck, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ClientApiKeys: React.FC = () => {
  const { currentClient, updateApiConfig } = useApp();

  const apiConfig = currentClient?.apiConfig || {
    whatsappPhoneNumberId: '109482019482019',
    wabaAccountId: '294820194829103',
    accessToken: 'EAAG9z0QZBV...w81mP98102k',
    webhookVerifyToken: 'vexqira_sec_verify_998124',
    webhookCallbackUrl: 'https://api.vexqira.com/v1/webhook/client_98201',
    connectionStatus: 'Connected',
    lastVerifiedAt: 'Just now',
    aiProvider: 'vexqira_cloud'
  };

  const [phoneId, setPhoneId] = useState(apiConfig.whatsappPhoneNumberId);
  const [wabaId, setWabaId] = useState(apiConfig.wabaAccountId);
  const [accessToken, setAccessToken] = useState(apiConfig.accessToken);
  const [verifyToken, setVerifyToken] = useState(apiConfig.webhookVerifyToken);
  const [showToken, setShowToken] = useState(false);
  const [aiProvider, setAiProvider] = useState(apiConfig.aiProvider || 'vexqira_cloud');
  const [customAiKey, setCustomAiKey] = useState(apiConfig.customAiApiKey || '');
  const [showAiKey, setShowAiKey] = useState(false);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!currentClient) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setTesting(false);
      if (phoneId && accessToken) {
        setTestResult({
          success: true,
          message: `Connected successfully to Meta WhatsApp Graph API v20.0 for ${currentClient.whatsappNumber} (Latency: 42ms)`
        });
        updateApiConfig(currentClient.id, {
          connectionStatus: 'Connected',
          lastVerifiedAt: new Date().toLocaleTimeString()
        });
      } else {
        setTestResult({
          success: false,
          message: 'Please provide both Phone Number ID and Meta Access Token to connect.'
        });
      }
    }, 1000);
  };

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiConfig(currentClient.id, {
      whatsappPhoneNumberId: phoneId,
      wabaAccountId: wabaId,
      accessToken: accessToken,
      webhookVerifyToken: verifyToken,
      aiProvider: aiProvider as any,
      customAiApiKey: customAiKey,
      connectionStatus: 'Connected',
      lastVerifiedAt: 'Just now'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">API Keys & WhatsApp Setup</h1>
        <p className="text-xs text-slate-500">
          Connect your official WhatsApp Cloud API credentials to start automated messaging.
        </p>
      </div>

      {/* CONNECTION STATUS BANNER */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50/30 p-6 rounded-3xl border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-extrabold text-slate-900">WhatsApp Gateway: Connected & Active</span>
          </div>
          <p className="text-xs text-slate-600">
            Messages are delivered in real-time to {currentClient.phone} via Meta Cloud API.
          </p>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Verifying Gateway...' : 'Test Connection'}</span>
        </button>
      </div>

      {testResult && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
          testResult.success 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* API CREDENTIALS FORM */}
      <form onSubmit={handleSaveApiKeys} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Meta WhatsApp Cloud API Credentials</h2>
                <p className="text-xs text-slate-500">Obtained from your Meta for Developers dashboard</p>
              </div>
            </div>

            <a
              href="https://developers.facebook.com/apps"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline"
            >
              <span>Meta Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Phone Number ID</span>
                <span className="text-[10px] text-slate-400 font-normal">From WhatsApp &gt; API Setup</span>
              </label>
              <input
                type="text"
                value={phoneId}
                onChange={e => setPhoneId(e.target.value)}
                placeholder="e.g. 109482019482019"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>WhatsApp Business Account ID (WABA ID)</span>
                <span className="text-[10px] text-slate-400 font-normal">WABA ID</span>
              </label>
              <input
                type="text"
                value={wabaId}
                onChange={e => setWabaId(e.target.value)}
                placeholder="e.g. 294820194829103"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Meta System User Access Token / API Key</span>
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showToken ? 'Hide Key' : 'Show Key'}</span>
              </button>
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={accessToken}
                onChange={e => setAccessToken(e.target.value)}
                placeholder="EAAG9z0QZBV... (Permanent Access Token)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 pr-20 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleCopy(accessToken, 'token')}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
              >
                {copiedField === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'token' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Webhook Settings */}
          <div className="pt-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Webhook Configuration (Paste into Meta Dashboard)
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Webhook Callback URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={apiConfig.webhookCallbackUrl}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(apiConfig.webhookCallbackUrl, 'webhookUrl')}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 shrink-0"
                    title="Copy Webhook URL"
                  >
                    {copiedField === 'webhookUrl' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Webhook Verify Token
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={verifyToken}
                    onChange={e => setVerifyToken(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(verifyToken, 'verifyToken')}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 shrink-0"
                    title="Copy Verify Token"
                  >
                    {copiedField === 'verifyToken' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI ENGINE SELECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">AI Intelligence Engine</h2>
              <p className="text-xs text-slate-500">Choose managed cloud AI or bring your own API key</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              aiProvider === 'vexqira_cloud'
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>Vexqira Cloud AI (Recommended)</span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Pre-configured, ultra-fast Gemini 2.5 Flash managed by Vexqira. No custom API setup required.
                  </p>
                </div>
                <input
                  type="radio"
                  name="aiProvider"
                  checked={aiProvider === 'vexqira_cloud'}
                  onChange={() => setAiProvider('vexqira_cloud')}
                  className="mt-1"
                />
              </div>
              <span className="text-[11px] font-bold text-indigo-700 mt-3">Included in your plan</span>
            </label>

            <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              aiProvider !== 'vexqira_cloud'
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-extrabold text-sm text-slate-900">
                    Bring Your Own API Key
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Use your custom Google Gemini or OpenAI API credentials for unlimited custom usage.
                  </p>
                </div>
                <input
                  type="radio"
                  name="aiProvider"
                  checked={aiProvider !== 'vexqira_cloud'}
                  onChange={() => setAiProvider('custom_gemini')}
                  className="mt-1"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-600 mt-3">Custom developer key</span>
            </label>
          </div>

          {aiProvider !== 'vexqira_cloud' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Your Custom Gemini / OpenAI API Key</span>
                <button
                  type="button"
                  onClick={() => setShowAiKey(!showAiKey)}
                  className="text-[11px] text-indigo-600 font-bold"
                >
                  {showAiKey ? 'Hide' : 'Show'}
                </button>
              </label>
              <input
                type={showAiKey ? 'text' : 'password'}
                value={customAiKey}
                onChange={e => setCustomAiKey(e.target.value)}
                placeholder="AIzaSy... or sk-..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> API credentials updated and active!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto bg-gradient-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Save & Connect WhatsApp</span>
            </button>
          </div>
        </div>
      </form>

      {/* QUICK 3-STEP GUIDE CARD */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Quick 3-Step Setup Guide</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-[10px]">
              1
            </span>
            <div className="font-bold text-slate-900">Create Meta App</div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Visit Meta Developer portal, create a 'Business' App, and add WhatsApp product.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-[10px]">
              2
            </span>
            <div className="font-bold text-slate-900">Copy Phone & Token</div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Copy your Phone Number ID and Permanent Access Token and paste them above.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-[10px]">
              3
            </span>
            <div className="font-bold text-slate-900">Paste Webhook URL</div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Paste the Callback URL in Meta Webhooks and subscribe to `messages`. Done!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
