import 'reflect-metadata';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { Component } from '../types/component.type.js';
import { getMongoDbURI } from '../utils/db.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface)
    private logger: LoggerInterface,
    @inject(Component.ConfigInterface)
    private config: ConfigInterface,
    @inject(Component.DatabaseInterface)
    private databaseClient: DatabaseInterface
  ) {
    this.expressApp = express();
  }

  public async init() {
    this.logger.info('Инициализация приложения…');
    const port = this.config.get('PORT');
    this.logger.info(`Значение переменной $PORT: ${port}`);

    const uri = getMongoDbURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);

    this.expressApp.listen(port);
    this.logger.info(`Сервер запущен на http://localhost:${port}`);
  }
}
