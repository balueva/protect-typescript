import { renderBlock } from './lib.js'
import { IUser } from './interfaces'

export function renderUserBlock(userName: string, avatar: string, favoriteItemsAmount?: number): void {

  const favoritesCaption: number | string = Boolean(favoriteItemsAmount) ? favoriteItemsAmount : 'ничего нет'

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


export function getUserData(): IUser | null {
  const lsItem: string = localStorage.getItem('user');

  if (lsItem)
    try {
      const user: unknown = JSON.parse(lsItem);
      if (typeof user === 'object' && 'userName' in user && 'avatarUrl' in user)
        return { userName: user['userName'], avatarUrl: user['avatarUrl'] };
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

// для тестов
export function setLocalStorage(): void {
  localStorage.setItem('user', '{"userName":"Masha", "avatarUrl":"cat.png"}');
  localStorage.setItem('favoritesAmount', '5');
}
