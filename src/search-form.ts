import { renderBlock, renderToast } from './lib.js'
import { ISearchFormData, IPlace } from './interfaces.js'
import { apiSearch } from './api.js';
import { renderEmptyOrErrorSearchBlock, renderSearchResultsBlock } from './search-results.js';

let timeoutSearch: number = 0;

export function renderSearchFormBlock() {

  const date = new Date();
  const minDate = date.toLocaleDateString('en-CA');

  date.setDate(date.getDate() + 1);
  const checkInDate = date.toLocaleDateString('en-CA');

  date.setDate(date.getDate() + 2);
  const checkOutDate = date.toLocaleDateString('en-CA');

  const mDate = new Date();
  mDate.setMonth(mDate.getMonth() + 2);
  mDate.setDate(0);
  const maxDate = mDate.toLocaleDateString('en-CA');



  renderBlock(
    'search-form-block',
    `
    <form id="frmSearch">
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${checkInDate}" min="${minDate}" max="${maxDate}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${checkOutDate}" min="${minDate}" max="${maxDate}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button type="submit">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  );

  const frmSearch = document.getElementById('frmSearch');

  frmSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const inpCity = frmSearch.querySelector('#city') as HTMLInputElement;
    const inpCheckInDate = frmSearch.querySelector('#check-in-date') as HTMLInputElement;
    const inpCheckOutDate = frmSearch.querySelector('#check-out-date') as HTMLInputElement;
    const inpMaxPrice = frmSearch.querySelector('#max-price') as HTMLInputElement;

    const searchFormData: ISearchFormData = {
      city: inpCity.value,
      checkInDate: new Date(inpCheckInDate.value),
      checkOutDate: new Date(inpCheckOutDate.value),
      maxPrice: inpMaxPrice.value === '' ? null : + inpMaxPrice.value
    };

    search(searchFormData, searchCallback);
  });
}


interface ISearchCallBack {
  (data: Error | IPlace[] | null): void
}

const searchCallback: ISearchCallBack = (data) => {
  console.log('searchCallback', data);
}

export function search(data: ISearchFormData, searchCallback: ISearchCallBack) {
  console.log('function search searchFormData = ', data);

  apiSearch(data).then((result: IPlace[]) => {
    clearTimeoutSearch();

    console.log('apiSearch ok', result);
    if (result.length === 0)
      renderEmptyOrErrorSearchBlock('По Вашему запросу ничего не найдено');
    else {
      renderSearchResultsBlock(result);
      timeoutSearch = setTimeout(() => {
        // вывод сообщения
        renderToast(
          { text: 'Данные поиска устарели, необходимо их обновить!', type: 'error' },
          { name: 'Закрыть', handler: () => { console.log('Уведомление закрыто') } }
        );
        // делаем кнопки недоступными
        const searchResults = document.getElementById('search-results-block');
        const lstButtons = searchResults.querySelectorAll('button');
        lstButtons.forEach(item => item.setAttribute('disabled', 'true'))
      }, 300000)
    }
  }).catch(error => renderEmptyOrErrorSearchBlock('Ошибка выполнения запроса'))
}

export function clearTimeoutSearch(): void {
  if (timeoutSearch > 0) {
    clearTimeout(timeoutSearch);
    timeoutSearch = 0;
  }
}
/* lesson 02
export function search(data: ISearchFormData, searchCallback: ISearchCallBack) {
  console.log('function search searchFormData = ', data);

  setTimeout(() => {
    const a = Boolean(Math.random() < 0.5);
    if (a)
      searchCallback(Error('error'));
    else {
      const places: IPlace[] = [];
      searchCallback(places);
    }
  }, 1000);
}
*/
