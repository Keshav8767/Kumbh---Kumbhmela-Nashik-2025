import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

// Use Vite proxy — connect to the same origin, not a hardcoded URL
const SOCKET_URL = '';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPong, setLastPong] = useState(null);
  const [lastReply, setLastReply] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('test-pong', (data) => {
      console.log('Received test-pong:', data);
      setLastPong(data);
    });

    socketInstance.on('agent-reply', (data) => {
      console.log('Agent reply:', data);
      setLastReply(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendPing = useCallback(() => {
    if (socket) {
      console.log('Sending test-ping...');
      socket.emit('test-ping');
    }
  }, [socket]);

  const sendMessage = useCallback((text, userLocation = null, userLanguage = 'en') => {
    if (socket) {
      console.log('Sending user message:', text);
      socket.emit('user-message', { message: text, userLocation, userLanguage });
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    lastPong,
    lastReply,
    sendPing,
    sendMessage,
  };
};
