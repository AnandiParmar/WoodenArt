// server.ts
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  const socketArray: Socket[] = [];

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);
    socketArray.push(socket);
     setTimeout(() => {
    console.log('Socket array length:', socketArray.length);
  }, 100);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      socketArray.splice(socketArray.indexOf(socket), 1);
    });
    // Handle custom events
    
    socket.on('orderStatusUpdated', (data: any) => {
    //   console.log('Order status updated:', data);
      io.emit('orderStatusUpdated', data); // Broadcast to all clients
    });
    
    // Handle new order placement - broadcast to all clients (especially admin)
    socket.on('orderPlaced', (data: any) => {
      console.log('New order placed:', data.orderNumber);
      io.emit('orderPlaced', data); // Broadcast to all clients (admin will receive it)
    });
  });



  server.listen(3000, (err?: Error) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});