// WebSocket Provider Component
import { createContext, useContext, ReactNode } from 'react';
import { useWebSocketConnection } from '@/hooks/useWebSocket';

interface WebSocketContextValue {
  isConnected: boolean;
  connectionState: string;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const websocket = useWebSocketConnection();

  return (
    <WebSocketContext.Provider value={websocket}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
