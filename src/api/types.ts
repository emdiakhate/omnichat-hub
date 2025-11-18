// Chatwoot API Types - Generated from Swagger

// ==================== Base Types ====================

export type ConversationStatus = 'open' | 'resolved' | 'pending' | 'snoozed';
export type MessageType = 0 | 1 | 2; // 0: incoming, 1: outgoing, 2: activity
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type ContentType = 'text' | 'input_select' | 'cards' | 'form' | 'input_email' | 'article' | 'input_csat';
export type AvailabilityStatus = 'online' | 'offline' | 'busy' | 'available';
export type AgentRole = 'agent' | 'administrator';
export type ChannelType = 'Channel::WebWidget' | 'Channel::Api' | 'Channel::Email' | 'Channel::FacebookPage' | 'Channel::Whatsapp' | 'Channel::Sms' | 'Channel::Telegram' | 'Channel::Line' | 'Channel::TwitterProfile';

// ==================== Contact Types ====================

export interface Contact {
  id: number;
  name: string;
  email?: string;
  phoneNumber?: string;
  identifier?: string;
  thumbnail?: string;
  blocked?: boolean;
  availabilityStatus?: AvailabilityStatus;
  additionalAttributes?: Record<string, unknown>;
  customAttributes?: Record<string, unknown>;
  lastActivityAt?: number;
  createdAt?: number;
  contactInboxes?: ContactInbox[];
}

export interface ContactInbox {
  sourceId: string;
  inbox: InboxBasic;
}

export interface InboxBasic {
  id: number;
  avatarUrl?: string;
  channelId: number;
  name: string;
  channelType: string;
  provider?: string;
}

export interface ContactsListResponse {
  meta: {
    count: number;
    currentPage: string;
  };
  payload: Contact[];
}

export interface ContactShowResponse {
  payload: Contact;
}

// ==================== Conversation Types ====================

export interface Conversation {
  id: number;
  accountId: number;
  uuid?: string;
  inboxId: number;
  status: ConversationStatus;
  muted?: boolean;
  snoozedUntil?: number;
  canReply?: boolean;
  timestamp?: string;
  createdAt?: number;
  updatedAt?: number;
  firstReplyCreatedAt?: number;
  unreadCount: number;
  lastActivityAt?: number;
  waitingSince?: number;
  priority?: string;
  slaPolicyId?: number;
  appliedSla?: Record<string, unknown>;
  slaEvents?: Record<string, unknown>[];
  agentLastSeenAt?: number;
  assigneeLastSeenAt?: number;
  contactLastSeenAt?: number;
  additionalAttributes?: Record<string, unknown>;
  customAttributes?: Record<string, unknown>;
  labels?: string[];
  messages?: Message[];
  lastNonActivityMessage?: Message;
  meta?: ConversationMeta;
}

export interface ConversationMeta {
  sender?: ContactSender;
  channel?: string;
  assignee?: Agent;
  team?: Team;
  hmacVerified?: boolean;
}

export interface ContactSender {
  id: number;
  name: string;
  email?: string;
  phoneNumber?: string;
  identifier?: string;
  thumbnail?: string;
  blocked?: boolean;
  availabilityStatus?: AvailabilityStatus;
  additionalAttributes?: Record<string, unknown>;
  customAttributes?: Record<string, unknown>;
  lastActivityAt?: number;
  createdAt?: number;
}

export interface ConversationListResponse {
  data: {
    meta: {
      mineCount: number;
      unassignedCount: number;
      assignedCount: number;
      allCount: number;
    };
    payload: Conversation[];
  };
}

export interface ConversationMetaResponse {
  meta: {
    mineCount: number;
    unassignedCount: number;
    assignedCount: number;
    allCount: number;
  };
}

// ==================== Message Types ====================

export interface Message {
  id: number;
  content?: string;
  accountId?: number;
  inboxId?: number;
  conversationId: number;
  messageType: MessageType;
  createdAt: number;
  updatedAt?: number;
  private?: boolean;
  status?: MessageStatus;
  sourceId?: string;
  contentType?: ContentType;
  contentAttributes?: Record<string, unknown>;
  senderType?: 'contact' | 'agent' | 'agent_bot';
  senderId?: number;
  externalSourceIds?: Record<string, unknown>;
  additionalAttributes?: Record<string, unknown>;
  processedMessageContent?: string;
  sentiment?: Record<string, unknown>;
  conversation?: Record<string, unknown>;
  attachments?: Attachment[];
  sender?: MessageSender;
}

export interface MessageSender {
  id: number;
  name: string;
  availableName?: string;
  avatarUrl?: string;
  type?: string;
  availabilityStatus?: AvailabilityStatus;
  thumbnail?: string;
}

export interface Attachment {
  id: number;
  messageId: number;
  fileType: string;
  accountId: number;
  extension?: string;
  dataUrl: string;
  thumbUrl?: string;
  fileSize?: number;
}

export interface MessagesResponse {
  meta: {
    labels: string[];
    additionalAttributes: Record<string, unknown>;
    contact: Contact;
    assignee?: Agent;
    agentLastSeenAt?: string;
    assigneeLastSeenAt?: string;
  };
  payload: Message[];
}

// ==================== Agent Types ====================

