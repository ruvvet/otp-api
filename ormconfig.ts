import dotenv from 'dotenv';
import path from 'path';
import { ConnectionOptions } from 'typeorm';

dotenv.config();

let config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT!),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: process.env.IGNORE_SSL ? undefined : true,
  extra: process.env.IGNORE_SSL
    ? undefined
    : { ssl: { rejectUnauthorized: false } },
  synchronize: true,
  logging: false,
  entities: [
    path.join(__dirname, 'src/entity/**/*.ts'),
    path.join(__dirname, 'src/entity/**/*.js'),
  ],
  migrations: [
    path.join(__dirname, 'src/migration/**/*.ts'),
    path.join(__dirname, 'src/migration/**/*.js'),
  ],
  subscribers: [
    path.join(__dirname, 'src/subscriber/**/*.ts'),
    path.join(__dirname, 'src/subscriber/**/*.js'),
  ],
  cli: {
    entitiesDir: path.join(__dirname, 'src/entity'),
    migrationsDir: path.join(__dirname, 'src/migration'),
    subscribersDir: path.join(__dirname, 'src/subscriber'),
  },
};

export default config;
