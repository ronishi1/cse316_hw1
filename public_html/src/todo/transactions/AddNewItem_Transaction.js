'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddNewItem_Transaction extends jsTPS_Transaction {
    constructor(initModel,listItem) {
        super();
        this.model = initModel;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        if(this.itemAdded){
            this.model.reAddItem(this.itemAdded);
        }
        else {
            this.itemAdded = this.model.addNewItem();
        }
    }

    undoTransaction() {
        this.model.removeItem(this.itemAdded.id);
    }
}