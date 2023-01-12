import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_NAME: string;
  PROMO_MOVIE_ID: string;
  UPLOAD_DIRECTORY_PATH: string;
  JWT_SECRET: string;
  STATIC_DIRECTORY_PATH: string;
  HOST: string;
};

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Порт для входящих соединений',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  SALT: {
    doc: 'Соль для хэширования паролей',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'IP-адрес сервера базы данных MongoDB',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: 'Username to connect to the database (MongoDB)',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Database connection password (MongoDB)',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Port to connect to the database (MongoDB)',
    format: 'port',
    env: 'DB_PORT',
    default: 27017,
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: 'course-nodejs-restapi'
  },
  PROMO_MOVIE_ID: {
    doc: 'Id of promo movie',
    format: String,
    env: 'PROMO_MOVIE_ID',
    default: null
  },
  UPLOAD_DIRECTORY_PATH: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY_PATH',
    default: null
  },
  JWT_SECRET: {
    doc: 'Secret for sign JWT',
    format: String,
    env: 'JWT_SECRET',
    default: null
  },
  STATIC_DIRECTORY_PATH: {
    doc: 'Path to directory with static resources',
    format: String,
    env: 'STATIC_DIRECTORY_PATH',
    default: '/static'
  },
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: 'localhost'
  },
});
