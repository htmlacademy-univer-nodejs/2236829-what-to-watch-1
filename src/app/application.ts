import 'reflect-metadata';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../types/component.type.js';

@injectable()
export default class Application {
  constructor(
    @inject(Component.LoggerInterface)
    private logger: LoggerInterface,
    @inject(Component.ConfigInterface)
    private config: ConfigInterface
  ) {}

  public async init() {
    this.logger.info('Инициализация приложения…');
    this.logger.info(`Значение переменной $PORT: ${this.config.get('PORT')}`);
  }
}
