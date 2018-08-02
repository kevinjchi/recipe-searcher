// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/**Global state of the app
 * - Search object
 * - current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

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
    // 4) Search for recipes
        await state.search.getResult();

    // 5) render result on UI
        clearLoader();
        searchView.renderResults(state.search.result);
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
        searchView.renderResults(state.search.result, goToPage)
    };
});