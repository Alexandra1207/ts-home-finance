import {Sidebar} from "./sidebar";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Functions} from "./functions";
import {OperationsType} from "../types/operations.type";
import {ErrorType} from "../types/error.type";

export class IncomeExpenses {
    private incomeExpense: OperationsType[] | [];
    private createIncomeButton: HTMLButtonElement | null;
    private createExpenseButton: HTMLButtonElement | null;
    readonly tableBody: HTMLElement | null;
    private agreeDeleteBtn: HTMLButtonElement | null;
    private disagreeDeleteBtn: HTMLButtonElement | null;
    myOverlay: HTMLElement | null;
    modalWindow: HTMLElement | null;

    constructor() {
        this.incomeExpense = [];
        this.createIncomeButton = document.getElementById('create-income') as HTMLButtonElement;
        this.createExpenseButton = document.getElementById('create-expense') as HTMLButtonElement;
        this.tableBody = document.getElementById('table-body');

        this.agreeDeleteBtn = document.getElementById('agree-delete-btn') as HTMLButtonElement;
        this.disagreeDeleteBtn = document.getElementById('disagree-delete-btn') as HTMLButtonElement;

        this.myOverlay = document.getElementById('myOverlay');
        this.modalWindow = document.getElementById('modal');

        const that: IncomeExpenses = this;

        Sidebar.sidebarButtons('income-expenses');
        Functions.initOperations(this.handleButtonClick.bind(this));
        this.showOperations();

        this.createIncomeButton.addEventListener('click', function () {
            location.href = '#/create-expenses-income';
        });
        this.createExpenseButton.addEventListener('click', function () {
            location.href = '#/create-expenses-income';
        });

        this.agreeDeleteBtn.addEventListener('click', function () {
            const dataId: string | null = ((this.parentNode as HTMLElement).parentNode as HTMLInputElement).getAttribute('data-id');
            const selectedItem: HTMLElement | null = document.querySelector('[data-id="' + dataId + '"]');
            if (dataId && selectedItem) {
                Functions.deleteOperation(dataId);
                (that.modalWindow as HTMLElement).classList.add('d-none');
                (that.myOverlay as HTMLElement).classList.add('d-none');
                selectedItem.remove();
                Sidebar.getBalance();
            }
        });
        this.disagreeDeleteBtn.addEventListener('click', function () {
            (that.modalWindow as HTMLElement).classList.add('d-none');
            (that.myOverlay as HTMLElement).classList.add('d-none');
        });

    }


    public handleButtonClick(button: HTMLButtonElement): void {
        const period: string | null = button.id === 'interval' ? Functions.getIntervalPeriod() : `/operations?period=${button.id}`;

        if (period) {
            Functions.returnLabelDates();
            this.showOperations(period);
        } else {
            (this.tableBody as HTMLElement).innerHTML = '';
        }
    }

    async showOperations(period = '/operations?period=all') {
        const that: IncomeExpenses = this;

        if (this.tableBody) {
            this.tableBody.innerHTML = '';
        }

        try {
            const result: OperationsType[] | ErrorType = await CustomHttp.request(config.host + period);
            if (result) {
                if ((result as ErrorType).message) {
                    throw new Error((result as ErrorType).message);
                }
                this.incomeExpense = result as OperationsType[];
            }
        } catch (error) {
            console.log(error);
        }


        this.incomeExpense.forEach(function (operation: OperationsType, index: number) {
            const row: HTMLElement | null = document.createElement('tr');
            row.setAttribute('data-id', operation.id.toString());

            const th: HTMLElement | null = document.createElement('th');
            th.setAttribute('scope', 'scope');
            th.innerHTML = (index + 1).toString();

            const type: HTMLElement | null = document.createElement('td');
            type.className = operation.type === "expense" ? 'text-danger' : 'text-success';
            type.innerHTML = operation.type === "expense" ? 'расход' : 'доход';

            const category: HTMLElement| null = document.createElement('td');
            category.innerHTML = operation.category.toLowerCase();

            const amount: HTMLElement | null = document.createElement('td');
            amount.innerHTML = operation.amount + '$';

            const date: HTMLElement | null = document.createElement('td');
            date.innerHTML = formattedDate(operation.date);

            const comment: HTMLElement | null = document.createElement('td');
            comment.innerHTML = operation.comment;

            const buttons: HTMLElement | null = document.createElement('td');
            buttons.className = 'text-nowrap';
            buttons.innerHTML = '<td class="text-nowrap">\n' +
                '                <button type="submit" class="bg-transparent border-0 me-2 btn-icon trash-btn">\n' +
                '                    <svg class="bi pe-none" width="16" height="16">\n' +
                '                        <use xlink:href="images/icons/bootstrap-icons.svg#trash"/>\n' +
                '                    </svg>\n' +
                '                </button>\n' +
                '                <button type="submit" class="bg-transparent border-0 btn-icon modify-btn">\n' +
                '                    <svg class="bi pe-none me-2 icon" width="16" height="16">\n' +
                '                        <use xlink:href="images/icons/bootstrap-icons.svg#pencil"/>\n' +
                '                    </svg>\n' +
                '                </button>'

            row.appendChild(th);
            row.appendChild(type);
            row.appendChild(category);
            row.appendChild(amount);
            row.appendChild(date);
            row.appendChild(comment);
            row.appendChild(buttons);

            (that.tableBody as HTMLElement).appendChild(row);


            const deleteButtons: NodeListOf<HTMLButtonElement>  | null = document.querySelectorAll('.trash-btn');

            deleteButtons.forEach(function (button: HTMLButtonElement) {
                button.addEventListener('click', function () {
                    // const modalWindow = document.getElementById('modal');
                    const dataID: string | null = ((button.parentNode as HTMLElement).parentNode as HTMLElement).getAttribute('data-id');

                    if (dataID) {
                        (that.modalWindow as HTMLElement).setAttribute('data-id', dataID);
                        (that.modalWindow as HTMLElement).classList.remove('d-none');
                        (that.myOverlay as HTMLElement).classList.remove('d-none');
                    }

                });
            });

            const modifyButtons: NodeListOf<HTMLButtonElement>  | null = document.querySelectorAll('.modify-btn');

            modifyButtons.forEach(function (button: HTMLButtonElement) {
                button.addEventListener('click', function () {
                    // const dataID = button.parentNode.parentNode.getAttribute('data-id');
                    const dataID: string | null = ((button.parentNode as HTMLElement).parentNode as HTMLElement).getAttribute('data-id');
                    location.href = '#/modify-expenses-income?id=' + dataID;
                });
            });

        })

        function formattedDate(date: string): string {
            const parts: string[] = date.split("-");
            const year: string = parts[0];
            const month: string = parts[1];
            const day: string = parts[2];
            return day + "." + month + "." + year;
        }
    }
}