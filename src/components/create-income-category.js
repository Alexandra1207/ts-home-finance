import {Sidebar} from "./sidebar.js";
import {Functions} from "./functions.js";

export class CreateIncomeCategory {
    constructor() {
        this.createButton = document.getElementById('create-btn');
        this.cancelButton = document.getElementById('cancel-btn');

        Sidebar.sidebarButtons('income');

        this.createButton.addEventListener('click', function () {
            const categoryName = document.getElementById('category-name');
            if (categoryName.value) {
                Functions.createCategory('income/', categoryName.value);
                location.href = '#/income'
            } else {
                categoryName.style.borderColor = 'red';
            }
        });

        this.cancelButton.addEventListener('click', function () {
            location.href = '#/income'
        });
    }


}