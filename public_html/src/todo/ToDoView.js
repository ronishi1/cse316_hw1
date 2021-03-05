'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button");
        listElement.classList.add("todo-list");
        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onmousedown = function() {
            thisController.handleLoadList(newList.id);
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                + "<div class='task-col'>" + listItem.description + "</div>"
                                + "<div class='due-date-col'>" + listItem.dueDate + "</div>"
                                + "<div class='status-col'>" + listItem.status + "</div>"
                                + "<div class='list-controls-col'>"
                                + " <div class='list-item-control material-icons moveup'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons movedown'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons closeitem'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
        }
        for(let j = 0; j<list.items.length;j++){

            let listItemElement = document.getElementById("todo-list-item-" + list.items[j].id);

            // Task column
            let task = listItemElement.getElementsByClassName("task-col")[0];
            let taskInput = document.createElement("input");
            taskInput.className = "task-col"
            taskInput.value= list.items[j].getDescription();
            task.onmousedown = () => {
                task.replaceWith(taskInput);
                window.setTimeout(function () { 
                    taskInput.focus(); 
                }, 0); 
            }
            taskInput.onblur = () => {
                this.controller.handleDescriptionChange(list.items[j],taskInput.value);
                taskInput.replaceWith(task)
            }

            // Date column
            let date = listItemElement.getElementsByClassName("due-date-col")[0];
            let dateInput = document.createElement("input");
            dateInput.className = "due-date-col";
            dateInput.type = "date";
            dateInput.value = list.items[j].getDueDate();
            date.onmousedown = () => {
                date.replaceWith(dateInput);
                window.setTimeout(function () { 
                    dateInput.focus(); 
                }, 0); 
            }
            dateInput.onblur = () => {
                this.controller.handleDateChange(list.items[j],dateInput.value);
                dateInput.replaceWith(date);
            }
            // Status Column
            let status = listItemElement.getElementsByClassName("status-col")[0];
            if(list.items[j].status == "complete"){
                status.style.color = "#8ed4f8";
            }
            else {
                status.style.color = "#f5bc75"
            }
            let statusSelector = document.createElement("select");
            statusSelector.className = "status-col";
            let completeStatus = document.createElement("option");
            completeStatus.value = "complete";
            completeStatus.text = "complete";
            let incompleteStatus = document.createElement("option");
            incompleteStatus.value = "incomplete";
            incompleteStatus.text = "incomplete";
            statusSelector.appendChild(completeStatus);
            statusSelector.appendChild(incompleteStatus)
            status.onmousedown = () => {
                status.replaceWith(statusSelector);
                if(list.items[j].getStatus() == "complete"){
                    statusSelector.selectedIndex = 0;
                }
                else {
                    statusSelector.selectedIndex = 1;
                }
                window.setTimeout(function () { 
                    statusSelector.focus(); 
                }, 0);
            }
            statusSelector.onblur = () => {
                this.controller.handleStatusChange(list.items[j],statusSelector.value);
                statusSelector.replaceWith(status)
            }

            let moveup = listItemElement.getElementsByClassName("moveup")[0];
            if(j != 0){
                moveup.onmousedown = () => {
                    this.controller.handleMoveElementUp(j);
                }
            }
            else {
                moveup.style["pointer-events"] = "none";
                moveup.style.opacity = .3;
            }

            let movedown = listItemElement.getElementsByClassName("movedown")[0];
            if(j != list.items.length-1){
                movedown.onmousedown = () =>{
                    this.controller.handleMoveElementDown(j);
                }
            }
            else {
                movedown.style["pointer-events"] = "none";
                movedown.style.opacity = .3;
            }

            let closeItem = listItemElement.getElementsByClassName("closeitem")[0];
            closeItem.onmousedown = () => {
                this.controller.handleDeleteItem(list.items[j],j);
            }


        }
    }

    moveSelectedListUp(list,lists){
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";
        this.appendNewListToView(list)
        for (let i = 0; i < lists.length; i++) {
            let cur = lists[i];
            if(list != cur){
                this.appendNewListToView(cur);
            }
        }
    }

    highlightList(list){
        let listElement = document.getElementById("todo-list-" + list.id);
        listElement.style.backgroundColor = "rgba(255,200,0,.5)"
    }

    unhighlightList(list){
        let listElement = document.getElementById("todo-list-" + list.id);
        listElement.style.backgroundColor = "rgba(255,255,255,0)"
    }

    disableButtons(){
        document.getElementById("add-item-button").style["pointer-events"] = "none";
        document.getElementById("add-item-button").style.opacity = .3;
        document.getElementById("delete-list-button").style["pointer-events"] = "none";
        document.getElementById("delete-list-button").style.opacity = .3;
        document.getElementById("close-list-button").style["pointer-events"] = "none";
        document.getElementById("close-list-button").style.opacity = .3;
    }

    enableButtons(){
        document.getElementById("add-item-button").style["pointer-events"] = "auto";
        document.getElementById("add-item-button").style.opacity = 1;
        document.getElementById("delete-list-button").style["pointer-events"] = "auto";
        document.getElementById("delete-list-button").style.opacity = 1;
        document.getElementById("close-list-button").style["pointer-events"] = "auto";
        document.getElementById("close-list-button").style.opacity = 1;
    }

    disableAddListButton(){
        document.getElementById("add-list-button").style["pointer-events"] = "none";
        document.getElementById("add-list-button").style.opacity = .3;
    }

    enableAddListButton(){
        document.getElementById("add-list-button").style["pointer-events"] = "auto";
        document.getElementById("add-list-button").style.opacity = 1; 
    }
    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }

    disableUndoButton(){
        document.getElementById("undo-button").style["pointer-events"] = "none";
        document.getElementById("undo-button").style.opacity = .3;
    }

    enableUndoButton(){
        document.getElementById("undo-button").style["pointer-events"] = "auto";
        document.getElementById("undo-button").style.opacity = 1;
    }

    disableRedoButton(){
        document.getElementById("redo-button").style["pointer-events"] = "none";
        document.getElementById("redo-button").style.opacity = .3;
    }

    enableRedoButton(){
        document.getElementById("redo-button").style["pointer-events"] = "auto";
        document.getElementById("redo-button").style.opacity = 1;
    }
}