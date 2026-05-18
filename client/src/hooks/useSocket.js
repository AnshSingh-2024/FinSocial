import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store';

let sharedSocket = null;
let currentToken = null;

function ensureSocket(token) {
  if (!token) {
    if (sharedSocket) {
      sharedSocket.disconnect();
      sharedSocket = null;
      currentToken = null;
    }
    return null;
  }

  if (sharedSocket && currentToken === token) {
    return sharedSocket;
  }

  if (sharedSocket) {
    sharedSocket.disconnect();
  }

  sharedSocket = io('/', { auth: { token }, transports: ['websocket', 'polling'] });
  currentToken = token;
  return sharedSocket;
}

export function getSocket() {
  return sharedSocket;
}

export function disconnectSocket() {
  if (sharedSocket) {
    sharedSocket.disconnect();
    sharedSocket = null;
    currentToken = null;
  }
}

export function useSocket(eventHandlers = {}) {
  const token = useStore((s) => s.token);
  const handlersRef = useRef(eventHandlers);
  handlersRef.current = eventHandlers;

  useEffect(() => {
    const socket = ensureSocket(token);
    if (!socket) return;

    const entries = Object.entries(handlersRef.current);
    for (const [event, handler] of entries) {
      socket.on(event, handler);
    }

    return () => {
      for (const [event, handler] of entries) {
        socket.off(event, handler);
      }
    };
  }, [token]);

  return ensureSocket(token);
}
