import EventEmitter from 'events';
import { createReadStream } from 'fs';
import { FileReaderInterface } from './file-reader.interface';

export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  constructor(public filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const stream = createReadStream(this.filename, {
      highWaterMark: 16 * 1024,
      encoding: 'utf-8',
    });

    let lineRead = '';
    let endLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of stream) {
      lineRead += chunk.toString();

      endLinePosition = lineRead.indexOf('\n');
      while (endLinePosition >= 0) {
        const completeRow = lineRead.slice(0, endLinePosition + 1);
        endLinePosition++;
        lineRead = lineRead.slice(endLinePosition);
        importedRowCount++;
        this.emit('line', completeRow);
        endLinePosition = lineRead.indexOf('\n');
      }
    }

    this.emit('line', lineRead);
    this.emit('end', importedRowCount + 1);
  }
}
