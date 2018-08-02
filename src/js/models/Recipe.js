import axios from 'axios';
import {key, proxy} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try{
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&q=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(error) {
            alert('Something went wrong');
        }
    };

    calcTime() {
        const numIngredients = this.ingredients.length;
        const periods = math.ceil(numIngredients/ 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unitShort, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            });
            // 2) remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) *\g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIngredient = ingredient.split(' ');
            const unitIndex = arrIngredient.findIndex(elTwo => unitsShort.includes(elTwo));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIngredient.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1){
                    count = eval(arrIngredient[0].replace('-', '+'));
                } else {
                    count = eval(arrIngredient.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count: count,
                    unit: arrIngredient[unitIndex],
                    ingredient: arrIngredient.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIngredient[0], 10)) {
                // there is No unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIngredient[0], 10),
                    unit: '',
                    ingredient: arrIngredient.slice(1).join;
                }
            } else if (unitIndex === -1) {
                // There is No unit and No number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient;
                }
            }
            return objIng; 
        });
        this.ingredients = newIngredients;
    }
};