import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Sidebar} from "./sidebar.js";

export class CreateCategory {
    constructor(page) {
        this.createButton = document.getElementById('create-btn');
        this.cancelButton = document.getElementById('cancel-btn');
        this.page = page;
        this.typeOperations = page === 'income' ? 'income' : 'expense';

        Sidebar.sidebarButtons(this.page);
        this.init();
    }

    init() {
        const that = this;
        this.createButton.addEventListener('click', function () {
            const categoryName = document.getElementById('category-name');
            if (categoryName.value) {
                that.createCategory(that.typeOperations, categoryName.value);
                location.href = '#/' + that.page;
            } else {
                categoryName.style.borderColor = 'red';
            }
        });

        this.cancelButton.addEventListener('click', function () {
            location.href = '#/' + that.page;
        });

    }

    async createCategory(type, name) {
        return await CustomHttp.request(config.host + '/categories/' + type, 'POST', {"title": name});
    }
}