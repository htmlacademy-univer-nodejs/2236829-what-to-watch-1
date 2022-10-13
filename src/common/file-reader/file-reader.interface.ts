export interface FileReaderInterface {
  readonly filename: string;
  read(): Promise<void>;
  on(eventName: 'line', listener: (line: string) => void): void;
  on(eventName: 'end', listener: (count: number) => void): void;
}
