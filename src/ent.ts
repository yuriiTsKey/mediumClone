import { plainToClass } from 'class-transformer';
import { Entity } from 'typeorm';

@Entity()
export class  {

    toDto() {
         return plainToClass(Dto, this);
    }
    public static of(params: Partial<>):  {
        const  = new ();
        Object.assign(, params);
        return ;
    }
}