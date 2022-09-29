import { renderBlock } from './lib.js'
import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock, getFavoritesAmount, setLocalStorage, getUserData } from './user.js'
//import { renderToast } from './lib.js'

window.addEventListener('DOMContentLoaded', () => {
  //setLocalStorage()
  const user = getUserData()
  console.log('user = ', user)
  const amount = getFavoritesAmount()
  console.log('amount = ', amount)

  renderUserBlock('Alisa Warren', 'avatar.png');
  renderSearchFormBlock();
  renderSearchStubBlock();
  //renderToast(
  //  { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
  //  { name: 'Понял?', handler: () => { console.log('Уведомление закрыто') } }
  //)
})
