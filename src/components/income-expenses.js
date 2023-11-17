import {Sidebar} from "./sidebar.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Functions} from "./functions.js";

export class IncomeExpenses {
    constructor() {
        this.incomeExpense = null;
        this.createIncomeButton = document.getElementById('create-income');
        this.createIncomeExpense = document.getElementById('create-expense');
        this.agreeDeleteBtn = document.getElementById('agree-delete-btn');
        this.disagreeDeleteBtn = document.getElementById('disagree-delete-btn');

        Sidebar.sidebarButtons('income-expenses');

        this.createIncomeButton.addEventListener('click', function () {
            location.href = '#/create-expenses-income';
        });
        this.createIncomeExpense.addEventListener('click', function () {
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

        this.init();
    }

    async init() {
        const buttons = document.querySelectorAll('.btn');
        const that = this;

        const allBtn = document.getElementById('all-btn');
        const todayBtn = document.getElementById('today-btn');
        const weekBtn = document.getElementById('week-btn');
        const monthBtn = document.getElementById('month-btn');
        const yearBtn = document.getElementById('year-btn');
        const intervalBtn = document.getElementById('interval-btn');

        this.showOperations();

        Functions.inputDates();

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {


                buttons.forEach(function (btn) {
                    btn.classList.remove('active');
                });
                this.classList.add('active');


                if (button === allBtn) {
                    that.showOperations();
                }

                if (button === todayBtn) {
                    that.showOperations('/operations?period=today');
                }

                if (button === weekBtn) {
                    that.showOperations('/operations?period=week');
                }

                if (button === monthBtn) {
                    that.showOperations('/operations?period=month');
                }

                if (button === yearBtn) {
                    that.showOperations('/operations?period=year');
                }

                const inputDateFrom = document.getElementById('input-date-from');
                const inputDateTo = document.getElementById('input-date-to');
                const labelDateFrom = document.getElementById('label-date-from');
                const labelDateTo = document.getElementById('label-date-to');

                if (labelDateFrom.classList.contains('text-danger')) {
                    labelDateFrom.classList.remove('text-danger');
                }
                labelDateFrom.classList.remove('border-danger');
                labelDateTo.classList.remove('text-danger');
                labelDateTo.classList.remove('border-danger');


                if (button !== intervalBtn) {
                    if (inputDateTo || inputDateFrom) {
                        labelDateFrom.classList.remove('d-none');
                        labelDateTo.classList.remove('d-none');
                        inputDateTo.classList.add('d-none');
                        inputDateFrom.classList.add('d-none');
                    }
                }

                if (button === intervalBtn) {
                    if (!inputDateFrom && !inputDateTo) {
                        labelDateFrom.classList.add('text-danger');
                        labelDateFrom.classList.add('border-danger');
                        labelDateTo.classList.add('text-danger');
                        labelDateTo.classList.add('border-danger');
                    } else if (!inputDateFrom && !inputDateTo.value) {
                        labelDateFrom.classList.add('text-danger');
                        labelDateFrom.classList.add('border-danger');
                        inputDateTo.classList.add('is-invalid');
                        ;
                    } else if (!inputDateTo && !inputDateFrom.value) {
                        labelDateTo.classList.add('text-danger');
                        labelDateTo.classList.add('border-danger');
                        inputDateFrom.classList.add('is-invalid');
                    } else if (!inputDateFrom.value && !inputDateTo.value) {
                        inputDateFrom.classList.add('is-invalid');
                        ;
                        inputDateTo.classList.add('is-invalid');
                    } else {
                        that.showOperations('/operations?period=interval&dateFrom=' + inputDateFrom.value + '&dateTo=' + inputDateTo.value);
                        inputDateFrom.classList.remove('is-invalid');
                        ;
                        inputDateTo.classList.remove('is-invalid');
                    }
                }


            });
        });


    }

    async showOperations(period = '/operations?period=all') {

        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

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