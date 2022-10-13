import { FlatProvider } from './flatProvider.js';
import { Provider } from './types.js';
import { ISearchFormData, IPlace } from './interfaces.js';


export class HomyFlatProvider extends FlatProvider {

    private server: string = 'http://localhost:3030';

    constructor(name: Provider) {
        super(name);
    }

    private dateToUnixStamp(date: Date): number {
        return date.getTime() / 1000
    };

    public search(data: ISearchFormData): Promise<IPlace[]> {
        let endPoint = `places?` +
            `checkInDate=${this.dateToUnixStamp(data.checkInDate)}&` +
            `checkOutDate=${this.dateToUnixStamp(data.checkOutDate)}&` +
            `coordinates=59.9386,30.3141`;

        if (data.maxPrice)
            endPoint += `&maxPrice=${data.maxPrice}`;

        return fetch(`${this.server}/${endPoint}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
        ).then(result => result.json());
    }

    public book(placeId: number, checkInDate: Date, checkOutDate: Date): Promise<number | Error> {
        const endPoint = `places/${placeId}?` +
            `checkInDate=${this.dateToUnixStamp(checkInDate)}&` +
            `checkOutDate=${this.dateToUnixStamp(checkOutDate)}&`;

        return fetch(`${this.server}/${endPoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(result => result.json())
            .then(result => {
                if ('message' in result)
                    throw (result['message'])
                else
                    return placeId;
            });
    }
}