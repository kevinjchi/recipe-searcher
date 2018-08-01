// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

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

    // 4) Search for recipes
        await state.search.getResult();

    // 5) render result on UI
        searchView.renderResult(state.search.result);
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});
const search = new Search('Pizza');
console.log(search);
search.getResult();
