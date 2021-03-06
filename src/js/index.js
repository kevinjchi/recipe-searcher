// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        // Highlight selected search item
        if (state.searchsearch) View.highlightSelected(id);
        
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
            recipeView.renderRecipe(
                state.recipe,
                state.likes ? state.likes.isLiked(id) : undefined
            );

        } catch (err) {
            console.log(err);
            alert('Error processing recipe');
        }

    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list if there in none yet
    if (!state.list) state.list = new List();

    // Add ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

}

// Handle delete and update list item
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.delItem(id);

        // Delete from UI
        listView.delItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const amount = parseFloat(e.target.value, 10);
        state.list.updateCount(id, amount);
    }
});


/**
 * Like controller
 */
const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes()};
    const currentId = state.recipe.id;
    // current recipe is not yet liked

    if (!state.likes.isLiked(currentId)) {
        // Add like
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggleLikesBtn
        likesView.toggleLikeBtn(true);
        
        //add likes to UI
        likesView.renderLikes(newLike);
    } else {
        // remove like from the state
        state.likes.deleteLike(currentId);
        //toggleLikesBtn
        likesView.toggleLikeBtn(false);
        // remove like from UI list
        likesView.deleteLike(currentId)

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// Restore likes recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    
    // render existing likes
    state.likes.likes.forEach(like => likesView.renderLikes(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        } 
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // call the like controller
        controlLike();
    }
});
