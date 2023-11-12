import {Sidebar} from "./sidebar.js";
import {Functions} from "./functions.js";

export class CreateExpensesCategory {
    constructor() {
        this.createButton = document.getElementById('create-btn');
        this.cancelButton = document.getElementById('cancel-btn');

        Sidebar.sidebarButtons('expenses');

        this.createButton.addEventListener('click', function () {
            const categoryName = document.getElementById('category-name');
            if (categoryName.value) {
                Functions.createCategory('expense/', categoryName.value);
                location.href = '#/expenses';
            } else {
                categoryName.style.borderColor = 'red';
            }
        });

        this.cancelButton.addEventListener('click', function () {
            location.href = '#/expenses'
        });

    }

}