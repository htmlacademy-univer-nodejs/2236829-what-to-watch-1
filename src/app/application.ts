import { LoggerInterface } from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';

export default class Application {
  constructor(
    private logger: LoggerInterface,
    private config: ConfigInterface
  ) {}

  public async init() {
    this.logger.info('Инициализация приложения…');
    this.logger.info(`Значение переменной $PORT: ${this.config.get('PORT')}`);
  }
}
