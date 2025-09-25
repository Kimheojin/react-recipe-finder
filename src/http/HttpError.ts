import type { AxiosError } from "axios";
import type { ErrorResponse } from "../entity/interface/ErrorResponse";

export default class HttpError {
  private readonly statusCode: number;
  private readonly message: string;
  private readonly code?: string;
  private readonly validation?: { [key: string]: string };

  constructor(e: AxiosError<ErrorResponse>) {
    const data = e.response?.data;
    const httpStatus = e.response?.status || 500;

    if (this.isSpringErrorResponse(data)) {
      this.statusCode = data.statusCode;
      this.message = data.message;
      this.code = data.code;
      this.validation = data.validation || {};
    } else {
      // Spring 응답이 아닌 경우 (네트워크 오류 등)
      this.statusCode = httpStatus;
      this.message = this.getDefaultMessage(httpStatus);
      this.validation = {};
    }
  }

  private isSpringErrorResponse(data: any): data is ErrorResponse {
    return (
      data &&
      typeof data === "object" &&
      typeof data.message === "string" &&
      typeof data.statusCode === "number"
    );
  }

  private getDefaultMessage(httpStatus: number): string {
    switch (httpStatus) {
      case 400:
        return "외부서버 : 잘못된 요청입니다";
      case 401:
        return "외부서버 : 인증이 필요합니다";
      case 403:
        return "외부서버 : 접근 권한이 없습니다";
      case 404:
        return "외부서버 : 요청한 리소스를 찾을 수 없습니다";
      case 500:
        return "외부서버 : 서버 내부 오류가 발생했습니다";
      case 502:
        return "외부서버 : 서버에 연결할 수 없습니다";
      case 503:
        return "외부서버 : 서비스를 사용할 수 없습니다";
      default:
        return "외부서버 ?: 네트워크 상태를 확인해주세요";
    }
  }
}
