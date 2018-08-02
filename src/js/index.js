// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';


/**Global state of the app
 * - Search object
 * - current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) getQuery from view
    const query = searchView.getInput(); //TODO
    if (query) {
    // 2) new search object and add to state
        state.search = new Search(query);
    // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);
        try{
            // 4) Search for recipes
                await state.search.getResult();
        
            // 5) render result on UI
                clearLoader();
                searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something went wrong');
            clearLoader();
        }
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});

elements.searchResPages.addEventListener('click', e => {
    // read MDN
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        // clear out before rendering results
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    };
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#','');
    if (id) {
        // Prepare UI for changes
        renderLoader(elements.recipe);
        // Create a new recipe object
        state.recipe = new Recipe(id);
        try {
            // Get recipe data, parse ingredient
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (err) {
            console.log(err);
            alert('Error processing recipe');
        }

    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));