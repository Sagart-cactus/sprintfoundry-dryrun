export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: string;

  public constructor(statusCode: number, code: string, message: string, details?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
