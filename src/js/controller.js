import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultview from './views/resultview.js';
import paganationView from './views/paganationView';
import bookmark from './views/bookmark.js';
import addrecipeview from './views/addrecipeview.js';
import { API_URL, resperpage, KEY, MODAL_CLOSE_SEC } from './config';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlrecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderspinner();
    resultview.update(model.getsearchresultpage());
    bookmark.render(model.state.bookmarks);
    await model.loadrecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchrecipe = async function () {
  try {
    resultview.renderspinner();
    const q = searchView.query();
    if (!q) return;
    await model.loadSearchRecipe(q);
    resultview.render(model.getsearchresultpage());
    paganationView.render(model.state.Search);
  } catch (err) {
    console.log(err);
  }
};

const controlpagview = function (goToPage) {
  resultview.render(model.getsearchresultpage(goToPage));
  paganationView.render(model.state.Search);
};

const controlserving = function (ser) {
  model.updateserving(ser);
  recipeView.update(model.state.recipe);
};

const controlbookmarks = function () {
  if (model.state.recipe.bookmarked) {
    model.removeBooksmarks(model.state.recipe.id);
  } else {
    model.addBooksmarks(model.state.recipe);
  }
  recipeView.update(model.state.recipe);
  bookmark.render(model.state.bookmarks);
};

const cbookmarks = function () {
  bookmark.render(model.state.bookmarks);
};

const controladdrecipe = async function (ne) {
  try {
    // Show loading spinner
    addrecipeview.renderspinner();
    // Upload the new recipe data
    await model.uploadrecipe(ne);
    recipeView.render(model.state.recipe);
    bookmark.render(model.state.recipe);
    window.history.pushState(null, '', `${model.state.bookmarks}`);
    setTimeout(function () {
      addrecipeview.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addrecipeview.renderError(err.massage);
  }
};

const init = function () {
  recipeView.addHandlerEvent(controlrecipe);
  searchView.addHandlerSearch(controlSearchrecipe);
  paganationView.addHandlerClick(controlpagview);
  recipeView.addHandlerupdateserving(controlserving);
  recipeView.addbookhandler(controlbookmarks);
  bookmark.bookspupdate(cbookmarks);
  addrecipeview.addHandlerUpload(controladdrecipe);
};

init();
