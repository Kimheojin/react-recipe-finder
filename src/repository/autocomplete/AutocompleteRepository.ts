import { inject, singleton } from "tsyringe";
import HttpRepository from "../http/HttpRepository";

@singleton()
export default class AutocompleteRepository {
    constructor(
        @inject(HttpRepository)
        private readonly httpRepository: HttpRepository
    ) {}
}
