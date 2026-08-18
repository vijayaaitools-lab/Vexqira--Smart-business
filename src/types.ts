export type UserRole = 'public' | 'client' | 'admin';

export type BusinessCategory = 
  | 'Real Estate'
  | 'Salons & Spas'
  | 'Clinics'
  | 'Restaurants'
  | 'Coaching & Education'
  | 'Gyms'
  | 'Local Businesses'
  | 'Service Businesses'
  | 'Other';

export type LeadStatus = 'New' | 'Contacted' | 'Demo' | 'Converted' | 'Not Interested';

export type ClientStatus = 'Active' | 'Paused' | 'Suspended' | 'Archived';
export type AutomationStatus = 'Active' | 'Paused';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'vexqira_auto' | 'human_agent';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface CustomerConversation {
  id: string;
  clientId: string;
  customerName: string;
  customerPhone: string;
  avatarColor?: string;
  enquiryType: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  needsAttention: boolean;
  attentionReason?: string;
  takeoverMode: 'vexqira' | 'manual';
  status: 'active' | 'waiting_for_owner' | 'resolved';
  notes?: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'auto_reply' | 'faq' | 'lead_capture' | 'followup' | 'notification';
  config: {
    greetingText?: string;
    delaySeconds?: number;
    keywords?: string[];
    responseTemplate?: string;
    questions?: string[];
    followupHours?: number;
    notifyOnWords?: string[];
  };
}

export interface ClientServiceControl {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Stopped';
  description: string;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'excel' | 'image' | 'text';
  size: string;
  uploadDate: string;
  status: 'Indexed' | 'Processing';
  summary?: string;
  parsedItemCount?: number;
}

export interface KnowledgeFaq {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  category: string;
  price: string;
  availability: 'Available' | 'Limited' | 'Sold Out' | 'Coming Soon';
  details: string;
}

export interface ApiConfiguration {
  whatsappPhoneNumberId: string;
  wabaAccountId: string;
  accessToken: string;
  webhookVerifyToken: string;
  webhookCallbackUrl: string;
  connectionStatus: 'Connected' | 'Pending' | 'Disconnected';
  lastVerifiedAt?: string;
  aiProvider: 'vexqira_cloud' | 'custom_gemini' | 'custom_openai';
  customAiApiKey?: string;
}

export interface ClientProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: BusinessCategory;
  planId: string;
  status: ClientStatus;
  automationStatus: AutomationStatus;
  whatsappConnected: boolean;
  whatsappNumber: string;
  joinedDate: string;
  expiryDate: string;
  monthlyMessagesUsed: number;
  monthlyMessagesLimit: number;
  botInstructions: string;
  botTone: 'friendly' | 'formal' | 'concise' | 'sales_focused';
  fallbackBehavior: string;
  notificationPreferences: {
    newEnquiry: boolean;
    needsAttention: boolean;
    missedEnquiry: boolean;
    appointmentEnquiry: boolean;
    automationProblem: boolean;
    channels: {
      inApp: boolean;
      email: boolean;
      whatsapp: boolean;
    };
  };
  apiConfig: ApiConfiguration;
  knowledgeDocuments: KnowledgeDocument[];
  knowledgeFaqs: KnowledgeFaq[];
  catalogItems: CatalogItem[];
  services: ClientServiceControl[];
  automations: AutomationRule[];
}

export interface LeadSubmission {
  id: string;
  name: string;
  businessName: string;
  whatsappNumber: string;
  email: string;
  businessType: BusinessCategory;
  automationNeeds: string[];
  message: string;
  submittedAt: string;
  status: LeadStatus;
  notes?: string;
}

export interface PlanConfig {
  id: string;
  name: string;
  priceMonthly: number;
  description: string;
  popular?: boolean;
  features: string[];
  messageLimit: number;
  customerLimit: number;
  teamLimit: number;
}

export interface AppNotification {
  id: string;
  clientId: string;
  type: 'new_enquiry' | 'needs_attention' | 'missed_call' | 'appointment' | 'system';
  title: string;
  description: string;
  customerName?: string;
  customerPhone?: string;
  conversationId?: string;
  timeAgo: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
}

export interface AdminStats {
  totalClients: number;
  activeClients: number;
  pausedClients: number;
  newLeads: number;
  activeAutomations: number;
  monthlyRevenue: number;
  expiringPlans: number;
}
