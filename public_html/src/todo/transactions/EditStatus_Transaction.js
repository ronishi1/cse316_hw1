'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class EditStatus_Transaction extends jsTPS_Transaction {
    constructor(initModel,listItem,oldStatus,newStatus) {
        super();
        this.model = initModel;
        this.listItem = listItem;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
    }

    doTransaction() {
        this.model.editStatus(this.listItem,this.newStatus);
    }

    undoTransaction() {
        this.model.editStatus(this.listItem,this.oldStatus);
    }
}