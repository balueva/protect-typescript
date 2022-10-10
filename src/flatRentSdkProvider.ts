import { Provider } from './types.js';
import { IPlace, ISearchFormData } from './interfaces.js';
import { FlatProvider } from './flatProvider.js';
import { FlatRentSdk, IFlat } from './flat-rent-sdk.js'

export class FlatRentSdkProvider extends FlatProvider {

    private flatRentSdk = new FlatRentSdk();

    constructor(name: Provider) {
        super(name);
    }

    public search(data: ISearchFormData): Promise<IPlace[]> {
        return this.flatRentSdk.search({ city: data.city, checkInDate: data.checkInDate, checkOutDate: data.checkOutDate, priceLimit: data.maxPrice })
            .then(flat => {
                const result: IPlace[] = [];
                flat.forEach(item => result.push({
                    id: item.id, image: item.photos[0], name: item.title,
                    description: item.details, remoteness: 0, bookedDates: [], price: item.totalPrice
                }));
                return result;
            })
    }

    public book(placeId: string, checkInDate: Date, checkOutDate: Date): Promise<number | Error> {
        return this.flatRentSdk.book(placeId, checkInDate, checkOutDate);
    }

}