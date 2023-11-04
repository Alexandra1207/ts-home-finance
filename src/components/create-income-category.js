import {Sidebar} from "./sidebar.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class CreateIncomeCategory {
    constructor() {
        this.createButton = document.getElementById('create-btn');
        this.cancelButton = document.getElementById('cancel-btn');
        const that = this;

        Sidebar.sidebarButtons('income');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();

        const result = this.getInfo();
        console.log(result);


        this.createButton.addEventListener('click', function () {
            const categoryName = document.getElementById('category-name');
            if (categoryName.value) {
                that.createCategory(categoryName.value);
                location.href = '#/income'
            } else {
                categoryName.style.borderColor = 'red';

            }
        });

        this.cancelButton.addEventListener('click', function () {
            location.href = '#/income'
        });
    }

    async createCategory(name) {
        return await CustomHttp.request(config.host + '/categories/income/', 'POST', {"title": name});
    }
    async getInfo() {
        return await CustomHttp.request(config.host + '/categories/income');
    }
}