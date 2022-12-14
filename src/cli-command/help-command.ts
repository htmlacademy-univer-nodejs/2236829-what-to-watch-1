import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
      Программа для подготовки данных для REST API сервера.
      Пример:
        ${chalk.yellow('main.js --<command> [--arguments]')}
      Команды:
        ${chalk.yellow('--version:')}                                                     ${chalk.blue('# выводит номер версии')}
        ${chalk.yellow('--help:')}                                                        ${chalk.blue('# печатает этот текст')}
        ${chalk.yellow('--import <filename> <login> <password> <host> <dbname> <salt>:')} ${chalk.blue('# импортирует данные из TSV и добавляет в базу данных')}
        ${chalk.yellow('--generate <n> <path> <url>:')}                                   ${chalk.blue('# генерирует произвольное количество тестовых данных')}
      `);
  }
}
