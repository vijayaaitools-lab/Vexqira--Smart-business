import { ClientProfile, CustomerConversation, LeadSubmission, PlanConfig, AppNotification } from '../types';

export const INITIAL_PLANS: PlanConfig[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 29,
    description: 'Basic WhatsApp automation for single-location businesses.',
    messageLimit: 1000,
    customerLimit: 300,
    teamLimit: 1,
    features: ['Instant Auto-reply', 'Basic FAQ answering', 'Lead contact capture', 'Mobile notification alerts', 'Office hours schedule']
  },
  {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 59,
    popular: true,
    description: 'Automation + follow-ups + smart notification routing.',
    messageLimit: 5000,
    customerLimit: 1500,
    teamLimit: 3,
    features: ['Everything in Starter', 'Smart follow-up reminders', 'Human takeover toggle', 'Priority customer alerts', 'Custom FAQ training', 'Email & WhatsApp alerts']
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 119,
    description: 'Advanced multi-service automation & unlimited routing.',
    messageLimit: 20000,
    customerLimit: 10000,
    teamLimit: 10,
    features: ['Everything in Growth', 'Multi-department routing', 'Appointment automation', 'Dedicated account manager', 'Official WhatsApp Green badge support', 'Custom webhook integrations']
  }
];

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'client-1',
    businessName: 'Prestige Realty & Homes',
    ownerName: 'Vikram Mehta',
    email: 'vikram@prestigerealty.com',
    phone: '+91 98201 54321',
    businessType: 'Real Estate',
    planId: 'growth',
    status: 'Active',
    automationStatus: 'Active',
    whatsappConnected: true,
    whatsappNumber: '+91 98201 54321',
    joinedDate: '2026-03-15',
    expiryDate: '2026-09-15',
    monthlyMessagesUsed: 1420,
    monthlyMessagesLimit: 5000,
    botTone: 'friendly',
    botInstructions: 'You are the official 24/7 WhatsApp AI assistant for Prestige Realty & Homes. Your tone is polite, professional, and reassuring. Answer customer queries about 2 BHK and 3 BHK luxury residences, prices starting from ₹82 Lakhs, project amenities (Infinity Pool, Gym, Tennis Court), and location advantages. Always offer to book a free site visit. If a customer asks for customized payment discounts, bank loan tie-ups, or immediate personal consultation, politely collect their preferred contact time and flag the chat for Vikram Mehta.',
    fallbackBehavior: 'Apologize politely, record the customer request, and inform them that property manager Vikram Mehta will call back within 15 minutes.',
    apiConfig: {
      whatsappPhoneNumberId: '109482019482019',
      wabaAccountId: '294820194829103',
      accessToken: 'EAAG9z0QZBV...w81mP98102k',
      webhookVerifyToken: 'vexqira_sec_verify_998124',
      webhookCallbackUrl: 'https://api.vexqira.com/v1/webhook/client_98201',
      connectionStatus: 'Connected',
      lastVerifiedAt: 'Just now',
      aiProvider: 'vexqira_cloud'
    },
    knowledgeDocuments: [
      {
        id: 'doc-1',
        name: 'Prestige_Residences_RateCard_2026.pdf',
        type: 'pdf',
        size: '1.4 MB',
        uploadDate: '2026-08-15',
        status: 'Indexed',
        summary: 'Contains complete pricing matrix, carpet areas, floor rise charges, and milestone payment schedules for 2 & 3 BHK units.',
        parsedItemCount: 48
      },
      {
        id: 'doc-2',
        name: 'Available_Properties_Inventory_Q3.xlsx',
        type: 'excel',
        size: '450 KB',
        uploadDate: '2026-08-16',
        status: 'Indexed',
        summary: 'Live inventory table with tower numbers, floor units, facing directions, and current booking availability.',
        parsedItemCount: 112
      },
      {
        id: 'doc-3',
        name: 'Apartment_FloorPlan_MasterBrochure.png',
        type: 'image',
        size: '2.8 MB',
        uploadDate: '2026-08-17',
        status: 'Indexed',
        summary: 'Architectural blueprints, 3D cutouts of 2 BHK and 3 BHK layouts with balcony dimensions and master bedroom specs.',
        parsedItemCount: 16
      },
      {
        id: 'doc-4',
        name: 'Site_Visit_Guidelines_Directions.docx',
        type: 'word',
        size: '320 KB',
        uploadDate: '2026-08-18',
        status: 'Indexed',
        summary: 'Directions from Metro Station, landmark checkpoints, visiting hours, and on-site host contact numbers.',
        parsedItemCount: 22
      }
    ],
    knowledgeFaqs: [
      {
        id: 'faq-1',
        question: 'What is the starting price for 2 BHK and 3 BHK flats?',
        answer: '2 BHK residences start at ₹82 Lakhs (1150 sq.ft) and 3 BHK luxury residences start at ₹1.35 Crores (1650 sq.ft). All prices include 1 covered car parking space.',
        category: 'Pricing'
      },
      {
        id: 'faq-2',
        question: 'Is the project RERA approved and with which banks is it approved for loans?',
        answer: 'Yes, Prestige Realty is 100% RERA certified (RERA No: PRM/KA/RERA/1251/310/PR/190823/002812). Home loans are pre-approved by HDFC, SBI, ICICI, and Axis Bank with up to 80% funding.',
        category: 'Approvals'
      },
      {
        id: 'faq-3',
        question: 'What are the visiting hours for on-site sample flat tours?',
        answer: 'Sample flats are open for tours Monday through Sunday from 9:30 AM to 6:30 PM. We offer dedicated free parking and golf-cart site tours.',
        category: 'Site Visits'
      },
      {
        id: 'faq-4',
        question: 'When is the possession date?',
        answer: 'Phase 1 possession starts in December 2026. Phase 2 possession is scheduled for August 2027.',
        category: 'Possession'
      }
    ],
    catalogItems: [
      {
        id: 'cat-1',
        title: '2 BHK Luxury - Tower A (East Facing)',
        category: '2 BHK Apartment',
        price: '₹82.5 Lakhs',
        availability: 'Available',
        details: '1150 sq.ft | 4th & 8th Floor | 2 Balconies | Italian Marble Flooring'
      },
      {
        id: 'cat-2',
        title: '3 BHK Premium - Tower B (Corner Unit)',
        category: '3 BHK Apartment',
        price: '₹1.38 Crores',
        availability: 'Limited',
        details: '1650 sq.ft | High Floor | Panoramic Garden View | Modular Kitchen Included'
      },
      {
        id: 'cat-3',
        title: '4 BHK Sky Penthouse - Tower C',
        category: 'Penthouse',
        price: '₹2.45 Crores',
        availability: 'Available',
        details: '2400 sq.ft | Private Terrace Garden | Double Height Ceilings | 2 Car Parkings'
      }
    ],
    notificationPreferences: {
      newEnquiry: true,
      needsAttention: true,
      missedEnquiry: true,
      appointmentEnquiry: true,
      automationProblem: true,
      channels: { inApp: true, email: true, whatsapp: true }
    },
    services: [
      { id: 's1', name: 'WhatsApp Automation', status: 'Active', description: '24/7 intelligent instant replies' },
      { id: 's2', name: 'Customer Notifications', status: 'Active', description: 'Instant alerts on serious queries' },
      { id: 's3', name: 'Follow-ups', status: 'Active', description: 'Automated 2-hour & next-day follow-ups' },
      { id: 's4', name: 'Appointment Automation', status: 'Active', description: 'Schedule site visits automatically' }
    ],
    automations: [
      {
        id: 'a1',
        title: 'Automatic Replies',
        description: 'Sends instant friendly greeting and basic information when customer messages.',
        enabled: true,
        type: 'auto_reply',
        config: { greetingText: 'Hi! Thank you for reaching Prestige Realty. We have premium 2 & 3 BHK residences in prime locations. How can we assist you today?' }
      },
      {
        id: 'a2',
        title: 'Common Questions',
        description: 'Answers prices, locations, floor plans, and amenities instantly.',
        enabled: true,
        type: 'faq',
        config: { keywords: ['2 BHK', '3 BHK', 'price', 'location', 'brochure', 'possession'] }
      },
      {
        id: 'a3',
        title: 'Lead Information',
        description: 'Politely collects buyer budget, timeline, and preferred location.',
        enabled: true,
        type: 'lead_capture',
        config: { questions: ['Are you looking for 2 or 3 BHK?', 'What is your preferred moving timeline?'] }
      },
      {
        id: 'a4',
        title: 'Follow-up',
        description: 'Sends a gentle reminder if a buyer has not finalized a site visit.',
        enabled: true,
        type: 'followup',
        config: { followupHours: 2 }
      },
      {
        id: 'a5',
        title: 'Customer Notifications',
        description: 'Alerts Vikram immediately when customer asks for quotation or immediate callback.',
        enabled: true,
        type: 'notification',
        config: { notifyOnWords: ['urgent', 'call me', 'site visit today', 'discount', 'booking'] }
      }
    ]
  },
  {
    id: 'client-2',
    businessName: 'Luxe Hair & Spa Lounge',
    ownerName: 'Ananya Roy',
    email: 'ananya@luxespalounge.com',
    phone: '+91 97112 88440',
    businessType: 'Salons & Spas',
    planId: 'starter',
    status: 'Active',
    automationStatus: 'Active',
    whatsappConnected: true,
    whatsappNumber: '+91 97112 88440',
    joinedDate: '2026-04-10',
    expiryDate: '2026-10-10',
    monthlyMessagesUsed: 620,
    monthlyMessagesLimit: 1000,
    botTone: 'friendly',
    botInstructions: 'You are the booking assistant for Luxe Hair & Spa Lounge. Provide price details for haircuts, styling, keratin treatments, and aromatherapy massages. Encourage clients to book appointments during weekday discount hours.',
    fallbackBehavior: 'Tell the client our front desk stylist will confirm their booking slot within 10 minutes.',
    apiConfig: {
      whatsappPhoneNumberId: '108849204928100',
      wabaAccountId: '298849201948201',
      accessToken: 'EAAG9z0QZBV...w77xX',
      webhookVerifyToken: 'luxe_verify_tok_1122',
      webhookCallbackUrl: 'https://api.vexqira.com/v1/webhook/client_97112',
      connectionStatus: 'Connected',
      lastVerifiedAt: 'Yesterday',
      aiProvider: 'vexqira_cloud'
    },
    knowledgeDocuments: [
      {
        id: 'doc-salon-1',
        name: 'Luxe_Spa_RateCard_Menu_2026.pdf',
        type: 'pdf',
        size: '1.1 MB',
        uploadDate: '2026-08-10',
        status: 'Indexed',
        summary: 'Service menu covering haircuts, keratin, hair spa, bridal packages, and Swedish massage rates.',
        parsedItemCount: 36
      },
      {
        id: 'doc-salon-2',
        name: 'Stylist_Roster_Timings.xlsx',
        type: 'excel',
        size: '180 KB',
        uploadDate: '2026-08-12',
        status: 'Indexed',
        summary: 'Senior stylist work schedules, appointment slot availability, and off-peak discount hours.',
        parsedItemCount: 28
      }
    ],
    knowledgeFaqs: [
      {
        id: 'faq-s1',
        question: 'What are your haircut and styling charges?',
        answer: 'Women haircuts start at ₹850, Men haircuts at ₹450, and Senior Stylist creative makeovers at ₹1,400.',
        category: 'Services'
      },
      {
        id: 'faq-s2',
        question: 'Do I need advance appointment for spa sessions?',
        answer: 'Yes, we recommend booking at least 2 hours in advance to reserve private therapy suites.',
        category: 'Bookings'
      }
    ],
    catalogItems: [
      {
        id: 'cat-s1',
        title: 'Keratin Hair Smoothening Package',
        category: 'Hair Care',
        price: '₹3,999',
        availability: 'Available',
        details: 'Includes protein wash, deep keratin infusion, and complimentary serum kit.'
      },
      {
        id: 'cat-s2',
        title: 'Deep Tissue Aromatherapy Spa (60 Mins)',
        category: 'Spa & Wellness',
        price: '₹2,199',
        availability: 'Available',
        details: 'Full body relaxing massage with organic essential oils and steam sauna.'
      }
    ],
    notificationPreferences: {
      newEnquiry: true,
      needsAttention: true,
      missedEnquiry: false,
      appointmentEnquiry: true,
      automationProblem: true,
      channels: { inApp: true, email: false, whatsapp: true }
    },
    services: [
      { id: 's1', name: 'WhatsApp Automation', status: 'Active', description: 'Hair & Spa pricing and package details' },
      { id: 's2', name: 'Customer Notifications', status: 'Active', description: 'Alert when customer wants slot booking' },
      { id: 's3', name: 'Follow-ups', status: 'Paused', description: 'Gentle discount reminders' },
      { id: 's4', name: 'Appointment Automation', status: 'Active', description: 'Salon time slot booking' }
    ],
    automations: [
      {
        id: 'a1',
        title: 'Automatic Replies',
        description: 'Greets clients and offers menu of services.',
        enabled: true,
        type: 'auto_reply',
        config: { greetingText: 'Hello from Luxe Salon & Spa! ✨ Looking for a haircut, coloring, or relaxing spa therapy?' }
      }
    ]
  }
];

