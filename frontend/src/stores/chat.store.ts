import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'file' | 'system';
  timestamp: Date;
  isOwn: boolean;
}

export interface ChatRoom {
  id: string;
  participantName: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatState {
  socket: Socket | null;
  isConnected: boolean;
  activeRoomId: string | null;
  rooms: ChatRoom[];
  messages: Record<string, ChatMessage[]>;
  typingUsers: Record<string, string[]>;
  onlineUsers: Set<string>;
  connect: (token: string, userId: string, userName: string) => void;
  disconnect: () => void;
  joinRoom: (chatId: string) => void;
  sendMessage: (chatId: string, content: string, senderId: string, senderName: string) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
  setActiveRoom: (chatId: string) => void;
  addMockRoom: (room: ChatRoom) => void;
}

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
  : 'http://localhost:5000';

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  activeRoomId: null,
  rooms: [],
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),

  connect: (token: string, userId: string, userName: string) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
      timeout: 5000
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('connect_error', () => {
      // Server offline — degrade gracefully
      set({ isConnected: false });
    });

    socket.on('chat:new_message', (payload: ChatMessage) => {
      const { messages } = get();
      const roomMessages = messages[payload.chatId] ?? [];
      set({
        messages: {
          ...messages,
          [payload.chatId]: [...roomMessages, { ...payload, isOwn: payload.senderId === userId }]
        }
      });
    });

    socket.on('chat:user_typing', (payload: { chatId: string; userName: string; isTyping: boolean }) => {
      const { typingUsers } = get();
      const current = typingUsers[payload.chatId] ?? [];
      const updated = payload.isTyping
        ? [...new Set([...current, payload.userName])]
        : current.filter((n) => n !== payload.userName);
      set({ typingUsers: { ...typingUsers, [payload.chatId]: updated } });
    });

    socket.on('user:online', (uid: string) => {
      const { onlineUsers } = get();
      const next = new Set(onlineUsers);
      next.add(uid);
      set({ onlineUsers: next });
    });

    socket.on('user:offline', (uid: string) => {
      const { onlineUsers } = get();
      const next = new Set(onlineUsers);
      next.delete(uid);
      set({ onlineUsers: next });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    socket?.disconnect();
    set({ socket: null, isConnected: false });
  },

  joinRoom: (chatId: string) => {
    const { socket } = get();
    socket?.emit('chat:join', { chatId });
    set({ activeRoomId: chatId });
  },

  sendMessage: (chatId: string, content: string, senderId: string, senderName: string) => {
    const { socket, messages, isConnected } = get();
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId,
      senderName,
      content,
      type: 'text',
      timestamp: new Date(),
      isOwn: true
    };

    // Optimistically add to local state
    const roomMessages = messages[chatId] ?? [];
    set({
      messages: { ...messages, [chatId]: [...roomMessages, msg] }
    });

    if (isConnected) {
      socket?.emit('chat:message', msg);
    }
    // If offline, message is stored locally only (graceful degradation)
  },

  setTyping: (chatId: string, isTyping: boolean) => {
    const { socket } = get();
    socket?.emit('chat:typing', { chatId, isTyping });
  },

  setActiveRoom: (chatId: string) => {
    set({ activeRoomId: chatId });
  },

  addMockRoom: (room: ChatRoom) => {
    const { rooms } = get();
    const exists = rooms.find((r) => r.id === room.id);
    if (!exists) {
      set({ rooms: [...rooms, room] });
    }
  }
}));
