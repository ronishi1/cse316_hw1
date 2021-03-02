'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class DeleteItem_Transaction extends jsTPS_Transaction {
    constructor(initModel,listItem,listIndex) {
        super();
        this.model = initModel;
        this.listItem = listItem
        this.listIndex = listIndex;
    }

    doTransaction() {
        this.model.deleteItem(this.listIndex);
    }

    undoTransaction() {
        this.model.addItemAtIndex(this.listItem,this.listIndex);
    }
}