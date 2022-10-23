import 'reflect-metadata';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../types/component.type.js';
import { getMongoDbURI } from '../utils/db.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';

@injectable()
export default class Application {
  constructor(
    @inject(Component.LoggerInterface)
    private logger: LoggerInterface,
    @inject(Component.ConfigInterface)
    private config: ConfigInterface,
    @inject(Component.DatabaseInterface)
    private databaseClient: DatabaseInterface
  ) {}

  public async init() {
    this.logger.info('Инициализация приложения…');
    this.logger.info(`Значение переменной $PORT: ${this.config.get('PORT')}`);

    const uri = getMongoDbURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);
  }
}
