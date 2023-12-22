import {Sidebar} from "./sidebar";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UrlManager} from "../utils/url-manager";
import {Functions} from "./functions";
import {QueryParamsType} from "../types/query-params.type";
import {OperationsType} from "../types/operations.type";
import {ErrorType} from "../types/error.type";
import {CategoriesType} from "../types/categories.type";

export class ModifyExpensesIncome {
    private selectTypeElement: HTMLSelectElement | null;
    readonly selectCategoryElement: HTMLSelectElement | null;
    private saveButton: HTMLButtonElement | null;
    private cancelButton: HTMLButtonElement | null;
    readonly amountInput: HTMLInputElement | null;
    readonly dateInput: HTMLInputElement | null;
    readonly commentInput: HTMLInputElement | null;
    readonly optionsType: HTMLOptionsCollection | null;
    private routeParams: QueryParamsType;
    private operation: OperationsType | ErrorType | null;

    constructor() {
        this.selectTypeElement = document.getElementById('select-type') as HTMLSelectElement;
        this.selectCategoryElement = document.getElementById('select-category') as HTMLSelectElement;
        this.saveButton = document.getElementById('save-btn') as HTMLButtonElement;
        this.cancelButton = document.getElementById('cancel-btn') as HTMLButtonElement;
        this.amountInput = document.getElementById('amount') as HTMLInputElement;
        this.dateInput = document.getElementById('date') as HTMLInputElement;
        this.commentInput = document.getElementById('comment') as HTMLInputElement;
        this.routeParams = UrlManager.getQueryParams();
        this.operation = null;
        this.optionsType = this.selectTypeElement.options;
        const that: ModifyExpensesIncome = this;

        Sidebar.sidebarButtons('income-expenses');

        this.init();

        this.saveButton.addEventListener('click', function () {
            that.updateOperation();
            location.href = '#/income-expenses';
        });
        this.cancelButton.addEventListener('click', function () {
            location.href = '#/income-expenses'
        });

    }

    private async init(): Promise<void> {
        const that: ModifyExpensesIncome = this;
        this.fillFields();
        (this.selectTypeElement as HTMLSelectElement).addEventListener('change', function () {
            const selectedOption: HTMLOptionElement | null = (that.selectTypeElement as HTMLSelectElement).options[(that.selectTypeElement as HTMLSelectElement).selectedIndex];
            const typeOperation: string = selectedOption.textContent === 'Доход' ? '/categories/income' : '/categories/expense';
            if (that.selectCategoryElement) {
                while (that.selectCategoryElement.options.length > 1) {
                    that.selectCategoryElement.remove(1);
                }
                Functions.typeRequest(typeOperation);
            }
        });


    }

    private async fillFields(): Promise<void> {
        this.operation = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id);

        if (this.operation as OperationsType) {
            const operationType: string = (this.operation as OperationsType).type === 'expense' ? "Расход" : "Доход";
            for (let i = 0; i < (this.optionsType as HTMLOptionsCollection).length; i++) {
                if (this.optionsType) {
                    if (this.optionsType[i].textContent === operationType) {
                        this.optionsType[i].selected = true;
                        break;
                    }
                }
            }
        }

        const categories: CategoriesType[] = await CustomHttp.request(config.host + '/categories/' + (this.operation as OperationsType).type);

        categories.forEach(item => {
            const optionElement: HTMLOptionElement | null = document.createElement('option');
            if (optionElement) {
                optionElement.value = item.id.toString();
                optionElement.text = item.title;
                (this.selectCategoryElement as HTMLSelectElement).appendChild(optionElement);
            }
        });

        if (this.selectCategoryElement) {
            const optionsCategory: HTMLOptionsCollection | null = this.selectCategoryElement.options;
            for (let i = 0; i < optionsCategory.length; i++) {
                if (optionsCategory[i].textContent === (this.operation as OperationsType).category) {
                    optionsCategory[i].selected = true;
                    break;
                }
            }
        }

        if (this.amountInput && this.dateInput && this.commentInput) {
            this.amountInput.setAttribute("value", (this.operation as OperationsType).amount.toString());
            this.dateInput.setAttribute("value", (this.operation as OperationsType).date);
            this.commentInput.setAttribute("value", (this.operation as OperationsType).comment);
        }
    }

    private async updateOperation(): Promise<void> {
        const that: ModifyExpensesIncome = this;
        const selectedOption: HTMLOptionElement | null = (this.selectTypeElement as HTMLSelectElement).options[(this.selectTypeElement as HTMLSelectElement).selectedIndex];
        const selectedText = (selectedOption as HTMLOptionElement).text;
        const type: string = selectedText === 'Доход' ? 'income' : 'expense';
        return await CustomHttp.request(config.host + '/operations/' + this.routeParams.id, 'PUT', {
            "type": type,
            "amount": +(this.amountInput as HTMLInputElement).value,
            "date": (this.dateInput as HTMLInputElement).value,
            "comment": (this.commentInput as HTMLInputElement).value,
            "category_id": +(that.selectCategoryElement as HTMLSelectElement).value
        });
    }
}

