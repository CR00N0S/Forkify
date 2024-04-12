import { async } from 'regenerator-runtime';
import { API_URL, resperpage, KEY, MODAL_CLOSE_SEC } from './config';
import { timeout_sec } from './config';
import { getJSON, sendJSON } from './helpers';

export const state = {
  recipe: {},
  Search: {
    query: '',
    result: [],
    respage: resperpage,
    page: 1,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadrecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchRecipe = async function (q) {
  try {
    const data = await getJSON(`${API_URL}?search=${q}&key=${KEY}`);
    state.Search.query = q;
    state.Search.result = data.data.recipes.map(m => {
      return {
        id: m.id,
        title: m.title,
        image_url: m.image_url,
        publisher: m.publisher,
        ...(m.key && { key: m.key }),
      };
    });
    state.Search.page = 1;
  } catch (err) {
    throw err;
  }
};

const persistbookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const updateserving = function (news) {
  state.recipe.ingredients.forEach(element => {
    element.quantity = (element.quantity * news) / state.recipe.servings;
  });
  state.recipe.servings = news;
};

export const getsearchresultpage = function (page = state.Search.page) {
  state.Search.page = page;

  const start = (page - 1) * state.Search.respage;
  const end = page * state.Search.respage;
  return state.Search.result.slice(start, end);
};

export const addBooksmarks = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistbookmarks();
};

export const removeBooksmarks = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistbookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadrecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await sendJSON(`${API_URL}/?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);
    addBooksmarks(state.recipe);
  } catch (err) {
    throw err;
  }
};
