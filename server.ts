// MAIN SERVER FILE

// DEPENDENCIES
import dotenv from 'dotenv';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes';
import { createConnection } from 'typeorm';


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

    app.use('/', routes);

    // LISTEN
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
