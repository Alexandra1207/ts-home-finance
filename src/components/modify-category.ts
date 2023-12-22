import {UrlManager} from "../utils/url-manager";
import {Sidebar} from "./sidebar";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {QueryParamsType} from "../types/query-params.type";
import {CategoriesType} from "../types/categories.type";
import {ErrorType} from "../types/error.type";

export class ModifyCategory {
    readonly page: 'income' | 'expenses';
    private routeParams: QueryParamsType;
    private categoryInput: HTMLInputElement | null;
    private saveButton : HTMLButtonElement | null;
    private cancelButton : HTMLButtonElement | null;

    constructor(page: 'income' | 'expenses') {
        this.routeParams = UrlManager.getQueryParams();
        this.categoryInput = document.getElementById('category') as HTMLInputElement;
        this.saveButton = document.getElementById('save') as HTMLButtonElement;
        this.cancelButton = document.getElementById('cancel') as HTMLButtonElement;
        this.page = page;
        const that: ModifyCategory = this;

        Sidebar.sidebarButtons(this.page);

        const typeApiUrl: string = page === 'income' ? '/categories/income/' : '/categories/expense/';
        this.fillInput(typeApiUrl);

        this.saveButton.addEventListener('click', function () {
            that.sendModifyCategory(typeApiUrl);
            location.href = '#/' + that.page;
        });

        this.cancelButton.addEventListener('click', function () {
            location.href = '#/' + that.page;

        });

    }

    private async fillInput(typeApiUrl: string): Promise<void> {
        if (this.routeParams.id) {
            try {
                const category: CategoriesType | ErrorType = await CustomHttp.request(config.host + typeApiUrl + this.routeParams.id);
                if (category) {
                    if ((category as ErrorType).error) {
                        throw new Error((category as ErrorType).message);
                    }
                    (this.categoryInput as HTMLInputElement).setAttribute("value", (category as CategoriesType).title);

                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    async sendModifyCategory(typeApiUrl: string) {
        return await CustomHttp.request(config.host + typeApiUrl + this.routeParams.id, 'PUT', {
            "title": (this.categoryInput as HTMLInputElement).value
        });
    }
}