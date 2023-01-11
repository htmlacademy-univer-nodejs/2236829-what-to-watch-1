import chalk from 'chalk';
import got from 'got';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';
import MovieGenerator from '../common/movie-generator/movie-generator.js';
import { MockData } from '../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const moviesCount = parseInt(count, 10);
    let initialData: MockData;

    try {
      initialData = await got.get(url).json();
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      console.log(chalk.red(`Не удалось получить данные с адреса «${url}» по причине: «${err.message}»`));
      return;
    }

    const movieGenerator = new MovieGenerator(initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < moviesCount; i++) {
      await tsvFileWriter.writeLine(movieGenerator.generate());
    }

    console.log(`Файл «${filepath}» успешно создан`);
  }
}
