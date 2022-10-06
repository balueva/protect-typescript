import { Provider } from './enums.js';

export interface IUser {
    userName: string,
    avatarUrl: string
}

export interface ISearchFormData {
    city: string,
    checkInDate: Date,
    checkOutDate: Date,
    maxPrice: number | null
    providers: Provider[]
}

export interface IPlace {
    id: number | string,
    image: string,
    name: string,
    description: string,
    remoteness: number,
    bookedDates: number[],
    price: number
}

export interface IMessage {
    text: string,
    type: string
}

export interface IAction {
    name: string,
    handler: () => void
}