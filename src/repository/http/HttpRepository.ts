import { inject, singleton } from "tsyringe";
import AxiosHttpClient, {
  type HttpRequestConfig,
} from "../../http/AxiosHttpClient";
import { type ClassConstructor, plainToInstance } from "class-transformer";

@singleton()
export default class HttpRepository {
  constructor(
    @inject(AxiosHttpClient)
    private readonly httpClient: AxiosHttpClient
  ) {}

  // clazz -> 반환 관련 클래스 생성자
  public get<T>(
    config: HttpRequestConfig,
    clazz: ClassConstructor<T>
  ): Promise<T> {
    return this.httpClient
      .request({ ...config, method: "GET" })
      .then((response) => plainToInstance(clazz, response));
  }
}
