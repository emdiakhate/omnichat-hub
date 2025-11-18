export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Tag {
  id: string;
  label: string;
  color: string;
  isAutomatic?: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: 'agent' | 'contact';
  timestamp: Date;
  status: 'sending' | 'sent' | 'read';
  attachments?: { name: string; url: string; type: string }[];
}

export interface Conversation {
  id: string;
  contact: Contact;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  tags: Tag[];
  channel: 'facebook' | 'email' | 'whatsapp' | 'instagram' | 'twitter';
  status: 'open' | 'pending' | 'resolved';
  assignedTeam?: string;
  assignedAgent?: string;
  messages: Message[];
}

export interface Team {
  id: string;
  name: string;
  members: number;
  activeConversations: number;
  resolvedToday: number;
  avgResponseTime: number;
}

export interface Stat {
  title: string;
  value: number | string;
  trend?: { value: number; direction: 'up' | 'down' };
  color: string;
}

// Mock contacts
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    phone: '+33 6 12 34 56 78',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    email: 'thomas.dubois@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    phone: '+33 6 98 76 54 32',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '3',
    name: 'Marie Lambert',
    email: 'marie.lambert@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Lucas Bernard',
    email: 'lucas.bernard@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '5',
    name: 'Emma Petit',
    email: 'emma.petit@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    isOnline: true,
  },
];

// Mock tags
export const mockTags: Tag[] = [
  { id: '1', label: 'Urgent', color: '#EF4444', isAutomatic: false },
  { id: '2', label: 'Support', color: '#3B82F6', isAutomatic: true },
  { id: '3', label: 'Vente', color: '#10B981', isAutomatic: false },
  { id: '4', label: 'Bug', color: '#F59E0B', isAutomatic: true },
  { id: '5', label: 'Feedback', color: '#8B5CF6', isAutomatic: false },
];

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: '1',
    contact: mockContacts[0],
    lastMessage: 'Merci pour votre aide ! Le problème est résolu.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    tags: [mockTags[0], mockTags[1]],
    channel: 'whatsapp',
    status: 'open',
    assignedTeam: 'Support',
    assignedAgent: 'Jean Dupont',
    messages: [
      {
        id: 'm1',
        content: 'Bonjour, j\'ai un problème avec mon compte.',
        sender: 'contact',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'read',
      },
      {
        id: 'm2',
        content: 'Bonjour Sophie ! Je vais vous aider. Pouvez-vous me donner plus de détails ?',
        sender: 'agent',
        timestamp: new Date(Date.now() - 1000 * 60 * 28),
        status: 'read',
      },
      {
        id: 'm3',
        content: 'Je ne peux plus accéder à mes paramètres depuis ce matin.',
        sender: 'contact',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        status: 'read',
      },
      {
        id: 'm4',
        content: 'D\'accord, je vois le problème. Je vais le corriger immédiatement.',
        sender: 'agent',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        status: 'read',
      },
      {
        id: 'm5',
        content: 'Merci pour votre aide ! Le problème est résolu.',
        sender: 'contact',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: 'read',
      },
    ],
  },
  {
    id: '2',
    contact: mockContacts[1],
    lastMessage: 'Je souhaite modifier mon abonnement.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 0,
    tags: [mockTags[2]],
    channel: 'facebook',
    status: 'pending',
    assignedTeam: 'Ventes',
    messages: [
      {
        id: 'm6',
        content: 'Bonjour, je souhaite modifier mon abonnement.',
        sender: 'contact',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        status: 'read',
      },
    ],
  },
  {
    id: '3',
    contact: mockContacts[2],
    lastMessage: 'Super produit, félicitations !',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    unreadCount: 1,
    tags: [mockTags[4]],
    channel: 'email',
    status: 'open',
    assignedTeam: 'Support',
    messages: [
      {
        id: 'm7',
        content: 'Super produit, félicitations !',
        sender: 'contact',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        status: 'read',
      },
    ],
  },
  {
    id: '4',
    contact: mockContacts[3],
    lastMessage: 'L\'application crash au démarrage.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    unreadCount: 0,
    tags: [mockTags[0], mockTags[3]],
    channel: 'instagram',
    status: 'open',
    assignedTeam: 'Support',
    messages: [
      {
        id: 'm8',
        content: 'L\'application crash au démarrage.',
        sender: 'contact',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        status: 'read',
      },
    ],
  },
  {
    id: '5',
    contact: mockContacts[4],
    lastMessage: 'Merci, tout fonctionne maintenant !',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    unreadCount: 0,
    tags: [mockTags[1]],
    channel: 'twitter',
    status: 'resolved',
    assignedTeam: 'Support',
    assignedAgent: 'Claire Martin',
    messages: [
      {
        id: 'm9',
        content: 'Merci, tout fonctionne maintenant !',
        sender: 'contact',
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        status: 'read',
      },
    ],
  },
];

// Mock teams
export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Support',
    members: 8,
    activeConversations: 24,
    resolvedToday: 15,
    avgResponseTime: 4.2,
  },
  {
    id: '2',
    name: 'Ventes',
    members: 5,
    activeConversations: 12,
    resolvedToday: 8,
    avgResponseTime: 6.5,
  },
  {
    id: '3',
    name: 'Technique',
    members: 6,
    activeConversations: 9,
    resolvedToday: 5,
    avgResponseTime: 8.1,
  },
];

// Mock stats
export const mockStats: Stat[] = [
  {
    title: 'Messages non lus',
    value: 127,
    trend: { value: 12, direction: 'up' },
    color: 'primary',
  },
  {
    title: 'Temps de réponse',
    value: '4.2 min',
    trend: { value: 8, direction: 'down' },
    color: 'success',
  },
  {
    title: 'Conversations actives',
    value: 45,
    trend: { value: 5, direction: 'up' },
    color: 'warning',
  },
  {
    title: 'Satisfaction',
    value: '94%',
    trend: { value: 3, direction: 'up' },
    color: 'secondary',
  },
];
