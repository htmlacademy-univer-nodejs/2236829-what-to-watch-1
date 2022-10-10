export interface FileWriterInterface {
  readonly filename: string;
  writeLine(line: string): void;
}