export const INITIAL_CONVERSATIONS: CustomerConversation[] = [
  {
    id: 'conv-1',
    clientId: 'client-1',
    customerName: 'Ravi Kumar',
    customerPhone: '+91 98450 12345',
    avatarColor: 'bg-blue-500',
    enquiryType: 'Property enquiry',
    lastMessage: 'Is 2 BHK available?',
    lastMessageTime: '10 min ago',
    unreadCount: 1,
    needsAttention: true,
    attentionReason: 'Customer asked for specific 2 BHK availability and price schedule',
    takeoverMode: 'vexqira',
    status: 'waiting_for_owner',
    notes: 'Looking for a flat in North Wing, ready to move by next quarter. Budget approx 85L.',
    createdAt: '2026-08-18T14:10:00Z',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: 'Hi, I saw your project brochure online. Do you have 2 BHK apartments available?',
        timestamp: '14:10',
        status: 'read'
      },
      {
        id: 'm2',
        sender: 'vexqira_auto',
        text: 'Hi Ravi! Thank you for contacting Prestige Realty. Yes, we have premium 2 BHK residences available (1150 sq.ft starting at ₹82.5 Lakhs). Would you prefer an east or west facing unit?',
        timestamp: '14:10',
        status: 'delivered'
      },
      {
        id: 'm3',
        sender: 'customer',
        text: 'East facing on higher floor please. What is the approximate starting price?',
        timestamp: '14:18',
        status: 'delivered'
      },
      {
        id: 'm4',
        sender: 'vexqira_auto',
        text: 'We have East-facing 2 BHK units on 4th and 8th floor in Tower A starting at ₹82.5 Lakhs. Property specialist Vikram Mehta has been notified to send you the exact installment schedule!',
        timestamp: '14:18',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'conv-2',
    clientId: 'client-1',
    customerName: 'Neha Sharma',
    customerPhone: '+91 99100 87654',
    avatarColor: 'bg-emerald-500',
    enquiryType: 'Price enquiry',
    lastMessage: 'Customer is waiting for your response',
    lastMessageTime: '25 min ago',
    unreadCount: 2,
    needsAttention: true,
    attentionReason: 'Customer is requesting customized installment payment schedule',
    takeoverMode: 'vexqira',
    status: 'waiting_for_owner',
    notes: 'Interested in 3 BHK penthouse. Serious buyer.',
    createdAt: '2026-08-18T13:45:00Z',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: 'Hello, what is the best price for the 3 BHK corner apartment?',
        timestamp: '13:45',
        status: 'read'
      },
      {
        id: 'm2',
        sender: 'vexqira_auto',
        text: 'Hello Neha! 3 BHK apartments range from 1450 to 1820 sq.ft (Starting at ₹1.35 Cr). May I know if you would like a virtual tour or an on-site visit this weekend?',
        timestamp: '13:45',
        status: 'delivered'
      },
      {
        id: 'm3',
        sender: 'customer',
        text: 'Can I pay in construction-linked milestones? Please give me the payment breakdown.',
        timestamp: '13:55',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'conv-3',
    clientId: 'client-1',
    customerName: 'Amit Patel',
    customerPhone: '+91 98200 45678',
    avatarColor: 'bg-purple-500',
    enquiryType: 'Site Visit Booking',
    lastMessage: 'Site visit booked for Saturday at 11 AM.',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    needsAttention: false,
    takeoverMode: 'vexqira',
    status: 'active',
    notes: 'Family visit scheduled for Saturday 11:00 AM.',
    createdAt: '2026-08-18T12:00:00Z',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: 'Can I visit the site this Saturday morning?',
        timestamp: '12:00',
        status: 'read'
      },
      {
        id: 'm2',
        sender: 'vexqira_auto',
        text: 'Certainly Amit! We have visiting slots at 10:30 AM and 11:00 AM this Saturday. Which one suits you best?',
        timestamp: '12:00',
        status: 'read'
      },
      {
        id: 'm3',
        sender: 'customer',
        text: '11:00 AM works great.',
        timestamp: '12:05',
        status: 'read'
      },
      {
        id: 'm4',
        sender: 'vexqira_auto',
        text: 'Done! Your site visit is confirmed for Saturday at 11:00 AM at Prestige Heights. Our manager will receive you at the main gate. Location: https://maps.google.com/?q=PrestigeHeights',
        timestamp: '12:05',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-4',
    clientId: 'client-1',
    customerName: 'Pooja Verma',
    customerPhone: '+91 97722 33110',
    avatarColor: 'bg-rose-500',
    enquiryType: 'Brochure Request',
    lastMessage: 'Brochure PDF sent successfully',
    lastMessageTime: '3 hours ago',
    unreadCount: 0,
    needsAttention: false,
    takeoverMode: 'vexqira',
    status: 'resolved',
    notes: 'Brochure shared. Sent automated follow up.',
    createdAt: '2026-08-18T09:30:00Z',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: 'Please send me the floor plan pdf.',
        timestamp: '09:30',
        status: 'read'
      },
      {
        id: 'm2',
        sender: 'vexqira_auto',
        text: 'Here is our detailed brochure and master layout: https://prestigerealty.com/brochure.pdf. Let us know if you have any questions!',
        timestamp: '09:30',
        status: 'read'
      }
    ]
  }
];

