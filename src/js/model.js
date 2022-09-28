import { async } from 'regenerator-runtime';
import { API_URL, KEY } from './config.js';
import { AJAX } from './helper.js';
import { RES_PER_PAGE } from './config.js';
import { callbackify } from 'util';

export const state = {
  recipe: {},
  search: {
    query: [],
    result: [],
    page: 1,
    searchPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipe = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    time: recipe.cooking_time,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipe(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query.push(query);
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.result = data.data.recipes.map(res => {
      return {
        id: res.id,
        title: res.title,
        publisher: res.publisher,
        image: res.image_url,
        ...(res.key && { key: res.key }),
      };
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSearchPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.searchPerPage;
  const end = page * state.search.searchPerPage;

  return state.search.result.slice(start, end);
};

const setBookmarkLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

export const addBookmark = function (recipe) {
  //Adding recipe to Bookmark
  state.bookmarks.push(recipe);
  //Setting previous marked bookmarks
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  setBookmarkLocalStorage();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  //deleting book marks
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  setBookmarkLocalStorage();
};

export const uploadRecipe = async function (myRecipe) {
  try {
    console.log(myRecipe);
    const ingredients = Object.entries(myRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // console.log(ing[1]);
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingridiant Format.PLease use correct format :)'
          );
        // console.log(ingArr);
        const [quantity, unit, description] = ingArr;
        // console.log(quantity, unit, description);

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: myRecipe.title,
      source_url: myRecipe.sourceUrl,
      image_url: myRecipe.image,
      publisher: myRecipe.publisher,
      cooking_time: myRecipe.cookingTime,
      servings: myRecipe.servings,
      ingredients,
    };

    const comeBackData = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipe(comeBackData);

    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
