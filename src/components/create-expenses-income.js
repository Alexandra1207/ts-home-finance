import {Sidebar} from "./sidebar.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config";

export class CreateExpensesIncome {
    constructor() {
        this.selectTypeElement = document.getElementById('select-type');
        this.selectCategoryElement = document.getElementById('select-category');

        this.createButton = document.getElementById('create-btn');
        this.cancelButton = document.getElementById('cancel-btn');
        this.sum = document.getElementById('sum');
        this.date = document.getElementById('date');
        this.comment = document.getElementById('comment');

        Sidebar.sidebarButtons('income-expenses');

        this.init();
    }

    init() {

        const that = this;

        this.selectTypeElement.addEventListener('change', function () {
            const selectedOption = that.selectTypeElement.options[that.selectTypeElement.selectedIndex];
            const typeOperation = selectedOption.textContent === 'Доход' ? '/categories/income' : '/categories/expense';
            const selectCategoryElement = document.getElementById('select-category');

            while (selectCategoryElement.options.length > 1) {
                selectCategoryElement.remove(1);
            }
            that.typeRequest(typeOperation);
        });

        this.createButton.addEventListener('click', function () {
            if (that.validateInputs()) {
                that.createOperation();
                location.href = '#/income-expenses';
            }
        });

        this.cancelButton.addEventListener('click', function () {
            location.href = '#/income-expenses';
        });

    }


    validateInputs() {
        const inputElements = document.querySelectorAll('.item-input');
        const selectElements = document.querySelectorAll('select');
        let hasEmptyField = false;

        selectElements.forEach(select => {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption.hasAttribute('value')) {
                select.classList.remove('is-invalid');
            } else {
                select.classList.add('is-invalid');
                hasEmptyField = true;
            }
        });

        inputElements.forEach(item => {
            if (!item.value) {
                item.classList.add('is-invalid');
                hasEmptyField = true;
            } else {
                item.classList.remove('is-invalid');
            }
        });

        return !hasEmptyField;
    }

    async typeRequest(type) {
        const result = await CustomHttp.request(config.host + type);
        result.forEach(item => {
            const optionElement = document.createElement('option');
            optionElement.value = item.id;
            optionElement.text = item.title;
            this.selectCategoryElement.appendChild(optionElement);
        });
    }

    async createOperation() {
        const that = this;
        const selectedOption = that.selectTypeElement.options[that.selectTypeElement.selectedIndex];
        const type = selectedOption.textContent === 'Доход' ? 'income' : 'expense';

        return await CustomHttp.request(config.host + '/operations', 'POST', {
            "type": type,
            "amount": +that.sum.value,
            "date": that.date.value,
            "comment": that.comment.value,
            "category_id": +that.selectCategoryElement.value
        });
    }
}