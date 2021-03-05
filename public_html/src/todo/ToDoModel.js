'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import EditDescription_Transaction from './transactions/EditDescription_Transaction.js'
import EditDate_Transaction from './transactions/EditDate_Transaction.js'
import EditStatus_Transaction from './transactions/EditStatus_Transaction.js'
import MoveUp_Transaction from './transactions/MoveUp_Transaction.js'
import MoveDown_Transaction from './transactions/MoveDown_Transaction.js'
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    addNewEmptyList(){
        let newList = new ToDoList(this.nextListId++);
        this.currentList = newList;
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        this.view.enableButtons();
        this.view.moveSelectedListUp(newList,this.toDoLists);
        this.view.highlightList(newList);
        this.view.viewList(newList)
        return newList;
    }
    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    closeList(){
        this.view.clearItemsList();
        this.view.unhighlightList(this.currentList);
        this.view.disableButtons();
        this.view.enableAddListButton();
    }
    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let listToLoad = this.toDoLists[listIndex];
            this.currentList = listToLoad;
            this.tps.clearAllTransactions();
            this.view.moveSelectedListUp(this.currentList,this.toDoLists);
            this.view.highlightList(this.currentList);
            this.view.enableButtons();
            this.view.disableAddListButton();
            this.view.disableRedoButton();
            this.view.disableUndoButton();
            this.view.viewList(this.currentList);
      }
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
            if(this.tps.getRedoSize() == 0){
                this.view.disableRedoButton();
                this.view.enableUndoButton();
            }
            else {
                this.view.enableRedoButton();
            }
        }
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.enableAddListButton();
        this.view.refreshLists(this.toDoLists);
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
            this.view.enableRedoButton();
            if(this.tps.getUndoSize() == 0){
                this.view.disableUndoButton();
            }
            else {
                this.view.enableUndoButton();
            }
        }
    } 

    addEditDescriptionTransaction(listItem,newDescription) {
        let transaction = new EditDescription_Transaction(this,listItem,listItem.getDescription(),newDescription);
        this.tps.addTransaction(transaction);
        this.view.disableRedoButton();
        this.view.enableUndoButton();
    }

    editDescription(listItem,newDescription){
        listItem.setDescription(newDescription);
        this.view.viewList(this.currentList);
    }

    addEditDateTransaction(listItem,newDate) {
        let transaction = new EditDate_Transaction(this,listItem,listItem.getDueDate(),newDate);
        this.tps.addTransaction(transaction);
        this.view.disableRedoButton();
        this.view.enableUndoButton();
    }

    editDate(listItem,newDate){
        listItem.setDueDate(newDate);
        this.view.viewList(this.currentList);
    }

    addEditStatusTransaction(listItem,newStatus) {
        let transaction = new EditStatus_Transaction(this,listItem,listItem.getStatus(),newStatus);
        this.tps.addTransaction(transaction);
        this.view.disableRedoButton();
        this.view.enableUndoButton();
    }

    editStatus(listItem,newStatus){
        listItem.setStatus(newStatus);
        this.view.viewList(this.currentList);
    }

    addMoveUpTransaction(listIndex){
        let transaction = new MoveUp_Transaction(this,listIndex);
        this.tps.addTransaction(transaction);
        this.view.disableRedoButton();
        this.view.enableUndoButton();
    }

    addMoveDownTransaction(listIndex){
        let transaction = new MoveDown_Transaction(this,listIndex);
        this.tps.addTransaction(transaction);
        this.view.disableRedoButton();
        this.view.enableUndoButton();
    }

    swapListItems(index1,index2){
        let temp = this.currentList.items[index1];
        this.currentList.items[index1] = this.currentList.items[index2];
        this.currentList.items[index2] = temp;
        this.view.viewList(this.currentList);
    }

    addDeleteItemTransaction(listItem,listIndex){
        let transaction = new DeleteItem_Transaction(this,listItem,listIndex);
        this.tps.addTransaction(transaction);
        this.view.disableRedoButton();
        this.view.enableUndoButton();
    }

    deleteItem(listIndex){
        this.currentList.items.splice(listIndex,1);
        this.view.viewList(this.currentList);
    }

    addItemAtIndex(listItem,listIndex){
        this.currentList.items.splice(listIndex,0,listItem);
        this.view.viewList(this.currentList);
    }

}