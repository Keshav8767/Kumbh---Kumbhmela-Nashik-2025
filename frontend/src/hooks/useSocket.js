import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

// Use Vite proxy — connect to the same origin, not a hardcoded URL
const SOCKET_URL = '';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPong, setLastPong] = useState(null);
  const [lastReply, setLastReply] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('test-pong', (data) => {
      setLastPong(data);
    });

    socketInstance.on('agent-thinking', (data) => {
      setActiveAgent(data);
    });

    socketInstance.on('agent-reply', (data) => {
      setActiveAgent(null);
      setLastReply(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendPing = useCallback(() => {
    if (socket) {
      socket.emit('test-ping');
    }
  }, [socket]);

  const sendMessage = useCallback((text, userLocation = null, userLanguage = 'en') => {
    if (socket) {
      socket.emit('user-message', { message: text, userLocation, userLanguage });
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    lastPong,
    lastReply,
    activeAgent,
    sendPing,
    sendMessage,
  };
};