export interface Agent {
  id: number;
  accountId?: number;
  email: string;
  name: string;
  availableName?: string;
  displayName?: string;
  role: AgentRole;
  thumbnail?: string;
  avatarUrl?: string;
  confirmed?: boolean;
  availabilityStatus?: AvailabilityStatus;
  autoOffline?: boolean;
  customRoleId?: number;
}

// ==================== Inbox Types ====================

export interface Inbox {
  id: number;
  name: string;
  channelType: string;
  avatarUrl?: string;
  channelId?: number;
  websiteUrl?: string;
  websiteToken?: string;
  widgetColor?: string;
  welcomeTitle?: string;
  welcomeTagline?: string;
  greetingEnabled?: boolean;
  greetingMessage?: string;
  enableAutoAssignment?: boolean;
  enableEmailCollect?: boolean;
  csatSurveyEnabled?: boolean;
  workingHoursEnabled?: boolean;
  outOfOfficeMessage?: string;
  timezone?: string;
  allowMessagesAfterResolved?: boolean;
  lockToSingleConversation?: boolean;
  senderNameType?: string;
  businessName?: string;
  hmacMandatory?: boolean;
  webWidgetScript?: string;
  phoneNumber?: string;
  medium?: string;
  provider?: string;
  autoAssignmentConfig?: Record<string, unknown>;
  workingHours?: WorkingHour[];
}

export interface WorkingHour {
  dayOfWeek: number;
  closedAllDay?: boolean;
  openHour?: number;
  openMinutes?: number;
  closeHour?: number;
  closeMinutes?: number;
  openAllDay?: boolean;
}

export interface InboxesResponse {
  payload: Inbox[];
}

// ==================== Team Types ====================

export interface Team {
  id: number;
  name: string;
  description?: string;
  allowAutoAssign?: boolean;
  accountId?: number;
  isMember?: boolean;
}

// ==================== Label Types ====================

export interface Label {
  id: number;
  title: string;
  description?: string;
  color: string;
  showOnSidebar?: boolean;
}

// ==================== User/Profile Types ====================

export interface User {
  id: number;
  accessToken?: string;
  accountId?: number;
  availableName?: string;
  avatarUrl?: string;
  confirmed?: boolean;
  displayName?: string;
  messageSignature?: string;
  email: string;
  hmacIdentifier?: string;
  inviterId?: number;
  name: string;
  provider?: string;
  pubsubToken?: string;
  role?: AgentRole;
  uiSettings?: Record<string, unknown>;
  uid?: string;
  type?: string;
  customAttributes?: Record<string, unknown>;
  accounts?: UserAccount[];
}

export interface UserAccount {
  id: number;
  name: string;
  status?: string;
  activeAt?: string;
  role: AgentRole;
  permissions?: string[];
  availability?: string;
  availabilityStatus?: AvailabilityStatus;
  autoOffline?: boolean;
  customRoleId?: number;
  customRole?: Record<string, unknown>;
}

// ==================== Payload Types for API Requests ====================

export interface ConversationFilters {
  assigneeType?: 'me' | 'unassigned' | 'all' | 'assigned';
  status?: ConversationStatus | 'all';
  q?: string;
  inboxId?: number;
  teamId?: number;
  labels?: string[];
  page?: number;
}

export interface ContactFilters {
  sort?: string;
  page?: number;
  q?: string;
}

export interface MessageCreatePayload {
  content: string;
  messageType?: 'outgoing' | 'incoming';
  private?: boolean;
  contentType?: ContentType;
  contentAttributes?: Record<string, unknown>;
  templateParams?: Record<string, unknown>;
}

export interface ConversationUpdatePayload {
  priority?: 'urgent' | 'high' | 'medium' | 'low' | 'none';
  slaPolicyId?: number;
}

export interface ConversationAssignPayload {
  assigneeId?: number;
  teamId?: number;
}

export interface ToggleStatusPayload {
  status: ConversationStatus;
  snoozedUntil?: number;
}

export interface LabelsPayload {
  labels: string[];
}

export interface ContactCreatePayload {
  inboxId: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  avatarUrl?: string;
  identifier?: string;
  additionalAttributes?: Record<string, unknown>;
  customAttributes?: Record<string, unknown>;
  blocked?: boolean;
}

export interface ContactUpdatePayload {
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  avatarUrl?: string;
  identifier?: string;
  additionalAttributes?: Record<string, unknown>;
  customAttributes?: Record<string, unknown>;
  blocked?: boolean;
}

// ==================== Response Types ====================

export interface ToggleStatusResponse {
  meta: Record<string, unknown>;
  payload: {
    success: boolean;
    currentStatus: ConversationStatus;
    conversationId: number;
  };
}

export interface ConversationLabelsResponse {
  payload: string[];
}

export interface ContactLabelsResponse {
  payload: string[];
}

export interface ContactConversationsResponse {
  payload: Conversation[];
}

// ==================== Reports Types ====================

export interface AccountSummary {
  avgFirstResponseTime: string;
  avgResolutionTime: string;
  conversationsCount: number;
  incomingMessagesCount: number;
  outgoingMessagesCount: number;
  resolutionsCount: number;
  previous?: {
    avgFirstResponseTime: string;
    avgResolutionTime: string;
    conversationsCount: number;
    incomingMessagesCount: number;
    outgoingMessagesCount: number;
    resolutionsCount: number;
  };
}

export interface ConversationMetrics {
  open: number;
  unattended: number;
  unassigned: number;
}
