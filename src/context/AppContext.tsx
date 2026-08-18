import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  ClientProfile, 
  CustomerConversation, 
  LeadSubmission, 
  PlanConfig, 
  AppNotification,
  ChatMessage,
  KnowledgeDocument,
  KnowledgeFaq,
  CatalogItem,
  ApiConfiguration
} from '../types';
import { 
  INITIAL_CLIENTS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_LEADS, 
  INITIAL_PLANS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentClientId: string;
  setCurrentClientId: (id: string) => void;
  currentClient: ClientProfile | undefined;
  clients: ClientProfile[];
  conversations: CustomerConversation[];
  leads: LeadSubmission[];
  plans: PlanConfig[];
  notifications: AppNotification[];
  // Client actions
  toggleAutomation: (clientId: string) => void;
  toggleTakeover: (conversationId: string) => void;
  sendChatMessage: (conversationId: string, text: string, sender?: 'customer' | 'vexqira_auto' | 'human_agent') => void;
  updateCustomerNotes: (conversationId: string, notes: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateClientProfile: (clientId: string, updates: Partial<ClientProfile>) => void;
  updateAutomationRule: (clientId: string, ruleId: string, updates: any) => void;
  // API & Bot Configuration
  updateApiConfig: (clientId: string, config: Partial<ApiConfiguration>) => void;
  updateBotInstructions: (clientId: string, instructions: string, tone?: ClientProfile['botTone'], fallback?: string) => void;
  // Knowledge Base & Documents
  addKnowledgeDocument: (clientId: string, doc: Omit<KnowledgeDocument, 'id' | 'uploadDate' | 'status'>) => void;
  deleteKnowledgeDocument: (clientId: string, docId: string) => void;
  addFaq: (clientId: string, faq: Omit<KnowledgeFaq, 'id'>) => void;
  updateFaq: (clientId: string, faqId: string, updates: Partial<KnowledgeFaq>) => void;
  deleteFaq: (clientId: string, faqId: string) => void;
  addCatalogItem: (clientId: string, item: Omit<CatalogItem, 'id'>) => void;
  updateCatalogItem: (clientId: string, itemId: string, updates: Partial<CatalogItem>) => void;
  deleteCatalogItem: (clientId: string, itemId: string) => void;
  // Public actions
  submitLead: (lead: Omit<LeadSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  // Admin actions
  updateLeadStatus: (leadId: string, status: LeadSubmission['status'], notes?: string) => void;
  convertLeadToClient: (leadId: string) => void;
  updateClientStatus: (clientId: string, status: ClientProfile['status']) => void;
  updateClientService: (clientId: string, serviceId: string, status: 'Active' | 'Paused' | 'Stopped') => void;
  updatePlan: (planId: string, updates: Partial<PlanConfig>) => void;
  deleteClient: (clientId: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('vexqira_role') as UserRole) || 'public';
  });

  const [currentClientId, setCurrentClientId] = useState<string>(() => {
    return localStorage.getItem('vexqira_client_id') || 'client-1';
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem('vexqira_clients_v2');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [conversations, setConversations] = useState<CustomerConversation[]>(() => {
    const saved = localStorage.getItem('vexqira_conversations_v2');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [leads, setLeads] = useState<LeadSubmission[]>(() => {
    const saved = localStorage.getItem('vexqira_leads_v2');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [plans, setPlans] = useState<PlanConfig[]>(() => {
    const saved = localStorage.getItem('vexqira_plans_v2');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('vexqira_notifications_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('vexqira_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('vexqira_client_id', currentClientId);
  }, [currentClientId]);

  useEffect(() => {
    localStorage.setItem('vexqira_clients_v2', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('vexqira_conversations_v2', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('vexqira_leads_v2', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('vexqira_plans_v2', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('vexqira_notifications_v2', JSON.stringify(notifications));
  }, [notifications]);

  const currentClient = clients.find(c => c.id === currentClientId) || clients[0];

  const toggleAutomation = (clientId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const nextStatus = c.automationStatus === 'Active' ? 'Paused' : 'Active';
        return { ...c, automationStatus: nextStatus };
      }
      return c;
    }));
  };

  const toggleTakeover = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const nextMode = conv.takeoverMode === 'vexqira' ? 'manual' : 'vexqira';
        const nextStatus = nextMode === 'manual' ? 'waiting_for_owner' : 'active';
        return {
          ...conv,
          takeoverMode: nextMode,
          status: nextStatus,
          needsAttention: nextMode === 'manual' ? false : conv.needsAttention
        };
      }
      return conv;
    }));
  };

  const sendChatMessage = (
    conversationId: string, 
    text: string, 
    sender: 'customer' | 'vexqira_auto' | 'human_agent' = 'human_agent'
  ) => {
    const newMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, newMsg];
        const isHuman = sender === 'human_agent';
        return {
          ...conv,
          messages: updatedMessages,
          lastMessage: text,
          lastMessageTime: 'Just now',
          needsAttention: isHuman ? false : conv.needsAttention,
          unreadCount: sender === 'customer' ? conv.unreadCount + 1 : 0
        };
      }
      return conv;
    }));
  };

  const updateCustomerNotes = (conversationId: string, notes: string) => {
    setConversations(prev => prev.map(conv => conv.id === conversationId ? { ...conv, notes } : conv));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateClientProfile = (clientId: string, updates: Partial<ClientProfile>) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
  };

  const updateAutomationRule = (clientId: string, ruleId: string, updates: any) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          automations: c.automations.map(a => a.id === ruleId ? { ...a, ...updates } : a)
        };
      }
      return c;
    }));
  };

  // API Config Updates
  const updateApiConfig = (clientId: string, configUpdates: Partial<ApiConfiguration>) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          apiConfig: { ...c.apiConfig, ...configUpdates }
        };
      }
      return c;
    }));
  };

  // Bot Instructions Updates
  const updateBotInstructions = (
    clientId: string, 
    instructions: string, 
    tone?: ClientProfile['botTone'], 
    fallback?: string
  ) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          botInstructions: instructions,
          ...(tone ? { botTone: tone } : {}),
          ...(fallback ? { fallbackBehavior: fallback } : {})
        };
      }
      return c;
    }));
  };

  // Knowledge Documents Operations (PDF, Word, Excel, Images, Text)
  const addKnowledgeDocument = (
    clientId: string, 
    doc: Omit<KnowledgeDocument, 'id' | 'uploadDate' | 'status'>
  ) => {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Indexed',
      parsedItemCount: Math.floor(Math.random() * 30) + 10
    };

    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          knowledgeDocuments: [newDoc, ...(c.knowledgeDocuments || [])]
        };
      }
      return c;
    }));
  };

  const deleteKnowledgeDocument = (clientId: string, docId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          knowledgeDocuments: (c.knowledgeDocuments || []).filter(d => d.id !== docId)
        };
      }
      return c;
    }));
  };

  // FAQ Operations
  const addFaq = (clientId: string, faq: Omit<KnowledgeFaq, 'id'>) => {
    const newFaq: KnowledgeFaq = {
      ...faq,
      id: 'faq-' + Date.now()
    };
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          knowledgeFaqs: [...(c.knowledgeFaqs || []), newFaq]
        };
      }
      return c;
    }));
  };

  const updateFaq = (clientId: string, faqId: string, updates: Partial<KnowledgeFaq>) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          knowledgeFaqs: (c.knowledgeFaqs || []).map(f => f.id === faqId ? { ...f, ...updates } : f)
        };
      }
      return c;
    }));
  };

  const deleteFaq = (clientId: string, faqId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          knowledgeFaqs: (c.knowledgeFaqs || []).filter(f => f.id !== faqId)
        };
      }
      return c;
    }));
  };

  // Catalog / Properties / Price List Operations
  const addCatalogItem = (clientId: string, item: Omit<CatalogItem, 'id'>) => {
    const newItem: CatalogItem = {
      ...item,
      id: 'cat-' + Date.now()
    };
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          catalogItems: [...(c.catalogItems || []), newItem]
        };
      }
      return c;
    }));
  };

  const updateCatalogItem = (clientId: string, itemId: string, updates: Partial<CatalogItem>) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          catalogItems: (c.catalogItems || []).map(item => item.id === itemId ? { ...item, ...updates } : item)
        };
      }
      return c;
    }));
  };

  const deleteCatalogItem = (clientId: string, itemId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          catalogItems: (c.catalogItems || []).filter(item => item.id !== itemId)
        };
      }
      return c;
    }));
  };

  const submitLead = (leadData: Omit<LeadSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newLead: LeadSubmission = {
      ...leadData,
      id: 'lead-' + Date.now(),
      submittedAt: new Date().toISOString(),
      status: 'New'
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (leadId: string, status: LeadSubmission['status'], notes?: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status, notes: notes ?? l.notes } : l));
  };

  const convertLeadToClient = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const newClientId = 'client-' + Date.now();
    const newClient: ClientProfile = {
      ...INITIAL_CLIENTS[0],
      id: newClientId,
      businessName: lead.businessName,
      ownerName: lead.name,
      email: lead.email,
      phone: lead.whatsappNumber,
      businessType: lead.businessType,
      planId: 'starter',
      status: 'Active',
      automationStatus: 'Active',
      whatsappConnected: true,
      whatsappNumber: lead.whatsappNumber,
      joinedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyMessagesUsed: 0,
      monthlyMessagesLimit: 1000
    };

    setClients(prev => [...prev, newClient]);
    updateLeadStatus(leadId, 'Converted', 'Converted to Active Client');
  };

  const updateClientStatus = (clientId: string, status: ClientProfile['status']) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, status } : c));
  };

  const updateClientService = (clientId: string, serviceId: string, status: 'Active' | 'Paused' | 'Stopped') => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          services: c.services.map(s => s.id === serviceId ? { ...s, status } : s)
        };
      }
      return c;
    }));
  };

  const updatePlan = (planId: string, updates: Partial<PlanConfig>) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, ...updates } : p));
  };

  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const resetAllData = () => {
    localStorage.clear();
    setClients(INITIAL_CLIENTS);
    setConversations(INITIAL_CONVERSATIONS);
    setLeads(INITIAL_LEADS);
    setPlans(INITIAL_PLANS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUserRole('public');
    setCurrentClientId('client-1');
  };

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      currentClientId,
      setCurrentClientId,
      currentClient,
      clients,
      conversations,
      leads,
      plans,
      notifications,
      toggleAutomation,
      toggleTakeover,
      sendChatMessage,
      updateCustomerNotes,
      markNotificationRead,
      markAllNotificationsRead,
      updateClientProfile,
      updateAutomationRule,
      updateApiConfig,
      updateBotInstructions,
      addKnowledgeDocument,
      deleteKnowledgeDocument,
      addFaq,
      updateFaq,
      deleteFaq,
      addCatalogItem,
      updateCatalogItem,
      deleteCatalogItem,
      submitLead,
      updateLeadStatus,
      convertLeadToClient,
      updateClientStatus,
      updateClientService,
      updatePlan,
      deleteClient,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
