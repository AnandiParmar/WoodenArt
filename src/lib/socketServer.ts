import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import { Server } from 'socket.io';

type NextServerWithSocket = HTTPServer & {
  io?: Server;
};

let io: Server | null = null;

export function getIO(): Server | null {
  return io;
}

export function initSocket(server: NextServerWithSocket) {
  if (server.io) {
    io = server.io;
    return io;
  }

  io = new Server(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  server.io = io;

  io.on('connection', (socket) => {
    socket.on('join', (room: string) => {
      socket.join(room);
    });
  });

  return io;
}



