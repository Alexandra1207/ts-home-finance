import {Sidebar} from "./sidebar.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Functions} from "./functions.js";
import button from "bootstrap/js/src/button";

export class IncomeExpenses {
    constructor() {
        this.incomeExpense = null;
        this.createIncomeButton = document.getElementById('create-income');
        this.createExpenseButton = document.getElementById('create-expense');
        this.tableBody = document.getElementById('table-body');

        this.agreeDeleteBtn = document.getElementById('agree-delete-btn');
        this.disagreeDeleteBtn = document.getElementById('disagree-delete-btn');

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
            const dataId = this.parentNode.parentNode.getAttribute('data-id');
            Functions.deleteOperation(dataId);
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');
            document.querySelector('[data-id="' + dataId + '"]').remove();
            Sidebar.getBalance();
        });
        this.disagreeDeleteBtn.addEventListener('click', function () {
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');
        });

    }


    handleButtonClick(button) {
        const period = button.id === 'interval' ? Functions.getIntervalPeriod() : `/operations?period=${button.id}`;

        if (period) {
            Functions.returnLabelDates();
            this.showOperations(period);
        } else {
            this.tableBody.innerHTML = '';
        }

    }

    async showOperations(period = '/operations?period=all') {
        // Functions.deleteUndefinedOperations();
        const that = this;

        this.tableBody.innerHTML = '';

        try {
            const result = await CustomHttp.request(config.host + period);
            if (result) {
                if (result.message) {
                    throw new Error(result.message);
                }
                this.incomeExpense = result;
            }
        } catch (error) {
            console.log(error);
        }


        this.incomeExpense.forEach(function (operation, index) {
            const row = document.createElement('tr');
            row.setAttribute('data-id', operation.id);

            const th = document.createElement('th');
            th.setAttribute('scope', 'scope');
            th.innerHTML = index + 1;

            const type = document.createElement('td');
            type.className = operation.type === "expense" ? 'text-danger' : 'text-success';
            type.innerHTML = operation.type === "expense" ? 'расход' : 'доход';
            // if (operation.type === "expense") {
            //     type.className = 'text-danger';
            //     type.innerHTML = 'расход';
            // }
            // if (operation.type === "income") {
            //     type.className = 'text-success';
            //     type.innerHTML = 'доход';
            // }

            const category = document.createElement('td');
            console.log(operation.category);
            category.innerHTML = operation.category.toLowerCase();

            const amount = document.createElement('td');
            amount.innerHTML = operation.amount + '$';

            const date = document.createElement('td');
            date.innerHTML = formattedDate(operation.date);

            const comment = document.createElement('td');
            comment.innerHTML = operation.comment;

            const buttons = document.createElement('td');
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

            that.tableBody.appendChild(row);


            const deleteButtons = document.querySelectorAll('.trash-btn');

            deleteButtons.forEach(function (button) {
                button.addEventListener('click', function () {
                    const modalWindow = document.getElementById('modal');
                    const dataID = button.parentNode.parentNode.getAttribute('data-id');

                    modalWindow.setAttribute('data-id', dataID);
                    modalWindow.classList.remove('d-none');

                    document.getElementById('myOverlay').classList.remove('d-none');
                });
            });

            const modifyButtons = document.querySelectorAll('.modify-btn');

            modifyButtons.forEach(function (button) {
                button.addEventListener('click', function () {
                    const dataID = button.parentNode.parentNode.getAttribute('data-id');
                    location.href = '#/modify-expenses-income?id=' + dataID;
                });
            });

        })

        function formattedDate(date) {
            const parts = date.split("-");
            const year = parts[0];
            const month = parts[1];
            const day = parts[2];
            return day + "." + month + "." + year;
        }
    }
}