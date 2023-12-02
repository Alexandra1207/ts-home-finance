import {Sidebar} from "./sidebar";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";
import {Functions} from "./functions.js";

export class ModifyExpensesIncome {
    constructor() {
        this.selectTypeElement = document.getElementById('select-type');
        this.selectCategoryElement = document.getElementById('select-category');
        this.saveButton = document.getElementById('save-btn');
        this.cancelButton = document.getElementById('cancel-btn');
        this.amountInput = document.getElementById('amount')
        this.dateInput = document.getElementById('date')
        this.commentInput = document.getElementById('comment')
        this.routeParams = UrlManager.getQueryParams();
        this.operation = null;
        this.optionsType = this.selectTypeElement.options;
        const that = this;

        Sidebar.sidebarButtons('income-expenses');

        this.init();

        this.saveButton.addEventListener('click', function () {
            that.updateOperation();
            location.href = '#/income-expenses';
        });
        this.cancelButton.addEventListener('click', function () {
            location.href = '#/income-expenses'
        });

    }

    async init() {
        const that = this;
        this.fillFields();
        this.selectTypeElement.addEventListener('change', function () {
            const selectedOption = that.selectTypeElement.options[that.selectTypeElement.selectedIndex];
            const typeOperation = selectedOption.textContent === 'Доход' ? '/categories/income' : '/categories/expense';
            while (that.selectCategoryElement.options.length > 1) {
                that.selectCategoryElement.remove(1);
            }
            Functions.typeRequest(typeOperation);
        });


    }

    async fillFields() {
        this.operation = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id);

        const operationType = this.operation.type === 'expense' ? "Расход" : "Доход";
        for (let i = 0; i < this.optionsType.length; i++) {
            if (this.optionsType[i].textContent === operationType) {
                this.optionsType[i].selected = true;
                break;
            }
        }

        const categories = await CustomHttp.request(config.host + '/categories/' + this.operation.type);

        categories.forEach(item => {
            const optionElement = document.createElement('option');
            optionElement.value = item.id;
            optionElement.text = item.title;
            this.selectCategoryElement.appendChild(optionElement);
        });

        const optionsCategory = this.selectCategoryElement.options;
        for (let i = 0; i < optionsCategory.length; i++) {
            if (optionsCategory[i].textContent === this.operation.category) {
                optionsCategory[i].selected = true;
                break;
            }
        }

        this.amountInput.setAttribute("value", this.operation.amount);
        this.dateInput.setAttribute("value", this.operation.date);
        this.commentInput.setAttribute("value", this.operation.comment);
    }

    async updateOperation() {
        const that = this;
        const select = document.getElementById("select-type");
        const selectedOption = select.options[select.selectedIndex];
        const selectedText = selectedOption.text;
        const type = selectedText === 'Доход' ? 'income' : 'expense';
        return await CustomHttp.request(config.host + '/operations/' + this.routeParams.id, 'PUT', {
            "type": type,
            "amount": +this.amountInput.value,
            "date": this.dateInput.value,
            "comment": this.commentInput.value,
            "category_id": +that.selectCategoryElement.value
        });
    }
}

