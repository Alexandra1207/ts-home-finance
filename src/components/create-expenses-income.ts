import {Sidebar} from "./sidebar";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Functions} from "./functions";

export class CreateExpensesIncome {
    private selectTypeElement: HTMLSelectElement | null;
    private selectCategoryElement: HTMLSelectElement | null;
    private createButton: HTMLButtonElement | null;
    private cancelButton: HTMLButtonElement | null;
    private sum: HTMLInputElement | null;
    private date: HTMLInputElement | null;
    private comment: HTMLInputElement | null;
    constructor() {
        this.selectTypeElement = document.getElementById('select-type') as HTMLSelectElement;
        this.selectCategoryElement = document.getElementById('select-category') as HTMLSelectElement;
        this.createButton = document.getElementById('create-btn') as HTMLButtonElement;
        this.cancelButton = document.getElementById('cancel-btn') as HTMLButtonElement;
        this.sum = document.getElementById('sum') as HTMLInputElement;
        this.date = document.getElementById('date') as HTMLInputElement;
        this.comment = document.getElementById('comment') as HTMLInputElement;

        Sidebar.sidebarButtons('income-expenses');

        this.init();
    }

    private init(): void {

        const that: CreateExpensesIncome = this;

        (this.selectTypeElement as HTMLSelectElement).addEventListener('change', function () {
            const selectedOption: HTMLOptionElement = (that.selectTypeElement as HTMLSelectElement).options[(that.selectTypeElement as HTMLSelectElement).selectedIndex];
            const typeOperation: string = selectedOption.textContent === 'Доход' ? '/categories/income' : '/categories/expense';
            const selectCategoryElement: HTMLSelectElement | null = document.getElementById('select-category') as HTMLSelectElement;

            while (selectCategoryElement.options.length > 1) {
                selectCategoryElement.remove(1);
            }
            Functions.typeRequest(typeOperation);
        });

        (this.createButton as HTMLButtonElement).addEventListener('click', function () {
            if (that.validateInputs()) {
                that.createOperation();
                location.href = '#/income-expenses';
            }
        });

        (this.cancelButton as HTMLButtonElement).addEventListener('click', function () {
            location.href = '#/income-expenses';
        });

    }


    private validateInputs(): boolean {
        const inputElements: NodeListOf<HTMLInputElement> | null = document.querySelectorAll('.item-input');
        const selectElements: NodeListOf<HTMLSelectElement> | null = document.querySelectorAll('select');
        let hasEmptyField = false;

        selectElements.forEach(select => {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption.hasAttribute('value')) {
                select.classList.remove('is-invalid');
            } else {
                select.classList.add('is-invalid');
                hasEmptyField = true;
            }
        });

        inputElements.forEach(item => {
            if (!item.value) {
                item.classList.add('is-invalid');
                hasEmptyField = true;
            } else {
                item.classList.remove('is-invalid');
            }
        });

        return !hasEmptyField;
    }

    private async createOperation(): Promise<void> {
        const that: CreateExpensesIncome = this;
        const selectedOption = (that.selectTypeElement as HTMLSelectElement).options[(that.selectTypeElement as HTMLSelectElement).selectedIndex];
        const type = selectedOption.textContent === 'Доход' ? 'income' : 'expense';

        if (that.sum && that.date && that.comment && that.selectCategoryElement) {
            return await CustomHttp.request(config.host + '/operations', 'POST', {
                "type": type,
                "amount": +that.sum.value,
                "date": that.date.value,
                "comment": that.comment.value,
                "category_id": +that.selectCategoryElement.value
            });
        }
    }
}