'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewEmptyList();
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
        }

        document.getElementById("close-list-button").onmousedown = function(){
            appModel.closeList();
        }

        // Defining event handlers for modal here since simple enough, too complicated to route to view
        document.getElementById("delete-list-button").onmousedown = function() {
            document.getElementsByClassName('modal-wrapper')[0].style.display='block';
            document.getElementsByClassName('modal')[0].style.display='block';
        }
        
        document.getElementById("modal-cancel").onmousedown = function(){
            document.getElementsByClassName('modal-wrapper')[0].style.display='none';
            document.getElementsByClassName('modal')[0].style.display='none';
        }

        document.getElementById("modal-close").onmousedown = function(){
            document.getElementsByClassName('modal-wrapper')[0].style.display='none';
            document.getElementsByClassName('modal')[0].style.display='none';
        }

        document.getElementById("modal-delete").onmousedown = function(){
            document.getElementsByClassName('modal-wrapper')[0].style.display='none';
            document.getElementsByClassName('modal')[0].style.display='none';
            appModel.removeCurrentList();
        }

        document.getElementById("add-item-button").onmousedown = function() {
            appModel.addNewItemTransaction();
        }
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }

    handleDescriptionChange(listItem,description){
        this.model.addEditDescriptionTransaction(listItem,description);
    }

    handleDateChange(listItem,date){
        this.model.addEditDateTransaction(listItem,date);
    }

    handleStatusChange(listItem,status){
        this.model.addEditStatusTransaction(listItem,status);
    }

    handleMoveElementUp(listIndex){
        this.model.addMoveUpTransaction(listIndex);
    }

    handleMoveElementDown(listIndex){
        this.model.addMoveDownTransaction(listIndex);
    }

    handleDeleteItem(listItem,listIndex){
        this.model.addDeleteItemTransaction(listItem,listIndex);
    }
}