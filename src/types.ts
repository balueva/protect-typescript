import { IPlace } from './interfaces.js';

export type FavoritePlace = Pick<IPlace, 'id' | 'name' | 'image'>;

export type Provider = 'Homy' | 'FlatRent' | string;

export type SearchOrder = 'priceAsc' | 'priceDesc' | 'distanceAsc';