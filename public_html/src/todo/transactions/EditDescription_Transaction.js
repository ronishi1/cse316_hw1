'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class EditDescription_Transaction extends jsTPS_Transaction {
    constructor(initModel,listItem,oldDescription,newDescription) {
        super();
        this.model = initModel;
        this.listItem = listItem;
        this.oldDescription=oldDescription
        this.newDescription = newDescription;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        this.model.editDescription(this.listItem,this.newDescription);
    }

    undoTransaction() {
        this.model.editDescription(this.listItem,this.oldDescription);
    }
}