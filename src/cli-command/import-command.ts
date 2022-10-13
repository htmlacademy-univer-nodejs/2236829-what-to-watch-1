import chalk from 'chalk';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { createMovie } from '../utils/common.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      console.log(chalk.red(`Не удалось импортировать данные из файла «${filename}» по причине: «${err.message}»`));
    }
  }

  private onLine(line: string) {
    line = line.trim();
    if (line.length) {
      const movie = createMovie(line);
      console.log(movie);
    }
  }

  private onComplete(count: number) {
    console.log(`${count} строк импортировано.`);
  }
}
