import View from './View';
import icons from '../../img/icons.svg';
import recipeView from './recipeView';
import previewView from './previewView';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe available for your query. Search again :)';

  _generateMarkup() {
    return this._data
      .map(recipeData => previewView.renderRecipe(recipeData, false))
      .join('');
  }
}

export default new ResultView();
