import {Sidebar} from "./sidebar.js";
import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class ModifyExpensesCategory {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.categoryInput = document.getElementById('category')
        this.saveButton = document.getElementById('save');
        this.cancelButton = document.getElementById('cancel');
        const that =this;

        Sidebar.sidebarButtons('expenses', );

        this.fillInput();

        this.saveButton.addEventListener('click', function() {
            that.sendModifyCategory();
            location.href = '#/expenses';
        });
        this.cancelButton.addEventListener('click', function() {
            location.href = '#/expenses';
        });

    }

    async fillInput() {
        if (this.routeParams.id) {
            try {
                const category = await CustomHttp.request(config.host + '/categories/expense/' + this.routeParams.id);
                if (category) {
                    if (category.error) {
                        throw new Error(category.error);
                    }
                    this.categoryInput.setAttribute("value", category.title);

                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    async sendModifyCategory() {
        return await CustomHttp.request(config.host + '/categories/expense/' + this.routeParams.id, 'PUT', {
            "title": this.categoryInput.value
        });
    }

}