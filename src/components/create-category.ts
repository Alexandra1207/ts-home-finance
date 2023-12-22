import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Sidebar} from "./sidebar";

export class CreateCategory {
    readonly page: 'income' | 'expenses';
    private createButton: HTMLElement | null;
    private cancelButton: HTMLElement | null;
    private typeOperations: string;
    constructor(page: 'income' | 'expenses') {
        this.createButton = document.getElementById('create-btn');
        this.cancelButton = document.getElementById('cancel-btn');
        this.page = page;
        this.typeOperations = page === 'income' ? 'income' : 'expense';

        Sidebar.sidebarButtons(this.page);
        this.init();
    }

    private init(): void {
        const that: CreateCategory = this;

        (this.createButton as HTMLElement).addEventListener('click', function () {
            const categoryName: HTMLInputElement | null = document.getElementById('category-name') as HTMLInputElement;
            if (categoryName.value) {
                that.createCategory(that.typeOperations, categoryName.value);
                location.href = '#/' + that.page;
            } else {
                categoryName.style.borderColor = 'red';
            }
        });

        (this.cancelButton as HTMLButtonElement).addEventListener('click', function () {
            location.href = '#/' + that.page;
        });

    }

    private async createCategory(type: string, name: string): Promise<void> {
        return await CustomHttp.request(config.host + '/categories/' + type, 'POST', {"title": name});
    }
}