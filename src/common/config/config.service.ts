import { ConfigInterface } from './config.interface.js';
import { config } from 'dotenv';
import { LoggerInterface } from '../logger/logger.interface.js';
import { configSchema, ConfigSchema } from './config.schema.js';

export default class ConfigService implements ConfigInterface {
  private config: ConfigSchema;

  constructor(private logger: LoggerInterface) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Не удаётся прочитать файл .env. Возможно, файл не существует.');
    }

    configSchema.load({});
    configSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configSchema.getProperties();
    this.logger.info('Файл .env успешно прочитан.');
  }

  public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
