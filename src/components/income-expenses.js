import {Sidebar} from "./sidebar.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class IncomeExpenses {
    constructor() {
        this.incomeExpense = null;
        this.createIncomeButton = document.getElementById('create-income');
        this.createIncomeExpense = document.getElementById('create-expense');
        this.modifyButtons = document.querySelectorAll('.modify-btn');
        this.trashButtons = document.querySelectorAll('.trash-btn');
        this.agreeDeleteBtn = document.getElementById('agree-delete-btn');
        this.disagreeDeleteBtn = document.getElementById('disagree-delete-btn');


        Sidebar.sidebarButtons('income-expenses');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();

        this.createIncomeButton.addEventListener('click', function () {
            location.href = '#/create-expenses-income';
        });
        this.createIncomeExpense.addEventListener('click', function () {
            location.href = '#/create-expenses-income';
        });

        this.modifyButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                location.href = '#/modify-expenses-income';
            });
        });
        this.trashButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                document.getElementById('modal').classList.remove('d-none');
                document.getElementById('myOverlay').classList.remove('d-none');
            });
        });
        this.agreeDeleteBtn.addEventListener('click', function () {
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');
        });
        this.disagreeDeleteBtn.addEventListener('click', function () {
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');
        });

        this.init();

    }

    async init() {

        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        try {
            const result = await CustomHttp.request(config.host + '/operations?period=all');
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
            const that = this;
            const row = document.createElement('tr');
            row.setAttribute('data-id', operation.id);

            const th = document.createElement('th');
            th.setAttribute('scope', 'scope');
            th.innerHTML = index + 1;

            const type = document.createElement('td');
            if (operation.type === "expense") {
                type.className = 'text-danger';
                type.innerHTML = 'расход';
            }
            if (operation.type === "income") {
                type.className = 'text-success';
                type.innerHTML = 'доход';
            }

            const category = document.createElement('td');
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

            tableBody.appendChild(row);

        })

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

        function formattedDate(date) {
            const parts = date.split("-");
            const year = parts[0];
            const month = parts[1];
            const day = parts[2];
            return day + "." + month + "." + year;
        }
    }

}