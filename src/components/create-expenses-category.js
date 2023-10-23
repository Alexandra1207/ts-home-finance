import {Sidebar} from "./sidebar.js";

export class CreateExpensesCategory {
    constructor() {
        this.createButton = document.getElementById('create-btn');
        this.cancelButton = document.getElementById('cancel-btn');

        Sidebar.sidebarButtons('expenses');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();

        this.createButton.addEventListener('click', function() {
            location.href = '#/expenses'
        });

        this.cancelButton.addEventListener('click', function() {
            location.href = '#/expenses'
        });

    }
}