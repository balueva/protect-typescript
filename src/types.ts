import { IPlace } from './interfaces.js';

export type FavoritePlace = Pick<IPlace, 'id' | 'name' | 'image'>;