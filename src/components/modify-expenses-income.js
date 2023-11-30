import {Sidebar} from "./sidebar";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";

export class ModifyExpensesIncome {
    constructor() {
        this.typeInput = document.getElementById('type')
        this.categoryInput = document.getElementById('category')
        this.amountInput = document.getElementById('amount')
        this.dateInput = document.getElementById('date')
        this.commentInput = document.getElementById('comment')
        this.saveButton = document.getElementById('save-btn');
        this.cancelButton = document.getElementById('cancel-btn');
        this.routeParams = UrlManager.getQueryParams();
        this.operation = null;
        const that = this;

        Sidebar.sidebarButtons('income-expenses');

        this.init();

        this.saveButton.addEventListener('click', function () {
            that.sendNewData();
            location.href = '#/income-expenses';
        });
        this.cancelButton.addEventListener('click', function () {
            localStorage.removeItem("operationId");
            location.href = '#/income-expenses'
        });

    }

    async init() {
        if (this.routeParams.id) {
            try {
                const operation = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id);
                if (operation) {
                    if (operation.error) {
                        throw new Error(operation.error);
                    }

                    this.operation = operation;
                    console.log(this.operation);

                    if (this.operation.type === 'expense') {
                        this.typeInput.setAttribute("value", "Расход");
                    } else {
                        this.typeInput.setAttribute("value", "Доход");
                    }
                    this.categoryInput.setAttribute("value", this.operation.category);
                    this.amountInput.setAttribute("value", this.operation.amount);
                    this.dateInput.setAttribute("value", this.operation.date);
                    this.commentInput.setAttribute("value", this.operation.comment);

                }
            } catch (error) {
                console.log(error);
            }
        }

    }

    async sendNewData() {
        let type;
        if (this.typeInput.value === 'Расход') {
            type = 'expense';
        } else if (this.typeInput.value === 'Доход') {
            type = 'income';
        }

        return await CustomHttp.request(config.host + '/operations/' + this.routeParams.id, 'PUT', {
            "type": type,
            "amount": +this.amountInput.value,
            "date": this.dateInput.value,
            "comment": this.commentInput.value,
            "category_id": +this.routeParams.id
        });
    }
}