import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }
    
    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit, 
            ingredient
        }
        this.items.push(item);
        return item;
    }

    delItem (id) {
        const index = this.items.findIndex(el => el.id == id);
        //[2,4,6] splice(1,1) --> return 4, original array is [2,6]
        //[2,4,6] slice(1,1) --> return 4, original array is [2,4,6]
        this.items.splice(index, 1);
    }
    
    updateCount (id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}