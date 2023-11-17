import {Sidebar} from "./sidebar";
import {UrlManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class ModifyIncomeCategory {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.categoryInput = document.getElementById('category')
        this.saveButton = document.getElementById('save');
        this.cancelButton = document.getElementById('cancel');
        const that =this;

        Sidebar.sidebarButtons('income');
        this.fillInput();

        this.saveButton.addEventListener('click', function() {
            that.sendModifyCategory()
            location.href = '#/income'
        });
        this.cancelButton.addEventListener('click', function() {
            location.href = '#/income'
        });
    }

    async fillInput() {
        if (this.routeParams.id) {
            try {
                const category = await CustomHttp.request(config.host + '/categories/income/' + this.routeParams.id);
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
        return await CustomHttp.request(config.host + '/categories/income/' + this.routeParams.id, 'PUT', {
            "title": this.categoryInput.value
        });
    }

}