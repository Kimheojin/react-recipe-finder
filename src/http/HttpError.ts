import type ErrorResponse from "../entity/interface/ErrorResponse";

export default class HttpError {
  private readonly statusCode: number;
  private readonly message: string;
  private readonly code?: string;
  private readonly validation?: { [key: string]: string };

  constructor(errorResponse: ErrorResponse) {
    this.statusCode = errorResponse.statusCode;
    this.message = errorResponse.message;
    this.code = errorResponse.code;
    this.validation = errorResponse.validation || {};
  }

  public getMessage(): string {
    return this.message;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public getCode(): string | undefined {
    return this.code;
  }

  public getValidation(): { [key: string]: string } | undefined {
    return this.validation;
  }
}
