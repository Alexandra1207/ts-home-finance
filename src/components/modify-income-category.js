import {Sidebar} from "./sidebar";

export class ModifyIncomeCategory {
    constructor() {
        this.saveButton = document.getElementById('save');
        this.cancelButton = document.getElementById('cancel');

        Sidebar.sidebarButtons('income');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();

        this.saveButton.addEventListener('click', function() {
            location.href = '#/income'
        });
        this.cancelButton.addEventListener('click', function() {
            location.href = '#/income'
        });
    }
}