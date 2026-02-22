import { inject, singleton } from "tsyringe";
import AxiosHttpClient, {
  type HttpRequestConfig,
} from "../../http/AxiosHttpClient";

@singleton()
export default class HttpRepository {
  constructor(
    @inject(AxiosHttpClient)
    private readonly httpClient: AxiosHttpClient
  ) {}

  // interface용 GET 메서드
  public get<T>(config: HttpRequestConfig): Promise<T> {
    return this.httpClient
      .request({ ...config, method: "GET" })
      .then((response) => response as T);
  }

  // interface용 POST 메서드
  public post<T>(config: HttpRequestConfig): Promise<T> {
    return this.httpClient
      .request({ ...config, method: "POST" })
      .then((response) => response as T);
  }
}
