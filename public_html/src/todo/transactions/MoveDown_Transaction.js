'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class MoveDown_Transaction extends jsTPS_Transaction {
    constructor(initModel,listIndex) {
        super();
        this.model = initModel;
        this.listIndex = listIndex;
    }

    doTransaction() {
        this.model.swapListItems(this.listIndex,this.listIndex+1);
    }

    undoTransaction() {
        this.model.swapListItems(this.listIndex,this.listIndex+1);
    }
}