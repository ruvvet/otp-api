// MAIN SERVER FILE

// DEPENDENCIES
import dotenv from 'dotenv';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes';
import { createConnection } from 'typeorm';
import { Server, Socket } from 'socket.io';
import http from 'http';

dotenv.config();

createConnection()
  .then(() => {
    // APP
    const app = express();

    // MIDDLEWARE
    app.use(cors({ origin: '*' }));
    app.use(express.urlencoded({ extended: false }));
    app.use('/', routes);

    // 400 errors handler
    app.use(function (req: Request, res: Response, next: NextFunction) {
      res.status(404);
    });

    //500 error handler
    app.use(function (
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      console.error(err);
      res.status(500);
    });

    const clients: { [k: string]: string } = {};
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: '*' } });

    io.on('connection', (socket: Socket) => {
      // client connects/emits event
      // we get their jwt

      console.log('socket online', new Date());
      socket.on('hello', (senderId) => {
        clients[senderId] = socket.id;
      });

      socket.on('incomingMsg', (senderId, receiverId, msg) => {
        console.log(`${senderId} says ${msg} to ${receiverId}`);
        if (clients[receiverId]) {
          io.to(clients[receiverId]).emit('outgoingMsg', senderId, msg);
        }
      });

      // socket.on('change', (e)=>{

      // }
    });

    // LISTEN
    server.listen(process.env.PORT || 5000, () => {
      console.log('SERVERBOTS ROLL OUT');
    });
  })
  .catch((err) => console.log(err));
