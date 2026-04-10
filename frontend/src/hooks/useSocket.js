import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
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

  const [ambulanceAlert, setAmbulanceAlert] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => setIsConnected(true));
    socketInstance.on('disconnect', () => setIsConnected(false));
    socketInstance.on('agent-reply', (data) => setLastReply(data));
    socketInstance.on('ambulance-called', (data) => setAmbulanceAlert(data));


    setSocket(socketInstance);
    return () => socketInstance.disconnect();
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

  const sendMessage = useCallback((text, userLocation = null, userLanguage = 'en') => {
    if (socket) socket.emit('user-message', { message: text, userLocation, userLanguage });
  }, [socket]);

  return { socket, isConnected, lastReply, ambulanceAlert, sendMessage };

};
