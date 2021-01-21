// MAIN SERVER FILE

// DEPENDENCIES
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { createConnection, getRepository } from 'typeorm';
import { JWT } from './src/interfaces';
import routes from './src/routes';
import jwt from 'jsonwebtoken';
import { config } from './src/constants';
import { Chat } from './src/entity/Chat';

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

        console.log('SENDERID', senderId);
        // the clients array now has a k:V pair with the senderID and the socket id
        clients[senderId] = socket.id;
      });

      socket.on('outgoingMsg', (senderId, receiverId, msg) => {
        // save 'incoming' msg to the database
        // here the sender ID = sender
        //receiver ID = client/receiver

        saveMsg(senderId, receiverId, msg);

        console.log(`${senderId} says ${msg} to ${receiverId}`);
        if (clients[receiverId]) {
          // save
          // saveMsg(senderId, receiverId, msg);
          io.to(clients[receiverId]).emit('incomingMsg', senderId, msg);
        }
      });

      socket.on('disconnect', () => {
        // get all keys
        // find  the first element/key where the key is in the dict and  === the socket id
        // then delete the k:v pair
        const socketKey = Object.keys(clients).find(
          (key) => clients[key] === socket.id
        );

        if (socketKey) {
          console.log(
            `Client ${socketKey} disconnecting socket # ${socket.id}`
          );
          delete clients[socketKey];
        } else {
          console.log(`cant disconnect the client for socket ${socket.id}`);
        }
      });
    });

    // LISTEN
    server.listen(process.env.PORT || 5000, () => {
      console.log('SERVERBOTS ROLL OUT');
    });
  })
  .catch((err) => console.log(err));

async function saveMsg(senderId: string, receiverId: string, msg: string) {
  const nowUTC = new Date().toUTCString();
  const now = new Date(nowUTC);

  const chatRepo = getRepository(Chat);

  const newChat = new Chat();
  newChat.receiver = receiverId;
  newChat.sender = senderId;
  newChat.date = now;
  newChat.msg = msg;
  await chatRepo.save(newChat);
}
