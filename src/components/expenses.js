import {Sidebar} from "./sidebar.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Functions} from "./functions.js";

export class Expenses {
    constructor() {
        this.categories = null;
        this.createIncomeCategoryButton = document.getElementById('create-income-category-btn');

        Sidebar.sidebarButtons('expenses');
        Functions.initCategoryItems('/categories/expense', '#/modify-expenses-category?id=');

        this.createIncomeCategoryButton.addEventListener('click', function () {
            location.href = '#/create-expenses-category';
        });

    }

}

