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

        const that = this;


        Sidebar.sidebarButtons('income-expenses');


        this.createButton.addEventListener('click', function () {

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

            console.log(inputElements);
            inputElements.forEach(item => {
                console.log(item.value)

                    if (!item.value) {
                        item.classList.add('is-invalid');
                        hasEmptyField = true;
                        console.log(hasEmptyField);
                    } else {
                        item.classList.remove('is-invalid');

                    }

            });

            if (!hasEmptyField) {
                that.createOperation();
                location.href = '#/income-expenses';
            }

        });
        this.cancelButton.addEventListener('click', function () {
            location.href = '#/income-expenses';
        });

        this.init();
    }

    init() {

        // const selectTypeElement = document.getElementById('select-type');
        const that = this;

        this.selectTypeElement.addEventListener('change', function () {
            const selectedOption = that.selectTypeElement.options[that.selectTypeElement.selectedIndex];
            const selectedText = selectedOption.textContent;
            const selectCategoryElement = document.getElementById('select-category');

            while (selectCategoryElement.options.length > 1) {
                selectCategoryElement.remove(1);
            }
            if (selectedText === 'Доход') {
                that.typeRequest('/categories/income');
            } else if (selectedText === "Расход") {
                that.typeRequest('/categories/expense');
            }

        });


        // this.createButton.addEventListener('click', function () {
        //     // const
        //     // location.href = '#/income-expenses'
        // });
    }

    async typeRequest(type) {
        // const selectCategoryElement = document.getElementById('select-category');

        const result = await CustomHttp.request(config.host + type);
        result.forEach(item => {
            const optionElement = document.createElement('option');
            optionElement.value = item.id;
            optionElement.text = item.title;
            this.selectCategoryElement.appendChild(optionElement);
        });
        console.log(result);
    }

    async createOperation() {
        const that = this;
        const selectedOption = that.selectTypeElement.options[that.selectTypeElement.selectedIndex];
        const selectedText = selectedOption.textContent;
        // console.log(that.selectCategoryElement.value);
        let type;
        if (selectedText === 'Расход') {
            type = 'expense';
        } else if (selectedText === 'Доход') {
            type = 'income';
        }
        console.log({
            "type": type,
            "amount": +that.sum.value,
            "date": that.date.value,
            "comment": that.comment.value,
            "category_id": +that.selectCategoryElement.value
        })
        return await CustomHttp.request(config.host + '/operations', 'POST', {
            "type": type,
            "amount": +that.sum.value,
            "date": that.date.value,
            "comment": that.comment.value,
            "category_id": +that.selectCategoryElement.value
            // "type": "income",
            // "amount": 250,
            // "date": "2022-01-01",
            // "comment": "new comment",
            // "category_id": 2
        });
    }
}