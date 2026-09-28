import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from '../config/env.js';

let io: SocketIOServer | null = null;

export const SocketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  PENALTIES_UPDATED: 'PENALTIES_UPDATED',
  PENALTY_CREATED: 'PENALTY_CREATED',
  PENALTY_STATUS_CHANGED: 'PENALTY_STATUS_CHANGED',
  ATTENDANCE_SYNCED: 'ATTENDANCE_SYNCED',
  PROSECUTION_RUN_COMPLETED: 'PROSECUTION_RUN_COMPLETED',
  WHATSAPP_MESSAGE_RECEIVED: 'WHATSAPP_MESSAGE_RECEIVED',
} as const;

export function initSocketIO(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: [env.CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.io] Client disconnected (${socket.id}): ${reason}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet!');
  }
  return io;
}

export function broadcastEvent<T>(event: string, payload: T): void {
  if (io) {
    io.emit(event, payload);
  }
}
