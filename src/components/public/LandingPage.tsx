import React, { useState } from 'react';
import { VexqiraLogo } from '../VexqiraLogo';
import { useApp } from '../../context/AppContext';
import { BusinessCategory } from '../../types';
import { 
  Building2, 
  Sparkles, 
  Stethoscope, 
  Utensils, 
  GraduationCap, 
  Dumbbell, 
  Store, 
  Briefcase, 
  MessageSquare, 
  Bot, 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  Zap,
  Send,
  Lock,
  X,
  Phone,
  HelpCircle,
  ShieldCheck,
  Play,
  Clock,
  UserCheck
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: (role?: 'client' | 'admin') => void;
  onOpenDemoDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onOpenDemoDashboard }) => {
  const { submitLead } = useApp();

  // Modals state
  const [showTalkModal, setShowTalkModal] = useState(false);
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);

  // Contact / Get Started form state
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    whatsappNumber: '',
    email: '',
    businessType: 'Real Estate' as BusinessCategory,
    automationNeeds: ['Customer enquiries'] as string[],
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Talk to Us quick request state
  const [talkPhone, setTalkPhone] = useState('');
  const [talkName, setTalkName] = useState('');
  const [talkTopic, setTalkTopic] = useState('WhatsApp Automation Setup');
  const [talkSubmitted, setTalkSubmitted] = useState(false);

  // Live Interactive WhatsApp Simulator state
  const [simQuery, setSimQuery] = useState('');
  const [simMessages, setSimMessages] = useState<Array<{ sender: 'user' | 'vexqira'; text: string; time: string }>>([
    { sender: 'user', text: 'Hi, what are your 2 BHK prices and can I book a visit today?', time: 'Just now' },
    { sender: 'vexqira', text: 'Hello! Thank you for reaching Prestige Realty. 2 BHK residences start at ₹82 Lakhs (1150 sq.ft). Download our brochure: prestige.com/brochure.pdf. We have visiting slots at 4:30 PM & 6:00 PM. Would you like to reserve one?', time: 'Just now' }
  ]);
  const [isSimTyping, setIsSimTyping] = useState(false);

  const businessTypes: Array<{
    title: string;
    icon: React.ElementType;
    desc: string;
  }> = [
    {
      title: 'Real Estate',
      icon: Building2,
      desc: 'Automatically answer property enquiries, send brochures, and notify you when a serious customer needs your attention.'
    },
    {
      title: 'Salons & Spas',
      icon: Sparkles,
      desc: 'Share service menus, rate cards, and capture booking requests without interrupting your active clients.'
    },
    {
      title: 'Clinics & Doctors',
      icon: Stethoscope,
      desc: 'Answer clinic timings, address queries, and schedule patient appointments automatically 24/7.'
    },
    {
      title: 'Restaurants & Cafes',
      icon: Utensils,
      desc: 'Instantly send digital menus, reservation slots, and directions to hungry guests on WhatsApp.'
    },
    {
      title: 'Coaching & Education',
      icon: GraduationCap,
      desc: 'Provide course syllabus, batch timings, and fee structures while instantly capturing prospective student leads.'
    },
    {
      title: 'Gyms & Fitness',
      icon: Dumbbell,
      desc: 'Share membership tiers, trainer schedules, and free trial passes with zero response delay.'
    },
    {
      title: 'Local Businesses',
      icon: Store,
      desc: 'Share product catalogs, operating hours, and location details while keeping your personal number private.'
    },
    {
      title: 'Service Businesses',
      icon: Briefcase,
      desc: 'Gather customer requirements, provide quotes, and notify your technicians when a job is ready.'
    }
  ];

  const automationOptions = [
    'Customer enquiries',
    'Customer support',
    'Follow-ups',
    'Appointment enquiries',
    'Missed enquiries',
    'Other'
  ];

  const handleCheckboxToggle = (option: string) => {
    setFormData(prev => {
      const exists = prev.automationNeeds.includes(option);
      if (exists) {
        return { ...prev, automationNeeds: prev.automationNeeds.filter(item => item !== option) };
      } else {
        return { ...prev, automationNeeds: [...prev.automationNeeds, option] };
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsappNumber || !formData.businessName) {
      alert('Please fill in your Name, Business Name, and WhatsApp Number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitLead({
        name: formData.name,
        businessName: formData.businessName,
        whatsappNumber: formData.whatsappNumber,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@business.com`,
        businessType: formData.businessType,
        automationNeeds: formData.automationNeeds.length > 0 ? formData.automationNeeds : ['Customer enquiries'],
        message: formData.message || 'Requested free automation consultation.'
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const handleTalkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!talkPhone) return;
    submitLead({
      name: talkName || 'WhatsApp Lead',
      businessName: 'Inquiry from Talk to Us',
      whatsappNumber: talkPhone,
      email: 'lead@vexqira.com',
      businessType: 'Other',
      automationNeeds: [talkTopic],
      message: `Direct callback request for: ${talkTopic}`
    });
    setTalkSubmitted(true);
    setTimeout(() => {
      setShowTalkModal(false);
      setTalkSubmitted(false);
      setTalkPhone('');
      setTalkName('');
    }, 3000);
  };

  const handleSimSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simQuery.trim()) return;

    const text = simQuery.trim();
    setSimMessages(prev => [...prev, { sender: 'user', text, time: 'Just now' }]);
    setSimQuery('');
    setIsSimTyping(true);

    setTimeout(() => {
      let reply = "Thank you for reaching out! Vexqira has logged your enquiry and our manager has been notified to reply with exact details.";
      const lower = text.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('fee')) {
        reply = "Our 2 BHK units start at ₹82L and 3 BHK units start at ₹1.18 Cr. Would you like a detailed quotation PDF sent to your WhatsApp?";
      } else if (lower.includes('timing') || lower.includes('hours') || lower.includes('open')) {
        reply = "We are open Monday to Saturday from 9:00 AM to 8:30 PM. Would you like to schedule an appointment?";
      } else if (lower.includes('location') || lower.includes('address') || lower.includes('where')) {
        reply = "We are located at 402 Central Heights, Main Avenue. Landmark: Near Metro Station. Need Google Maps directions?";
      } else if (lower.includes('appointment') || lower.includes('book') || lower.includes('visit')) {
        reply = "We'd love to host you! We have slots open this afternoon at 3:00 PM and tomorrow at 11:00 AM. Which works best for you?";
      }

      setSimMessages(prev => [...prev, { sender: 'vexqira', text: reply, time: 'Just now' }]);
      setIsSimTyping(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* MAIN HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <VexqiraLogo size="md" showSubtitle />
          </div>

          {/* BUTTON-STYLED SECTION HEADINGS */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-bold">
            <a
              href="#how-it-works"
              className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-indigo-700 bg-slate-100/80 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all shadow-2xs"
            >
              How It Works
            </a>
            <a
              href="#business-types"
              className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-indigo-700 bg-slate-100/80 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all shadow-2xs"
            >
              Who It's For
            </a>
            <a
              href="#demo"
              className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-indigo-700 bg-slate-100/80 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all shadow-2xs"
            >
              Live Demo
            </a>
            <button
              onClick={() => setShowTalkModal(true)}
              className="px-3.5 py-2 rounded-xl text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Talk to Us</span>
            </button>
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenLogin('client')}
              className="text-xs font-bold text-slate-800 hover:text-indigo-600 px-3.5 py-2 transition-colors border border-slate-200 hover:border-slate-300 rounded-xl bg-white shadow-xs"
            >
              Client Login
            </button>

            <button
              onClick={() => onOpenLogin('admin')}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 transition-colors border border-indigo-200 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => setShowGetStartedModal(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24">
        {/* Soft background accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-left space-y-4 sm:space-y-5">
              
              {/* COMPANY NAME ABOVE HEADLINE */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span
                    className="font-black text-2xl sm:text-3xl lg:text-4xl tracking-widest font-sans uppercase bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #00D2FF 0%, #0EA5E9 25%, #4F46E5 50%, #8B5CF6 75%, #D946EF 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block'
                    }}
                  >
                    VEXQIRA
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-500 uppercase px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
                    The Smart Business Building
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 bg-indigo-50/90 border border-indigo-200 px-3.5 py-1.5 rounded-full text-indigo-800 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Smart WhatsApp Automation for Busy Business Owners</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
                Never Miss a Customer <br />
                <span
                  className="bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #00D2FF 0%, #0EA5E9 25%, #4F46E5 50%, #8B5CF6 75%, #D946EF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  When You're Busy.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Vexqira automatically handles your WhatsApp enquiries, answers common questions, and tells you who contacted you when you need to respond.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <button
                  onClick={() => setShowGetStartedModal(true)}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white font-extrabold px-6 sm:px-7 py-3.5 rounded-xl shadow-md transition-all text-sm sm:text-base cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenDemoDashboard}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold px-5 sm:px-6 py-3.5 rounded-xl shadow-xs transition-all text-sm sm:text-base cursor-pointer"
                >
                  <span>Explore Client Dashboard</span>
                </button>
                <button
                  onClick={() => setShowTalkModal(true)}
                  className="inline-flex items-center justify-center gap-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-bold px-4 py-3.5 rounded-xl transition-all text-sm sm:text-base border border-indigo-200 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>Talk to Us</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Official WhatsApp Business API</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Human Takeover Anytime</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Setup in under 5 minutes</span>
                </div>
              </div>
            </div>

            {/* Right Hero Section: Clean Live WhatsApp Simulation Showcase */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xl space-y-4 relative">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      PR
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Prestige Realty & Homes</div>
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Vexqira WhatsApp Bot • Active</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Live Demo
                  </span>
                </div>

                {/* Chat conversation */}
                <div className="space-y-3 font-sans text-xs">
                  {/* Customer message */}
                  <div className="flex flex-col items-end">
                    <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-xs p-3 max-w-[85%] shadow-xs space-y-1">
                      <p>Hi! Can you share 2 BHK pricing, brochure & visiting hours for Prestige Residency?</p>
                      <span className="text-[9px] text-indigo-200 block text-right">10:42 AM</span>
                    </div>
                  </div>

                  {/* Vexqira Bot instant reply */}
                  <div className="flex flex-col items-start">
                    <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-xs p-3 max-w-[90%] border border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                        <Bot className="w-3 h-3" />
                        <span>Vexqira Instant Reply (0s delay)</span>
                      </div>
                      <p className="leading-relaxed">
                        Hello! 2 BHK luxury residences start at <strong>₹82 Lakhs</strong> (1150 sq.ft). 
                      </p>
                      <div className="p-2 bg-white rounded-xl border border-slate-200 text-[11px] flex items-center justify-between">
                        <span>📄 prestige-brochure.pdf</span>
                        <span className="text-indigo-600 font-bold">Auto-sent</span>
                      </div>
                      <p className="leading-relaxed">
                        We have site visit slots today at <strong>4:30 PM</strong> & <strong>6:00 PM</strong>. Would you like to reserve one?
                      </p>
                      <span className="text-[9px] text-slate-400 block text-right">10:42 AM</span>
                    </div>
                  </div>

                  {/* Highlighting Need Attention alert */}
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <Bell className="w-3.5 h-3.5 text-amber-600" />
                      <span>Owner Alert: Customer asked for custom payment plan</span>
                    </div>
                    <p className="text-[10px] text-amber-700">
                      Vexqira automatically logged the lead and notified Vikram Mehta to call back.
                    </p>
                  </div>
                </div>

                {/* Footer trigger */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Want this for your business?</span>
                  <button
                    onClick={() => setShowTalkModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
                  >
                    Setup in 5 Mins →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: HOW VEXQIRA WORKS */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            {/* BUTTON-STYLED SECTION BADGE */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>How It Works</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Simple 4-Step Automated Flow
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              Vexqira keeps your WhatsApp active around the clock so you never lose a hot prospect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative flex flex-col justify-between hover:border-indigo-300 transition-all hover:shadow-md">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-base">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">Customer messages you</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A prospect reaches out on your official WhatsApp asking about prices, availability, or timings.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold text-cyan-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Incoming enquiry
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative flex flex-col justify-between hover:border-indigo-300 transition-all hover:shadow-md">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">Vexqira replies automatically</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instant, polite, brand-tailored answers sent within seconds — even during peak hours or late night.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> 24/7 Automated response
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative flex flex-col justify-between hover:border-indigo-300 transition-all hover:shadow-md">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">Customer gets help instantly</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Prospect receives brochures, rate lists, or answers immediately without dropping off to competitors.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold text-purple-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Zero response delay
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-5 relative flex flex-col justify-between hover:border-indigo-400 transition-all hover:shadow-md">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">You get notified to respond</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    When a serious customer needs personal attention or a quote, you get a clean alert to step in anytime.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-200 text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Human takeover ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: WHO IT IS FOR (BUSINESS TYPES) */}
      <section id="business-types" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            {/* BUTTON-STYLED SECTION BADGE */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>Who It's For</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Tailored for Busy Business Owners
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              Vexqira powers fast automated WhatsApp communication for every service industry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {businessTypes.map((b, i) => {
              const IconComp = b.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{b.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, businessType: b.title as any }));
                      setShowGetStartedModal(true);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-2 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Get {b.title} Setup</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION: INTERACTIVE LIVE DEMO SIMULATOR */}
      <section id="demo" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            {/* BUTTON-STYLED SECTION BADGE */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
              <Bot className="w-3.5 h-3.5 text-purple-600" />
              <span>Interactive Live Demo</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Test Vexqira's Instant Response
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Type a customer question below to see how Vexqira replies and alerts the business owner in real-time.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid md:grid-cols-12">
            {/* Simulator Left info */}
            <div className="md:col-span-5 bg-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Real-Time WhatsApp Automation</span>
                </div>
                <h4 className="text-xl font-black text-white">Experience it live</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Try asking questions like:
                </p>
                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => {
                      setSimQuery('What are 2 BHK apartment prices?');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                  >
                    💬 "What are 2 BHK apartment prices?"
                  </button>
                  <button
                    onClick={() => {
                      setSimQuery('Can I book a site visit today at 4 PM?');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                  >
                    💬 "Can I book a site visit today at 4 PM?"
                  </button>
                  <button
                    onClick={() => {
                      setSimQuery('Where is your office located?');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                  >
                    💬 "Where is your office located?"
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => setShowTalkModal(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Talk to Us for Custom Bot</span>
                </button>
              </div>
            </div>

            {/* Simulator Right Chat */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-slate-900">
              <div className="space-y-3 min-h-[260px] max-h-[340px] overflow-y-auto pr-1">
                {simMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed ${
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

                {isSimTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
                    <Bot className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Vexqira Bot is typing automated reply...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSimSend} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={simQuery}
                  onChange={e => setSimQuery(e.target.value)}
                  placeholder="Type a test customer enquiry..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <VexqiraLogo size="sm" showSubtitle />
            <div className="text-center md:text-right text-xs text-slate-500 space-y-1">
              <div>"You stay busy. Vexqira handles the first response."</div>
              <div>© {new Date().getFullYear()} Vexqira Automation. All rights reserved.</div>
              <div className="pt-2">
                <button
                  onClick={() => onOpenLogin('admin')}
                  className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 mx-auto md:ml-auto md:mr-0 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING STICKY "TALK TO US" BUTTON (BOTTOM-RIGHT CORNER) */}
      <button
        onClick={() => setShowTalkModal(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 text-white font-extrabold px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border-2 border-white/20 cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <MessageSquare className="w-4 h-4" />
        <span className="text-xs">Talk to Us</span>
      </button>

      {/* POPUP MODAL 1: TALK TO US */}
      {showTalkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowTalkModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Talk to Vexqira Team</h3>
                <p className="text-xs text-slate-500">Direct WhatsApp connection & instant support</p>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>WhatsApp Representative Online</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Instant</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Connect directly on WhatsApp to get a 1-on-1 demo or pricing quote.
              </p>
              <a
                href="https://wa.me/?text=Hi%20Vexqira%2C%20I%20want%20to%20automate%20my%20WhatsApp%20business%20enquiries"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Now</span>
              </a>
            </div>

            {/* Callback Request Form */}
            <form onSubmit={handleTalkSubmit} className="space-y-3 text-xs">
              <div className="font-bold text-slate-800 text-xs">Or Request a Quick Call Back:</div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Mehta"
                  value={talkName}
                  onChange={e => setTalkName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98201 54321"
                  value={talkPhone}
                  onChange={e => setTalkPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">I am interested in</label>
                <select
                  value={talkTopic}
                  onChange={e => setTalkTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="WhatsApp Automation Setup">WhatsApp Automation Setup</option>
                  <option value="Real Estate Enquiries Bot">Real Estate Enquiries Bot</option>
                  <option value="Salon & Spa Appointments">Salon & Spa Appointments</option>
                  <option value="Pricing & Plans">Pricing & Custom Packages</option>
                  <option value="General Inquiry">Other Inquiry</option>
                </select>
              </div>

              {talkSubmitted ? (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Request received! We will WhatsApp you in 5 minutes.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  Request Callback
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: GET STARTED */}
      {showGetStartedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowGetStartedModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Get Started with Vexqira</h3>
                <p className="text-xs text-slate-500">Automate your business WhatsApp in minutes</p>
              </div>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">You're All Set!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Our onboarding team has received your setup request for <strong>{formData.businessName}</strong> and will connect with your WhatsApp ({formData.whatsappNumber}) shortly.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setShowGetStartedModal(false);
                      onOpenDemoDashboard();
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs"
                  >
                    Explore Demo Client Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setShowGetStartedModal(false);
                      setSubmitted(false);
                    }}
                    className="w-full bg-slate-100 text-slate-700 text-xs font-bold py-2.5 rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Mehta"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prestige Realty"
                      value={formData.businessName}
                      onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98201 54321"
                      value={formData.whatsappNumber}
                      onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Industry / Category</label>
                    <select
                      value={formData.businessType}
                      onChange={e => setFormData({ ...formData, businessType: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="Real Estate">Real Estate</option>
                      <option value="Salons & Spas">Salons & Spas</option>
                      <option value="Clinics">Clinics & Doctors</option>
                      <option value="Restaurants">Restaurants & Cafes</option>
                      <option value="Coaching & Education">Coaching & Education</option>
                      <option value="Gyms">Gyms & Fitness</option>
                      <option value="Local Businesses">Local Businesses</option>
                      <option value="Service Businesses">Service Businesses</option>
                      <option value="Other">Other Business</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">What would you like to automate?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {automationOptions.map((opt) => {
                      const checked = formData.automationNeeds.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleCheckboxToggle(opt)}
                          className={`text-left px-3 py-1.5 rounded-xl text-xs border transition-all flex items-center justify-between ${
                            checked
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className="text-[10px]">{checked ? '✓' : ''}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Special Requirements (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Upload PDF price list, connect to CRM, etc."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 hover:opacity-95 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Processing...' : 'Submit & Start WhatsApp Automation'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
