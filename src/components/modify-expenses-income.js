import {Sidebar} from "./sidebar";

export class ModifyExpensesIncome {
    constructor() {
        this.createButton = document.getElementById('create-btn');
        this.cancelButton = document.getElementById('cancel-btn');

        Sidebar.sidebarButtons('income-expenses');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();

        // const createIncomeButton = document.getElementById('create-income');
        this.createButton.addEventListener('click', function() {
            location.href = '#/income-expenses'
        });
        this.cancelButton.addEventListener('click', function() {
            location.href = '#/income-expenses'
        });
    }
}