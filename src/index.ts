import { renderSearchFormBlock, clearTimeoutSearch } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock, getFavoritesAmount, getUserData } from './user.js'

window.addEventListener('DOMContentLoaded', () => {
  const user = getUserData()
  const amount = getFavoritesAmount()

  renderUserBlock(user ? user.userName : '???', user ? user.avatarUrl : '', amount ? amount : 0);
  renderSearchFormBlock();
  renderSearchStubBlock();
});

window.addEventListener('onunload', () => {
  clearTimeoutSearch();
})


