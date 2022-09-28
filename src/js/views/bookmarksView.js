import View from './View';
import icons from '../../img/icons.svg';
import recipeView from './recipeView';
import previewView from './previewView.js';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No recipe available for your query. Search again :)';

  addHandlerBookmarks(handle) {
    window.addEventListener('load', handle);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.renderRecipe(bookmark, false))
      .join('');
  }
}

export default new BookmarkView();
