import { ISearchFormData, IPlace } from './interfaces.js';

const server = 'http://localhost:3030';

function dateToUnixStamp(date: Date): number {
    return date.getTime() / 1000
};


export function apiSearch(data: ISearchFormData) {
    let endPoint = `places?` +
        `checkInDate=${dateToUnixStamp(data.checkInDate)}&` +
        `checkOutDate=${dateToUnixStamp(data.checkOutDate)}&` +
        `coordinates=59.9386,30.3141`;

    if (data.maxPrice)
        endPoint += `&maxPrice=${data.maxPrice}`;

    return fetch(`${server}/${endPoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }
    ).then<IPlace[]>(result => result.json())
        .catch(error => {
            console.log(error);
        });
};

export function apiBook(placeId: number, checkInDate: Date, checkOutDate: Date) {
    const endPoint = `places/${placeId}?` +
        `checkInDate=${dateToUnixStamp(checkInDate)}&` +
        `checkOutDate=${dateToUnixStamp(checkOutDate)}&`;

    return fetch(`${server}/${endPoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(result => result.json())
        .then(result => {
            if ('message' in result)
                throw (result['message'])
            else
                return result;
        });

}
