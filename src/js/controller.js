import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import pagination from './views/pagination.js';
import { CLOSE_WINDOW, DEFAULT_PAGE } from './config.js';
import addRecipeView from './views/addRecipe.js';
//Import library

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import bookmarksView from './views/bookmarksView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2  5ed6604591c37cdc054bcb34

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpiner();
    //0 update result view to marked state
    resultView.update(model.getSearchPerPage());

    bookmarksView.update(model.state.bookmarks);

    //1 Load Recipe
    await model.loadRecipe(id);

    //2 Render Markup
    recipeView.renderRecipe(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchRecipe = async function () {
  try {
    model.state.search.page = DEFAULT_PAGE;
    resultView.renderSpiner();
    //1 getting query
    const query = searchView.getQuery();
    //2 load recipes
    await model.loadSearchResult(query);
    //3 rendering recipe
    // resultView.renderRecipe(model.state.search.result);
    //Rendering resultss
    resultView.renderRecipe(model.getSearchPerPage());

    //rendering pagination button
    pagination.renderRecipe(model.state.search);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlPagination = function (goto) {
  console.log(goto);

  //rendering results
  resultView.renderRecipe(model.getSearchPerPage(goto));

  //Rendering Pagination Button
  pagination.renderRecipe(model.state.search);
};

const controlUpdateServing = function (newServing) {
  model.updateServing(newServing);

  // recipeView.renderRecipe(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  //getting book marks / saving
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  //Rendring bookmarks

  bookmarksView.renderRecipe(model.state.bookmarks);

  console.log(model.state.recipe);
};

const controlBookmarksItem = function () {
  bookmarksView.renderRecipe(model.state.bookmarks);
};

const controlAddData = async function (myData) {
  try {
    //rendering spinner
    addRecipeView.renderSpiner();

    //upload data
    await model.uploadRecipe(myData);

    //render recipe
    addRecipeView.renderRecipe(model.state.recipe);

    //sucess message
    addRecipeView.renderMessage();

    //render Bookmars
    bookmarksView.renderRecipe(model.state.bookmarks);

    //change id in url pushState take 3 arrgument {state, string , id}
    window.history.pushState(null, '', model.state.recipe.id);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_WINDOW * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
    console.error(err);
  }
};

const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmarksItem);
  recipeView.addHandlerRecipe(controlRecipe);
  recipeView.addHandlerUpdateServing(controlUpdateServing);
  recipeView.addHandlerBookmark(controlBookmarks);
  searchView.addHandlerSearch(controlSearchRecipe);
  pagination.addHandlerClick(controlPagination);
  addRecipeView._addHandelerFormData(controlAddData);
};

init();
