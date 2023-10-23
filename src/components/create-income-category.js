import {Sidebar} from "./sidebar.js";

export class CreateIncomeCategory {
    constructor() {
        this.createButton = document.getElementById('create-btn');
        this.cancelButton = document.getElementById('cancel-btn');

        Sidebar.sidebarButtons('income');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();

        this.createButton.addEventListener('click', function() {
            location.href = '#/income'
        });

        this.cancelButton.addEventListener('click', function() {
            location.href = '#/income'
        });
    }
}