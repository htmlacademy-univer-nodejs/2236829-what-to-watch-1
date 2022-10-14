import { ConfigInterface } from './config.interface.js';
import { config, DotenvParseOutput } from 'dotenv';
import { LoggerInterface } from '../logger/logger.interface.js';

export default class ConfigService implements ConfigInterface {
  private config: DotenvParseOutput;

  constructor(private logger: LoggerInterface) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Невозможно прочитать файл .env. Возможно, файл не существует.');
    }
    
    this.config = parsedOutput.parsed!;
    this.logger.info('Файл .env успешно прочитан.');
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
