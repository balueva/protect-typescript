export interface IUser {
    userName: string,
    avatarUrl: string
}

export interface ISearchFormData {
    city: string,
    checkInDate: Date,
    checkOutDate: Date,
    maxPrice: number | null
}

export interface IPlace {
    id: number,
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