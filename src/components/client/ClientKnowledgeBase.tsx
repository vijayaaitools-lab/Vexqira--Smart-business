import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { KnowledgeDocument, KnowledgeFaq, CatalogItem } from '../../types';
import { 
  BookOpen, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  UploadCloud, 
  Trash2, 
  Plus, 
  HelpCircle, 
  Sparkles, 
  Check, 
  Bot, 
  Send, 
  CheckCircle2, 
  Building, 
  Tag, 
  FileCheck, 
  Layers, 
  MessageSquare,
  AlertCircle,
  X,
  FileCode
} from 'lucide-react';

export const ClientKnowledgeBase: React.FC = () => {
  const { 
    currentClient, 
    updateBotInstructions, 
    addKnowledgeDocument, 
    deleteKnowledgeDocument,
    addFaq,
    deleteFaq,
    addCatalogItem,
    deleteCatalogItem
  } = useApp();

  const [activeTab, setActiveTab] = useState<'instructions' | 'documents' | 'faqs' | 'catalog' | 'simulator'>('instructions');

  // Bot Instructions State
  const [instructions, setInstructions] = useState(currentClient?.botInstructions || '');
  const [botTone, setBotTone] = useState<any>(currentClient?.botTone || 'friendly');
  const [fallback, setFallback] = useState(currentClient?.fallbackBehavior || '');
  const [instructionsSaved, setInstructionsSaved] = useState(false);

  // FAQ Modal / Form State
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('General');

  // Catalog / Properties Modal / Form State
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catTitle, setCatTitle] = useState('');
  const [catCategory, setCatCategory] = useState('Real Estate');
  const [catPrice, setCatPrice] = useState('');
  const [catAvailability, setCatAvailability] = useState<'Available' | 'Limited' | 'Sold Out'>('Available');
  const [catDetails, setCatDetails] = useState('');

  // Document Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Live Simulator State
  const [simMessages, setSimMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: `Hello! I am ${currentClient?.businessName}'s automated WhatsApp assistant. How can I help you today?`,
      time: 'Just now'
    }
  ]);
  const [simInput, setSimInput] = useState('');
  const [simTyping, setSimTyping] = useState(false);

  if (!currentClient) return null;

  // Preset Industry Prompt Templates
  const applyIndustryTemplate = (type: string) => {
    if (type === 'real_estate') {
      setInstructions(
        `You are the 24/7 WhatsApp concierge for ${currentClient.businessName}. You answer questions about available 2 BHK and 3 BHK apartments, starting prices, RERA registration, amenities (Gym, Pool, Clubhouse), and directions. Always politely ask if the customer would like to book a weekend site visit.`
      );
      setBotTone('friendly');
      setFallback('Politely inform the buyer that property manager ' + currentClient.ownerName + ' will call back with full quotation details within 15 minutes.');
    } else if (type === 'salon') {
      setInstructions(
        `You are the friendly salon coordinator for ${currentClient.businessName}. You provide haircut, hair spa, bridal packages, and massage prices. Guide clients to select their preferred service and stylist time slot.`
      );
      setBotTone('friendly');
      setFallback('Advise the client that front desk will confirm their appointment slot shortly.');
    } else if (type === 'clinic') {
      setInstructions(
        `You are the patient reception assistant for ${currentClient.businessName}. Assist patients with doctor consultation hours, clinic address, and appointment requests. For medical emergencies, always advise visiting the clinic immediately or calling ambulance.`
      );
      setBotTone('formal');
      setFallback('Inform patient that clinic coordinator will confirm doctor availability.');
    }
  };

  const handleSaveInstructions = (e: React.FormEvent) => {
    e.preventDefault();
    updateBotInstructions(currentClient.id, instructions, botTone, fallback);
    setInstructionsSaved(true);
    setTimeout(() => setInstructionsSaved(false), 3000);
  };

  // Document Upload Handler (PDF, Word, Excel, Images, Text)
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const extension = file.name.split('.').pop()?.toLowerCase();
    let docType: 'pdf' | 'word' | 'excel' | 'image' | 'text' = 'pdf';

    if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
      docType = 'excel';
    } else if (extension === 'doc' || extension === 'docx') {
      docType = 'word';
    } else if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'webp') {
      docType = 'image';
    } else if (extension === 'txt') {
      docType = 'text';
    }

    const fileSizeStr = file.size > 1024 * 1024 
      ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' 
      : Math.round(file.size / 1024) + ' KB';

    setUploadStatus(`Indexing ${file.name} with Vexqira AI Engine...`);

    setTimeout(() => {
      addKnowledgeDocument(currentClient.id, {
        name: file.name,
        type: docType,
        size: fileSizeStr,
        summary: `Parsed and indexed content from ${file.name}. Information is now active for automated customer replies.`
      });
      setUploadStatus(`✅ ${file.name} successfully indexed into bot knowledge base!`);
      setTimeout(() => setUploadStatus(null), 4000);
    }, 900);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) return;
    addFaq(currentClient.id, {
      question: faqQuestion,
      answer: faqAnswer,
      category: faqCategory
    });
    setFaqQuestion('');
    setFaqAnswer('');
    setShowFaqModal(false);
  };

  const handleSaveCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle || !catPrice) return;
    addCatalogItem(currentClient.id, {
      title: catTitle,
      category: catCategory,
      price: catPrice,
      availability: catAvailability,
      details: catDetails
    });
    setCatTitle('');
    setCatPrice('');
    setCatDetails('');
    setShowCatalogModal(false);
  };

  // Simulator bot query response using knowledge base
  const handleSendSimulatorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simInput.trim()) return;

    const userText = simInput.trim();
    const newMsg = { sender: 'user' as const, text: userText, time: 'Just now' };
    setSimMessages(prev => [...prev, newMsg]);
    setSimInput('');
    setSimTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = userText.toLowerCase();

      // Check Catalog / Properties match
      const matchingItem = currentClient.catalogItems?.find(item => 
        lower.includes(item.title.toLowerCase().split(' ')[0]) || 
        (lower.includes('price') && lower.includes(item.category.toLowerCase())) ||
        (lower.includes('2 bhk') && item.title.includes('2 BHK')) ||
        (lower.includes('3 bhk') && item.title.includes('3 BHK')) ||
        (lower.includes('penthouse') && item.title.toLowerCase().includes('penthouse'))
      );

      // Check FAQ match
      const matchingFaq = currentClient.knowledgeFaqs?.find(faq => 
        lower.includes('rera') && faq.question.toLowerCase().includes('rera') ||
        lower.includes('visit') && faq.question.toLowerCase().includes('visit') ||
        lower.includes('timing') && faq.question.toLowerCase().includes('visiting') ||
        lower.includes('possession') && faq.question.toLowerCase().includes('possession')
      );

      if (matchingItem) {
        botResponse = `Yes! We have ${matchingItem.title} available at ${matchingItem.price}. Details: ${matchingItem.details}. Status: ${matchingItem.availability}. Would you like to schedule an on-site visit?`;
      } else if (matchingFaq) {
        botResponse = matchingFaq.answer;
      } else if (lower.includes('pdf') || lower.includes('brochure') || lower.includes('floor plan')) {
        botResponse = `Here is our detailed brochure and rate sheet indexed from our official documents: https://prestigerealty.com/brochure.pdf. Let me know if you would like me to book a tour!`;
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        botResponse = `Hello! Welcome to ${currentClient.businessName}. We have 2 & 3 BHK luxury residences starting at ₹82.5 Lakhs. How can I assist you today?`;
      } else {
        botResponse = `${currentClient.fallbackBehavior} I have recorded your query: "${userText}" and our property specialist will reach out shortly.`;
      }

      setSimMessages(prev => [...prev, { sender: 'bot', text: botResponse, time: 'Just now' }]);
      setSimTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Bot Instructions & Knowledge Base</h1>
        <p className="text-xs text-slate-500">
          Train your WhatsApp bot with custom instructions, FAQ questions, price lists, and uploaded PDF/Excel documents.
        </p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('instructions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'instructions'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bot Instructions & Tone</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'documents'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Uploaded Files ({currentClient.knowledgeDocuments?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Price List & Properties ({currentClient.catalogItems?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'faqs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQs ({currentClient.knowledgeFaqs?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Live Bot Tester</span>
        </button>
      </div>

      {/* TAB 1: BOT INSTRUCTIONS & TONE */}
      {activeTab === 'instructions' && (
        <form onSubmit={handleSaveInstructions} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Custom Bot Personality & Prompt</h2>
                <p className="text-xs text-slate-500">Provide direct instructions on how your WhatsApp AI should behave</p>
              </div>

              {/* Template Quick Loader */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">Apply Template:</span>
                <button
                  type="button"
                  onClick={() => applyIndustryTemplate('real_estate')}
                  className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Real Estate
                </button>
                <button
                  type="button"
                  onClick={() => applyIndustryTemplate('salon')}
                  className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Salon & Spa
                </button>
                <button
                  type="button"
                  onClick={() => applyIndustryTemplate('clinic')}
                  className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Clinic
                </button>
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Response Tone & Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'friendly', label: 'Friendly & Warm', desc: 'Approachable, polite, helpful' },
                  { id: 'formal', label: 'Formal & Corporate', desc: 'Professional and courteous' },
                  { id: 'concise', label: 'Concise & Direct', desc: 'Short answers, fast facts' },
                  { id: 'sales_focused', label: 'Sales & Conversion', desc: 'Promotes visits & bookings' }
                ].map(tone => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setBotTone(tone.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      botTone === tone.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{tone.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tone.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* System Instructions Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>System Instructions for Bot</span>
                <span className="text-[11px] text-slate-400">{instructions.length} characters</span>
              </label>
              <textarea
                rows={6}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Instruct the bot on what products you offer, discounts policy, visiting hours, and qualification rules..."
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-xs font-sans text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Fallback Behavior */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Fallback Rule (What should the bot say when unsure?)
              </label>
              <input
                type="text"
                value={fallback}
                onChange={e => setFallback(e.target.value)}
                placeholder="e.g. Apologize and inform the customer that Vikram Mehta will call back in 15 minutes."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {instructionsSaved && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Instructions saved and synced with Vexqira AI!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Bot Instructions</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: MULTI-FORMAT DOCUMENT UPLOADS (PDF, Word, Excel, Images, Text) */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* UPLOAD DROPZONE */}
          <div
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={e => {
              e.preventDefault();
              setDragActive(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-indigo-600 bg-indigo-50/70 scale-[0.99]' 
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.txt"
              className="hidden"
              onChange={e => handleFileUpload(e.target.files)}
            />

            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-extrabold text-slate-900 mb-1">
              Upload Files for Bot Knowledge Base
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Drag and drop your price lists, brochures, or property inventories. Supports <strong>PDF, Word (.docx), Excel (.xlsx/.csv), Images (.png/.jpg)</strong> and text files.
            </p>

            <div className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors">
              <Plus className="w-3.5 h-3.5" />
              <span>Browse Files on Computer</span>
            </div>
          </div>

          {uploadStatus && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{uploadStatus}</span>
            </div>
          )}

          {/* ACTIVE DOCUMENTS LIST */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">
                Indexed Documents ({currentClient.knowledgeDocuments?.length || 0})
              </h3>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All documents active for bot queries</span>
              </span>
            </div>

            <div className="grid gap-3">
              {(currentClient.knowledgeDocuments || []).map(doc => {
                const isPdf = doc.type === 'pdf';
                const isExcel = doc.type === 'excel';
                const isImage = doc.type === 'image';
                const isWord = doc.type === 'word';

                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isPdf ? 'bg-rose-100 text-rose-600' :
                        isExcel ? 'bg-emerald-100 text-emerald-600' :
                        isImage ? 'bg-cyan-100 text-cyan-600' :
                        isWord ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {isPdf && <FileText className="w-5 h-5" />}
                        {isExcel && <FileSpreadsheet className="w-5 h-5" />}
                        {isImage && <ImageIcon className="w-5 h-5" />}
                        {isWord && <FileCheck className="w-5 h-5" />}
                        {!isPdf && !isExcel && !isImage && !isWord && <FileCode className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">
                          {doc.summary}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium pt-1">
                          <span>Size: {doc.size}</span>
                          <span>•</span>
                          <span>Uploaded: {doc.uploadDate}</span>
                          {doc.parsedItemCount && (
                            <>
                              <span>•</span>
                              <span>Indexed {doc.parsedItemCount} items</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteKnowledgeDocument(currentClient.id, doc.id)}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-white self-end sm:self-center transition-colors"
                      title="Remove Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROPERTIES & PRICE LIST CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Available Properties & Price List ({currentClient.catalogItems?.length || 0})
                </h3>
                <p className="text-xs text-slate-500">
                  The bot uses this inventory list to answer price, size, and availability inquiries instantly.
                </p>
              </div>

              <button
                onClick={() => setShowCatalogModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Property / Service</span>
              </button>
            </div>

            <div className="grid gap-3">
              {(currentClient.catalogItems || []).map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {item.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.availability === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                        item.availability === 'Limited' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.availability}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{item.details}</p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="text-sm font-black text-slate-900 font-mono">{item.price}</span>
                    <button
                      onClick={() => deleteCatalogItem(currentClient.id, item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE FAQ MANAGER */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Custom FAQ Knowledge Base ({currentClient.knowledgeFaqs?.length || 0})
                </h3>
                <p className="text-xs text-slate-500">
                  Direct Question & Answer pairs for instant automated WhatsApp replies.
                </p>
              </div>

              <button
                onClick={() => setShowFaqModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question & Answer</span>
              </button>
            </div>

            <div className="grid gap-3">
              {(currentClient.knowledgeFaqs || []).map(faq => (
                <div
                  key={faq.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">Q</span>
                      <span>{faq.question}</span>
                    </div>

                    <button
                      onClick={() => deleteFaq(currentClient.id, faq.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                    {faq.answer}
                  </p>

                  {faq.category && (
                    <div className="pl-6 pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LIVE BOT TEST SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-600" />
                <span>Live WhatsApp Bot Simulator</span>
              </h3>
              <p className="text-xs text-slate-500">
                Test your bot in real-time. It references your instructions, uploaded documents, price lists, and FAQs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSimMessages([{
                sender: 'bot',
                text: `Hello! I am ${currentClient.businessName}'s automated WhatsApp assistant. How can I help you today?`,
                time: 'Just now'
              }])}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
            >
              Reset Chat
            </button>
          </div>

          {/* Chat simulator window */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 min-h-[340px] max-h-[440px] overflow-y-auto space-y-3 font-sans">
            {simMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {simTyping && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
                <Bot className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Vexqira Bot is formulating answer from documents...</span>
              </div>
            )}
          </div>

          {/* Simulator Input */}
          <form onSubmit={handleSendSimulatorMessage} className="flex gap-2">
            <input
              type="text"
              value={simInput}
              onChange={e => setSimInput(e.target.value)}
              placeholder="Ask anything (e.g. 'What are 2 BHK prices?', 'Is project RERA approved?', 'Can I visit Saturday?')"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* MODAL: ADD FAQ */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add New FAQ</h3>
              <button onClick={() => setShowFaqModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is the down payment required?"
                  value={faqQuestion}
                  onChange={e => setFaqQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Answer</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. 10% booking amount at signing, rest linked to construction milestones."
                  value={faqAnswer}
                  onChange={e => setFaqAnswer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Pricing, Approvals, Timings"
                  value={faqCategory}
                  onChange={e => setFaqCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATALOG / PROPERTY */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add Property / Catalog Item</h3>
              <button onClick={() => setShowCatalogModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCatalog} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Item / Property Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 BHK East Facing - Tower B"
                  value={catTitle}
                  onChange={e => setCatTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 BHK Apartment"
                    value={catCategory}
                    onChange={e => setCatCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Price / Rate</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹85 Lakhs"
                    value={catPrice}
                    onChange={e => setCatPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Availability Status</label>
                <select
                  value={catAvailability}
                  onChange={e => setCatAvailability(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="Available">Available</option>
                  <option value="Limited">Limited Units</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Details & Specifications</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1150 sq.ft, 4th floor, 2 balconies, covered parking"
                  value={catDetails}
                  onChange={e => setCatDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatalogModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
