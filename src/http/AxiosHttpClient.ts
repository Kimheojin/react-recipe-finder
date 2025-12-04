import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { singleton } from "tsyringe";

import HttpError from "./HttpError";
import type ErrorResponse from "../entity/interface/ErrorResponse";

export type HttpRequestConfig = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  params?: any;
  body?: any;
  withAuth?: boolean;
};

@singleton()
export default class AxiosHttpClient {
  private readonly client: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    timeoutErrorMessage: "시간 초과 입니다",
    withCredentials: true,
  });

  constructor() {
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public async request<T = any>(config: HttpRequestConfig): Promise<T> {
    const requestConfig = {
      method: config.method,
      url: config.path,
      params: config.params,
      data: config.body,
      withCredentials: true,
    };

    return this.client
      .request<T>(requestConfig)
      .then((response: AxiosResponse<T>) => {
        return response.data;
      })
      .catch((e: AxiosError<ErrorResponse>) => {
        console.error(
          "AxiosHttpClient 오류 처리:",
          e.response?.status,
          e.response?.data
        );
        return Promise.reject(new HttpError(e.response?.data as ErrorResponse));
      });
  }
}
