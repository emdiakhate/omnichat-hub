// WebSocket Service for Chatwoot Real-time Updates
// Uses ActionCable protocol (Rails WebSocket)

import { getBaseUrl, getApiToken } from '@/api/client';

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = () => void;

export interface WebSocketMessage {
  event: string;
  data: {
    conversation?: unknown;
    message?: unknown;
    contact?: unknown;
    notification?: unknown;
    [key: string]: unknown;
  };
}

// Event types from Chatwoot
export const WEBSOCKET_EVENTS = {
  // Conversation events
  CONVERSATION_CREATED: 'conversation.created',
  CONVERSATION_STATUS_CHANGED: 'conversation.status_changed',
  CONVERSATION_READ: 'conversation.read',
  CONVERSATION_TYPING_ON: 'conversation.typing_on',
  CONVERSATION_TYPING_OFF: 'conversation.typing_off',
  CONVERSATION_CONTACT_CHANGED: 'conversation.contact_changed',
  ASSIGNEE_CHANGED: 'assignee.changed',
  TEAM_CHANGED: 'team.changed',
  CONVERSATION_MENTIONED: 'conversation.mentioned',

  // Message events
  MESSAGE_CREATED: 'message.created',
  MESSAGE_UPDATED: 'message.updated',

  // Contact events
  CONTACT_CREATED: 'contact.created',
  CONTACT_UPDATED: 'contact.updated',
  CONTACT_DELETED: 'contact.deleted',

  // Notification events
  NOTIFICATION_CREATED: 'notification.created',

  // Presence events
  PRESENCE_UPDATE: 'presence.update',
} as const;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private disconnectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private pubsubToken: string | null = null;
  private accountId: string | null = null;
  private userId: number | null = null;

  // Initialize with user info
  initialize(pubsubToken: string, accountId: string, userId: number) {
    this.pubsubToken = pubsubToken;
    this.accountId = accountId;
    this.userId = userId;
  }

  // Connect to WebSocket
  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    if (!this.pubsubToken || !this.accountId) {
      console.warn('WebSocket: Missing pubsubToken or accountId');
      return;
    }

    this.isConnecting = true;

    const baseUrl = getBaseUrl();
    // Convert HTTP to WS protocol
    const wsUrl = baseUrl.replace(/^http/, 'ws');
    const cableUrl = `${wsUrl}/cable?token=${this.pubsubToken}`;

    try {
      this.socket = new WebSocket(cableUrl);

      this.socket.onopen = () => {
        console.log('WebSocket: Connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Subscribe to account channel
        this.subscribe();

        // Notify handlers
        this.connectionHandlers.forEach(handler => handler());
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('WebSocket: Failed to parse message', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket: Disconnected', event.code, event.reason);
        this.isConnecting = false;
        this.socket = null;

        // Notify handlers
        this.disconnectionHandlers.forEach(handler => handler());

        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
          console.log(`WebSocket: Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
          setTimeout(() => this.connect(), delay);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket: Error', error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error('WebSocket: Failed to create connection', error);
      this.isConnecting = false;
    }
  }

  // Subscribe to ActionCable channel
  private subscribe(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    // Subscribe to the room channel
    const subscription = {
      command: 'subscribe',
      identifier: JSON.stringify({
        channel: 'RoomChannel',
        pubsub_token: this.pubsubToken,
        account_id: this.accountId,
        user_id: this.userId,
      }),
    };

    this.socket.send(JSON.stringify(subscription));
  }

  // Handle incoming messages
  private handleMessage(data: unknown): void {
    if (typeof data !== 'object' || data === null) return;

    const message = data as Record<string, unknown>;

    // ActionCable ping/welcome messages
    if (message.type === 'ping' || message.type === 'welcome' || message.type === 'confirm_subscription') {
      return;
    }

    // Extract the actual message from ActionCable format
    if (message.message && typeof message.message === 'object') {
      const payload = message.message as Record<string, unknown>;
      const event = payload.event as string;

      if (event) {
        const wsMessage: WebSocketMessage = {
          event,
          data: payload.data as WebSocketMessage['data'] || payload,
        };

        // Notify specific event handlers
        const handlers = this.messageHandlers.get(event);
        if (handlers) {
          handlers.forEach(handler => handler(wsMessage));
        }

        // Notify wildcard handlers
        const wildcardHandlers = this.messageHandlers.get('*');
        if (wildcardHandlers) {
          wildcardHandlers.forEach(handler => handler(wsMessage));
        }
      }
    }
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  // Subscribe to specific event
  on(event: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, new Set());
    }
    this.messageHandlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.messageHandlers.delete(event);
        }
      }
    };
  }

  // Subscribe to all events
  onAny(handler: MessageHandler): () => void {
    return this.on('*', handler);
  }

  // Subscribe to connection event
  onConnect(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  // Subscribe to disconnection event
  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectionHandlers.add(handler);
    return () => {
      this.disconnectionHandlers.delete(handler);
    };
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  // Get connection state
  getState(): string {
    if (!this.socket) return 'disconnected';
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'unknown';
    }
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
