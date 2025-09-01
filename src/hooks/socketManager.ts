import {io, Socket} from 'socket.io-client';
import {API} from '../utils/apiConstant';

let socket: Socket | null = null;

/**
 * Connect socket as either user or company
 * @param id - userId or companyId
 * @param type - "user" | "company"
 */
export const connectSocket = (id: string, type: 'user' | 'company'): void => {
  if (socket !== null) {
    socket.disconnect();
    console.log('disconnect ---');
  }

  console.log('type', type, id);

  socket = io(API.SOCKET_URL, {
    path: '/Shiftly/socket.io',
    transports: ['websocket'],
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);

    if (type === 'user') {
      socket?.emit('user-connected', id);
    } else {
      socket?.emit('company-connected', id);
    }
  });

  socket.on('disconnect', () => {
    console.log('----------- socket disconnect -----------');
  });
};

/**
 * Listen for chat messages
 */
export const onChatMessage = (callback: (message: any) => void) => {
  if (!socket) {
    return;
  }
  socket.on('chat_message', callback);
};

/**
 * Send chat message
 */
export const sendChatMessage = (message: any) => {
  if (!socket) {
    return;
  }
  socket.emit('chat_message', message);
};

/**
 * Disconnect socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
