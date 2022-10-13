import { createWriteStream, WriteStream} from 'fs';
import { FileWriterInterface } from './file-writer.interface.js';

export default class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: 64 * 1024,
      autoClose: true,
    });
  }

  public async writeLine(line: string): Promise<void> {
    if (this.stream.write(`${line}\n`)) {
      return;
    }
    await new Promise<void>((resolve) => {
      this.stream.once('drain', () => resolve());
    });
  }
}
