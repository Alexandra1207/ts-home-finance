import {UrlManager} from "../utils/url-manager.js";
import {Sidebar} from "./sidebar.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class ModifyCategory {
    constructor(page) {
        this.routeParams = UrlManager.getQueryParams();
        this.categoryInput = document.getElementById('category')
        this.saveButton = document.getElementById('save');
        this.cancelButton = document.getElementById('cancel');
        this.page = page;
        const that = this;

        Sidebar.sidebarButtons(this.page);

        const typeApiUrl = page === 'income' ? '/categories/income/' : '/categories/expense/';
        this.fillInput(typeApiUrl);

        this.saveButton.addEventListener('click', function () {
            that.sendModifyCategory(typeApiUrl);
            location.href = '#/' + that.page;
        });

        this.cancelButton.addEventListener('click', function () {
            location.href = '#/' + that.page;

        });

    }

    async fillInput(typeApiUrl) {
        if (this.routeParams.id) {
            try {
                const category = await CustomHttp.request(config.host + typeApiUrl + this.routeParams.id);
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

    async sendModifyCategory(typeApiUrl) {
        return await CustomHttp.request(config.host + typeApiUrl + this.routeParams.id, 'PUT', {
            "title": this.categoryInput.value
        });
    }
}