export const INITIAL_LEADS: LeadSubmission[] = [
  {
    id: 'lead-1',
    name: 'Suresh Rao',
    businessName: 'Apex Dental & Orthodontics',
    whatsappNumber: '+91 98860 11223',
    email: 'suresh@apexdental.in',
    businessType: 'Clinics',
    automationNeeds: ['Appointment enquiries', 'Customer enquiries', 'Missed enquiries'],
    message: 'We miss patient messages during surgeries. Need automated booking and emergency alerts.',
    submittedAt: '2026-08-18T10:15:00Z',
    status: 'New',
    notes: 'High intent. Clinic has 4 doctors and receives 40+ messages daily.'
  },
  {
    id: 'lead-2',
    name: 'Priya Sundaram',
    businessName: 'Gourmet Woodfire Kitchen',
    whatsappNumber: '+91 99401 55678',
    email: 'priya@gourmetkitchen.com',
    businessType: 'Restaurants',
    automationNeeds: ['Customer enquiries', 'Follow-ups'],
    message: 'Want to automatically send menu & table reservation confirmations on WhatsApp.',
    submittedAt: '2026-08-17T18:40:00Z',
    status: 'Contacted',
    notes: 'Spoke on phone, scheduled live demo for tomorrow.'
  },
  {
    id: 'lead-3',
    name: 'Rohan Deshmukh',
    businessName: 'Zenith Fitness Academy',
    whatsappNumber: '+91 98230 77890',
    email: 'rohan@zenithgym.com',
    businessType: 'Gyms',
    automationNeeds: ['Customer enquiries', 'Customer support', 'Follow-ups'],
    message: 'Need instant pricing replies for membership enquiries coming from Instagram ads.',
    submittedAt: '2026-08-16T14:20:00Z',
    status: 'Demo',
    notes: 'Demo completed. Interested in Growth plan.'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    clientId: 'client-1',
    type: 'needs_attention',
    title: 'Customer Needs Your Attention',
    description: 'Amit asked for a quotation. Automation could not complete the custom request.',
    customerName: 'Amit Patel',
    customerPhone: '+91 98200 45678',
    conversationId: 'conv-3',
    timeAgo: '10 mins ago',
    timestamp: '2026-08-18T14:10:00Z',
    read: false,
    actionLabel: 'Reply Now'
  },
  {
    id: 'notif-2',
    clientId: 'client-1',
    type: 'new_enquiry',
    title: 'New Customer Enquiry',
    description: 'Ravi Kumar contacted you regarding Property enquiry.',
    customerName: 'Ravi Kumar',
    customerPhone: '+91 98450 12345',
    conversationId: 'conv-1',
    timeAgo: '18 mins ago',
    timestamp: '2026-08-18T14:02:00Z',
    read: false,
    actionLabel: 'Open Conversation'
  },
  {
    id: 'notif-3',
    clientId: 'client-1',
    type: 'missed_call',
    title: 'Missed Customer Contact',
    description: 'Neha Sharma tried to contact you. Customer is waiting for your response.',
    customerName: 'Neha Sharma',
    customerPhone: '+91 99100 87654',
    conversationId: 'conv-2',
    timeAgo: '25 mins ago',
    timestamp: '2026-08-18T13:55:00Z',
    read: true,
    actionLabel: 'Reply'
  }
];
