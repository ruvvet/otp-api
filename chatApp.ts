// MAIN SERVER FILE

// DEPENDENCIES
import cors from 'cors';
import express, { Request, Response } from 'express';
import routes from './src/routes';
import { Server } from 'socket.io';
import http from 'http';

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

const server = http.createServer(app);
const io = new Server(server, {cors: {origin: 'http://localhost:3000'} });

const getApiAndEmit = (socket: any) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit('FromAPI', response);
};

let interval: any;

io.on('connection', (socket: any) => {
  console.log('New client connected');
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

// LISTEN
server.listen(7000, ()=>{console.log('server-up')});
