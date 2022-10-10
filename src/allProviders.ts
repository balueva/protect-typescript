import { HomyFlatProvider } from './homyFlatProvider.js';
import { FlatRentSdkProvider } from './flatRentSdkProvider.js';
import { Provider } from './types.js';
import { FlatProvider } from './flatProvider.js';
import { ISearchFormData, IPlace } from './interfaces.js';

export class AllProviders {

    public static search(providers: Provider[], data: ISearchFormData): Promise<IPlace[]> {
        const promises: Promise<IPlace[]>[] = [];
        const providerList: FlatProvider[] = [];
        providers.forEach(item => {
            switch (item) {
                case 'Homy': {
                    providerList.push(new HomyFlatProvider(item));
                    break;
                };
                case 'FlatRent': {
                    providerList.push(new FlatRentSdkProvider(item));
                    break;
                }
            }
        });

        providerList.forEach(provider => promises.push(provider.search(data)));

        return Promise.all(promises).then(result => {
            let places: IPlace[] = [];
            result.forEach(item => places = [...places, ...item]);
            return places;
        });
    }

    public static book(placeId: string, checkInDate: Date, checkOutDate: Date): Promise<number | any | Error> {

        if (!isNaN(Number(placeId))) {
            const flatProvider: HomyFlatProvider = new HomyFlatProvider('Homy');
            return flatProvider.book(+placeId, checkInDate, checkOutDate);
        }
        else {
            const flatProvider: FlatRentSdkProvider = new FlatRentSdkProvider('FlatRent');
            return flatProvider.book(placeId, checkInDate, checkOutDate);
        }

    }
}