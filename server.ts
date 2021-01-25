// MAIN SERVER FILE

// DEPENDENCIES
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { ConnectionOptions, createConnection, getRepository } from 'typeorm';
import connectionOptions from './ormconfig';
import { Chat } from './src/entity/Chat';
import routes from './src/routes';

dotenv.config();

createConnection(connectionOptions as ConnectionOptions)
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
    // const onlineClients: any = {};
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

        socket.broadcast.emit('nowOnline', senderId);

        // onlineClients[senderId] = socket;
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
          socket.broadcast.emit('nowOffline', socketKey);
          console.log(
            `Client ${socketKey} disconnecting socket # ${socket.id}`
          );
          delete clients[socketKey];
        } else {
          console.log(`cant disconnect the client for socket ${socket.id}`);
        }
      });

     

      socket.on(
        'getOnline',
        (
          id,
          chats: {
            discordId: string;
            discordUsername: string;
            displayName: string;
            discordAvatar: string;
          }[]
        ) => {
          console.log('getting list of everyone online and reducing');

          // const onlineChats = chats.filter((chat) => clients[chat.discordId]).map((chat)=>chat.discordId);

          const onlineChats = chats.reduce<string[]>((result, chat) => {
            if (clients[chat.discordId]) {
              result.push(chat.discordId);
            }

            return result;
          }, []);

          io.to(clients[id]).emit('onlineChats', onlineChats);
        }
      );
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
  newChat.receiverId = receiverId;
  newChat.senderId = senderId;
  newChat.date = now;
  newChat.msg = msg;
  await chatRepo.save(newChat);
}
