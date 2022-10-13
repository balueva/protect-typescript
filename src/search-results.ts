import { renderBlock } from './lib.js'
import { IPlace } from './interfaces.js';
import { getFavoritesData, setFavoritesData, updateUserFavoriteAmount } from './user.js';
import { FavoritePlace } from './types.js';
import { renderToast } from './lib.js';
import { clearTimeoutSearch } from './search-form.js';
import { AllProviders } from './allProviders.js';

export function renderSearchStubBlock() {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock(reasonMessage: string) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

export function renderSearchResultsBlock(places: IPlace[]) {

  function getListStr(places: IPlace[]): string {
    // формирование списка поиска с отобращением стилистики избранного
    let ul = '';
    places.forEach(place => ul += `
  <li class="result">
    <div class="result-container">
      <div class="result-img-container">
        <div class="favorites ${favorites && favorites.find(item => item.id === place.id) ? 'active' : ''}" data-id="${place.id}"></div>
        <img class="result-img" src="${place.image}" alt="${place.name}">
      </div>	
      <div class="result-info">
        <div class="result-info--header">
          <p>${place.name}</p>
          <p class="price">${place.price}&#8381;</p>
        </div>
        <div class="result-info--map ${place.remoteness === 0 ? 'map-hidden' : ''}"><i class="map-icon"></i>${place.remoteness}км от вас</div>
        <div class="result-info--descr">${place.description}</div>
        <div class="result-info--footer">
          <div>
            <button data-id="${place.id}">Забронировать</button>
          </div>
        </div>
      </div>
    </div>
  </li>
`);

    return ul;
  };


  // чтение избранного из локального хранилица
  const favorites = getFavoritesData();
  console.log('favorites', favorites)

  places.sort((a, b) => a.price - b.price); // сортировка по умолчанию

  const ul = getListStr(places);

  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select id="selectOptions">
                <option value="priceAsc" selected>Сначала дешёвые</option>
                <option value="priceDesc">Сначала дорогие</option>
                <option value="distanceAsc">Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list" id="results-list">
      ${ul}
    </ul>
    `
  );

  // привязка обработчиков событий

  // нажатие на иконку избранного
  const searchResults = document.getElementById('search-results-block');
  const lstFavorites = searchResults?.querySelectorAll('.favorites');
  lstFavorites?.forEach(item => item.addEventListener('click', event => {
    console.log('click', places);

    if (event.target instanceof Element) {
      const id = event.target.getAttribute('data-id');
      if (!id)
        return;

      const place = places.find(item => item.id == id);
      if (!place)
        return;

      const operation = toggleFavoriteItem({ id: place.id, name: place.name, image: place.image });
      if (operation)
        event.target.classList.remove('active');
      else
        event.target.classList.add('active');
      updateUserFavoriteAmount();
    }
  }));

  const selectOptions = document.getElementById('selectOptions');
  selectOptions?.addEventListener('change', (event) => {
    const el = event.target as HTMLInputElement;

    // новая сортировка
    switch (el.value) {
      case 'priceAsc': {
        places.sort((a, b) => a.price - b.price)
        break;
      }
      case 'priceDesc': {
        places.sort((a, b) => b.price - a.price)
        break
      };
      case 'distanceAsc': {
        places.sort((a, b) => a.remoteness - b.remoteness)
        break
      };
    }

    // подмена блока результаток поиска
    const ul = getListStr(places);
    renderBlock('results-list', ul);
  })


  const lstButtons = searchResults?.querySelectorAll('button');
  lstButtons?.forEach(item => item.addEventListener('click', event => {
    if (event.target instanceof Element) {
      console.log('button click');
      const id = event.target.getAttribute('data-id');
      if (!id)
        return;

      const inpCheckInDate = document.getElementById('check-in-date') as HTMLInputElement;
      const inpCheckOutDate = document.getElementById('check-out-date') as HTMLInputElement;

      clearTimeoutSearch();

      AllProviders.book(id, new Date(inpCheckInDate.value), new Date(inpCheckOutDate.value))
        .then(result => {
          console.log('book then');
          console.log(result);
          renderToast(
            { text: 'Бронирование успешно', type: 'success' },
            { name: 'Закрыть', handler: () => { console.log('Уведомление закрыто') } }
          )
        })
        .catch(error => {
          //console.log('apiBook catch');
          //console.log(error);
          renderToast(
            { text: error, type: 'error' },
            { name: 'Закрыть', handler: () => { console.log('Уведомление закрыто') } }
          )
        });


    }
  }));
}


function toggleFavoriteItem(place: FavoritePlace): boolean {
  console.log('toggleFavoriteItem', place);
  const favorites: FavoritePlace[] = getFavoritesData();

  const result: FavoritePlace[] = favorites ? favorites : [];
  console.log('result =', result);

  const idx = result.findIndex(item => item.id === place.id);
  console.log('idx = ', idx);
  if (idx >= 0)
    result.splice(idx, 1);
  else
    result.push(place);

  console.log('result = ', result);

  // запись в localStorage
  if (result.length > 0)
    setFavoritesData(result);
  else
    setFavoritesData(null);

  return Boolean(idx >= 0)
}
