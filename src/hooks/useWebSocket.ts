// React hooks for WebSocket integration
import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { websocketService, WebSocketMessage, WEBSOCKET_EVENTS } from '@/services/websocket';
import { useProfile } from '@/hooks/useInboxes';
import { conversationKeys } from '@/hooks/useConversations';
import { contactKeys } from '@/hooks/useContacts';
import { getAccountId } from '@/api/client';

// Hook to manage WebSocket connection
export function useWebSocketConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const queryClient = useQueryClient();

  // Get user profile for pubsub token
  const { data: profile } = useProfile();

  // Initialize and connect
  useEffect(() => {
    if (profile?.pubsubToken) {
      websocketService.initialize(
        profile.pubsubToken,
        getAccountId(),
        profile.id
      );
      websocketService.connect();
    }

    // Subscribe to connection events
    const unsubConnect = websocketService.onConnect(() => {
      setIsConnected(true);
      setConnectionState('connected');
    });

    const unsubDisconnect = websocketService.onDisconnect(() => {
      setIsConnected(false);
      setConnectionState('disconnected');
    });

    // Cleanup on unmount
    return () => {
      unsubConnect();
      unsubDisconnect();
    };
  }, [profile]);

  // Handle real-time events and invalidate queries
  useEffect(() => {
    // Conversation events
    const unsubConversationCreated = websocketService.on(
      WEBSOCKET_EVENTS.CONVERSATION_CREATED,
      () => {
        queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
        queryClient.invalidateQueries({ queryKey: conversationKeys.meta() });
      }
    );

    const unsubConversationStatusChanged = websocketService.on(
      WEBSOCKET_EVENTS.CONVERSATION_STATUS_CHANGED,
      () => {
        queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
        queryClient.invalidateQueries({ queryKey: conversationKeys.meta() });
      }
    );

    const unsubAssigneeChanged = websocketService.on(
      WEBSOCKET_EVENTS.ASSIGNEE_CHANGED,
      () => {
        queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      }
    );

    // Message events
    const unsubMessageCreated = websocketService.on(
      WEBSOCKET_EVENTS.MESSAGE_CREATED,
      (message) => {
        const conversationId = (message.data.message as Record<string, unknown>)?.conversation_id as number;
        if (conversationId) {
          queryClient.invalidateQueries({
            queryKey: conversationKeys.messages(conversationId)
          });
          queryClient.invalidateQueries({
            queryKey: conversationKeys.detail(conversationId)
          });
        }
        queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      }
    );

    // Contact events
    const unsubContactCreated = websocketService.on(
      WEBSOCKET_EVENTS.CONTACT_CREATED,
      () => {
        queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      }
    );

    const unsubContactUpdated = websocketService.on(
      WEBSOCKET_EVENTS.CONTACT_UPDATED,
      () => {
        queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      }
    );

    const unsubContactDeleted = websocketService.on(
      WEBSOCKET_EVENTS.CONTACT_DELETED,
      () => {
        queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      }
    );

    return () => {
      unsubConversationCreated();
      unsubConversationStatusChanged();
      unsubAssigneeChanged();
      unsubMessageCreated();
      unsubContactCreated();
      unsubContactUpdated();
      unsubContactDeleted();
    };
  }, [queryClient]);

  return {
    isConnected,
    connectionState,
    connect: useCallback(() => websocketService.connect(), []),
    disconnect: useCallback(() => websocketService.disconnect(), []),
  };
}

// Hook to subscribe to specific WebSocket events
export function useWebSocketEvent(
  event: string,
  handler: (message: WebSocketMessage) => void
) {
  useEffect(() => {
    const unsubscribe = websocketService.on(event, handler);
    return unsubscribe;
  }, [event, handler]);
}

// Hook to get typing indicator for a conversation
export function useTypingIndicator(conversationId: number) {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleTypingOn = (message: WebSocketMessage) => {
      const data = message.data as Record<string, unknown>;
      const msgConversationId = data.conversation?.id || data.conversation_id;

      if (msgConversationId === conversationId) {
        setIsTyping(true);
        setTypingUser((data.user as Record<string, unknown>)?.name as string || null);

        // Clear typing indicator after 5 seconds
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsTyping(false);
          setTypingUser(null);
        }, 5000);
      }
    };

    const handleTypingOff = (message: WebSocketMessage) => {
      const data = message.data as Record<string, unknown>;
      const msgConversationId = data.conversation?.id || data.conversation_id;

      if (msgConversationId === conversationId) {
        setIsTyping(false);
        setTypingUser(null);
        clearTimeout(timeout);
      }
    };

    const unsubTypingOn = websocketService.on(
      WEBSOCKET_EVENTS.CONVERSATION_TYPING_ON,
      handleTypingOn
    );

    const unsubTypingOff = websocketService.on(
      WEBSOCKET_EVENTS.CONVERSATION_TYPING_OFF,
      handleTypingOff
    );

    return () => {
      unsubTypingOn();
      unsubTypingOff();
      clearTimeout(timeout);
    };
  }, [conversationId]);

  return { isTyping, typingUser };
}

// Hook to subscribe to notifications
export function useNotifications(handler: (notification: unknown) => void) {
  useEffect(() => {
    const unsubscribe = websocketService.on(
      WEBSOCKET_EVENTS.NOTIFICATION_CREATED,
      (message) => {
        handler(message.data.notification);
      }
    );
    return unsubscribe;
  }, [handler]);
}
