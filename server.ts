// MAIN SERVER FILE

// DEPENDENCIES
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { createConnection } from 'typeorm';
import { JWT } from './src/interfaces';
import routes from './src/routes';
import jwt from 'jsonwebtoken';
import { config } from './src/constants';

dotenv.config();

createConnection()
  .then(() => {
    // APP
    const app = express();

    // MIDDLEWARE
    app.use(cors({ origin: '*' }));
    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

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


    // socket is on
    io.on('connection', (socket: Socket) => {
      // client connects/emits event
      // we get their jwt

      // gettind data back for event "send my ID"
      socket.on('sendMyId', (senderId) => {
        // const decodedJwt = jwt.verify(senderId, config.JWT_SECRET) as JWT;

        // const id = decodedJwt.user;

        console.log('SENDERID', senderId)
        // the clients array now has a k:V pair with the senderID and the socket id
        clients[senderId] = socket.id;

      });


      socket.on('outgoingMsg', (senderId, receiverId, msg) => {
        console.log(`${senderId} says ${msg} to ${receiverId}`);
        if (clients[receiverId]) {
          io.to(clients[receiverId]).emit('incomingMsg', senderId, msg);
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
