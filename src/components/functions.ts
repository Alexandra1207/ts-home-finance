import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {CategoriesType} from "../types/categories.type";

export class Functions {
    public static initOperations(handleButtonClick: (button: HTMLButtonElement) => void) {
        const buttons = document.querySelectorAll('.btn');

        Functions.inputDates();

        buttons.forEach((button) => {
            button.addEventListener('click', () => {

                buttons.forEach((btn) => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                handleButtonClick(button as HTMLButtonElement);
            });
        });

    }

    public static returnLabelDates(): void {
        const inputDateFrom: HTMLInputElement | null = document.getElementById('input-date-from') as HTMLInputElement;
        const inputDateTo: HTMLInputElement | null = document.getElementById('input-date-to') as HTMLInputElement;
        const labelDateFrom: HTMLElement | null = document.getElementById('label-date-from');
        const labelDateTo: HTMLElement | null = document.getElementById('label-date-to');

        if (inputDateFrom) {
            inputDateFrom.remove();
        }

        if (inputDateTo) {
            inputDateTo.remove();
        }

        (labelDateFrom as HTMLElement).classList.remove('d-none', 'text-danger', 'border-danger');
        (labelDateTo as HTMLElement).classList.remove('d-none', 'text-danger', 'border-danger');
    }


    public static getIntervalPeriod(): string | null {
        const inputDateFrom: HTMLInputElement | null = document.getElementById('input-date-from') as HTMLInputElement;
        const inputDateTo: HTMLInputElement | null = document.getElementById('input-date-to') as HTMLInputElement;

        if (inputDateFrom && inputDateTo && inputDateFrom.value && inputDateTo.value) {
            return '/operations?period=interval&dateFrom=' + inputDateFrom.value + '&dateTo=' + inputDateTo.value;
        } else {
            this.validateDateInputs();
            return null;
        }

    }

    static validateDateInputs() {
        const inputDateFrom: HTMLInputElement | null = document.getElementById('input-date-from') as HTMLInputElement;
        const inputDateTo: HTMLInputElement | null = document.getElementById('input-date-to') as HTMLInputElement;
        const labelDateFrom: HTMLElement | null = document.getElementById('label-date-from');
        const labelDateTo: HTMLElement | null = document.getElementById('label-date-to');

        if (!inputDateFrom || !inputDateTo) {
            (labelDateFrom as HTMLElement).classList.add('text-danger');
            (labelDateFrom as HTMLElement).classList.add('border-danger');
            (labelDateTo as HTMLElement).classList.add('text-danger');
            (labelDateTo as HTMLElement).classList.add('border-danger');
        }
        if (inputDateFrom || inputDateTo) {
            if (!inputDateFrom && !inputDateTo.value) {
                (labelDateFrom as HTMLElement).classList.add('text-danger');
                (labelDateFrom as HTMLElement).classList.add('border-danger');
                inputDateTo.classList.add('border-danger');
            } else if (!inputDateTo && !inputDateFrom.value) {
                (labelDateTo as HTMLElement).classList.add('text-danger');
                (labelDateTo as HTMLElement).classList.add('border-danger');
                inputDateFrom.classList.add('border-danger');
            } else if (!inputDateFrom.value && !inputDateTo.value) {
                inputDateFrom.classList.add('border-danger');
                inputDateTo.classList.add('border-danger');
            }
        }

    }

    public static async deleteOperation(id: string): Promise<void> {
        return await CustomHttp.request(config.host + '/operations/' + id, 'DELETE');
    }

    static inputDates() {
        const labelDateFrom: HTMLElement | null = document.getElementById('label-date-from');
        (labelDateFrom as HTMLElement).addEventListener('click', function () {
            (labelDateFrom as HTMLElement).classList.add('d-none');
            const dateFromBlock: HTMLElement | null = document.getElementById('date-from-block')
            const inputDateFrom: HTMLInputElement | null = document.createElement('input');
            inputDateFrom.id = 'input-date-from';
            inputDateFrom.setAttribute("type", "date");

            (dateFromBlock as HTMLElement).appendChild(inputDateFrom);
        })

        const labelDateTo: HTMLElement | null = document.getElementById('label-date-to');
        if (labelDateTo) {
            labelDateTo.addEventListener('click', function () {
                labelDateTo.classList.add('d-none');
                const dateToBlock: HTMLElement | null = document.getElementById('date-to-block')
                const inputDateTo: HTMLInputElement | null = document.createElement('input');
                inputDateTo.id = 'input-date-to';
                inputDateTo.setAttribute("type", "date");

                if (dateToBlock) {
                    dateToBlock.appendChild(inputDateTo);

                }
            })
        }
    }

    public static async typeRequest(type: string) {
        const result: CategoriesType[] | null = await CustomHttp.request(config.host + type);
        if (result) {
            result.forEach((item: CategoriesType) => {
                const optionElement: HTMLOptionElement | null = document.createElement('option');
                (optionElement as HTMLOptionElement).value = item.id.toString();
                optionElement.text = item.title;
                const selectCategoryElement = document.getElementById('select-category') as HTMLSelectElement;
                if (selectCategoryElement) {
                    selectCategoryElement.appendChild(optionElement);
                }
            });
        }

    }
}