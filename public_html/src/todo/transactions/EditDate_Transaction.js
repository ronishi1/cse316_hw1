'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class EditDate_Transaction extends jsTPS_Transaction {
    constructor(initModel,listItem,oldDate,newDate) {
        super();
        this.model = initModel;
        this.listItem = listItem;
        this.oldDate = oldDate;
        this.newDate = newDate;
    }

    doTransaction() {
        this.model.editDate(this.listItem,this.newDate);
    }

    undoTransaction() {
        this.model.editDate(this.listItem,this.oldDate);
    }
}