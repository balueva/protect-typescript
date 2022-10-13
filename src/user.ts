import { renderBlock } from './lib.js'
import { IUser } from './interfaces.js'
import { FavoritePlace } from './types.js';

function getFavoriteCaption(favoriteItemsAmount: number = 0): number | string {
  return favoriteItemsAmount > 0 ? favoriteItemsAmount : 'ничего нет';
};

export function renderUserBlock(userName: string, avatar: string, favoriteItemsAmount?: number): void {

  const favoritesCaption: number | string = getFavoriteCaption(favoriteItemsAmount);

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="/img/${avatar}" alt="${userName}" />
      <div class="info">
          <p class="name">${userName}</p>
          <p class="fav">
            <i class="heart-icon${Boolean(favoriteItemsAmount) ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}

export function updateUserFavoriteAmount(): void {
  const amount = getFavoritesAmount()
  const favoritesCaption: number | string = getFavoriteCaption(amount);

  const userBlock = document.getElementById('user-block');
  const fav = userBlock?.querySelector('.fav') as HTMLElement;

  fav.innerHTML = `<i class="heart-icon${Boolean(amount) ? ' active' : ''}"></i>${favoritesCaption}`
};

export function getUserData(): IUser | null {
  const lsItem: string | null = localStorage.getItem('user');

  if (lsItem)
    try {
      const user: unknown = JSON.parse(lsItem);
      if (user && typeof user === 'object' && 'userName' in user && 'avatarUrl' in user) {

        const key1 = 'userName' as keyof typeof user;
        const key2 = 'avatarUrl' as keyof typeof user;

        //return { userName: user['userName'], avatarUrl: user['avatarUrl'] };
        return { userName: user[key1], avatarUrl: user[key2] };
      }
    }
    catch {
    }
  return null;
}

export function getFavoritesAmount(): number {
  const amount: unknown = localStorage.getItem('favoritesAmount');
  if (amount && !isNaN(Number(amount)))
    return +amount;
  else
    return 0;
}

export function getFavoritesData(): FavoritePlace[] {
  const lsFavoriteItems: string | null = localStorage.getItem('favoriteItems');

  if (lsFavoriteItems)
    try {
      const favoriteItems: unknown = JSON.parse(lsFavoriteItems);
      if (Array.isArray(favoriteItems)) {
        const result: FavoritePlace[] = [];
        favoriteItems.forEach(item => {
          if (typeof item === 'object' && 'id' in item && 'name' in item && 'image' in item)
            result.push({ id: item['id'], name: item['name'], image: item['image'] });
        });
        return result;
      }
    }
    catch {
    }
  return [];
};

export function setFavoritesData(data: FavoritePlace[] | null): void {
  if (data) {
    localStorage.setItem('favoriteItems', JSON.stringify(data));
    localStorage.setItem('favoritesAmount', JSON.stringify(data.length));
  }
  else {
    localStorage.removeItem('favoriteItems');
    localStorage.removeItem('favoritesAmount');
  }
}

// для тестов
export function setLocalStorage(): void {
  localStorage.setItem('user', '{"userName":"Masha", "avatarUrl":"cat.png"}');
  localStorage.setItem('favoritesAmount', '5');
}
