export default class HttpError extends Error {
  constructor(
    public httpStatusCode: number,
    message: string,
    public detail?: string
  ) {
    super(message);
    this.message = message;
  }
}
