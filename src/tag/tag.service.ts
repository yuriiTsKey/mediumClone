import { Injectable } from "@nestjs/common";

@Injectable()
export class TagService {
    async findAllTag() : Promise<string[]> {
        return ['dragons', 'jetpack', 'sky'];
    }
}