export interface ErrorResponse {
  message: string;
  statusCode: number;
  code?: string;
  validation?: { [key: string]: string };
}
