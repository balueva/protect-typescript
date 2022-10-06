export interface IFlat {
    id: string,
    title: string,
    details: string,
    photos: string[],
    coordinates: number[],
    bookedDates: string[],
    totalPrice: number
}

export interface IParams {
    city: string,
    checkInDate: Date,
    checkOutDate: Date,
    priceLimit: number
}

export class FlatRentSdk {
    get(id: string): Promise<IFlat | null>;
    search(params: IParams): Promise<IFlat[]>;
    book(flatId: string, checkInDate: Date, checkOutDate: Date): Promise<number | Error>;
}