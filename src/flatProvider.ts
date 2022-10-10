import { IPlace, ISearchFormData } from './interfaces.js';
import { Provider } from './types.js';

export abstract class FlatProvider {

    constructor(public name: Provider) {
        this.name = name;
    }


    public abstract search(data: ISearchFormData): Promise<IPlace[]>;
    //public abstract book()

    public abstract book(placeId: number | string, checkInDate: Date, checkOutDate: Date): Promise<number | Error>;
}

