import { elements } from './base';
import { access } from 'fs';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
};
 //default length limit of the title is set to 17
const limitRecipeTitle = (recipe, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        /**
         * 'Pasta tomato with and soup'
         * acc:0 / accumulator + current.length = 5/ newTitle = ['Pasta']
         * acc:5 / accumulator + current.length = 11/ newTitle = ['Pasta','tomato']
         * acc:11 / accumulator + current.length = 15/ newTitle = ['Pasta','tomato', 'with']
         */
        title.split(' ').reduce((accumulator, current) => {
            if (accumulator + current.length <= limit) {
                newTitle.push(current)
            }
            return accumulator + current.length
        }, 0);
        // return the result
        return `${newTitle.join(' ')} ...)`
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const renderResult = recipes => {
    // console.log(recipes);
    recipes.forEach(renderRecipe); //can prob write renderRecipe instead
};