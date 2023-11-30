import {Sidebar} from "./sidebar";
import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http.js";
import {Functions} from "./functions.js";


export class Income {
    constructor() {
        this.categories = null;
        this.createIncomeCategoryButton = document.getElementById('create-income-category-btn');

        Sidebar.sidebarButtons('income');

        Functions.initCategoryItems('/categories/income', '#/modify-income-category?id=');

        this.createIncomeCategoryButton.addEventListener('click', function () {
            location.href = '#/create-income-category'
        });

    }
}

