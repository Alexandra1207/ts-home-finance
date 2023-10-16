import {Chart} from 'chart.js/auto';
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http.js";


export class Main {
    constructor() {
        this.profileElement = document.getElementById('profile');
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);

        if (userInfo && accessToken) {
            this.profileElement.innerText = userInfo.fullName;
        } else {
            location.href = '#/login';
        }


        const that = this;
        this.categoriesButton = document.getElementById("categories-btn");
        this.categoriesButton.addEventListener("click", function () {
            that.categoriesButton.classList.toggle("active");
            document.getElementById("categories-items").classList.toggle("show");
        });

        this.init();

    }

    init() {
        this.getBalance();

        this.showOperationPie('/categories/expense', 'expense', 'pieChartExpense');
        this.showOperationPie('/categories/income', 'income', 'pieChartIncome');

        const buttons = document.querySelectorAll('.btn');
        const that = this;

        function formatDate(date) {
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            return year + '-' + month + '-' + day;
        }

        const labelDateFrom = document.getElementById('label-date-from');
        const inputDateFrom = document.getElementById('date-from');

        const labelDateTo = document.getElementById('label-date-to');
        const inputDateTo = document.getElementById('date-to');


        labelDateFrom.addEventListener('click', function () {
            inputDateFrom.classList.remove('d-none');
            labelDateFrom.style.width = "110px";
        });

        labelDateTo.addEventListener('click', function () {
            inputDateTo.classList.remove('d-none');
            labelDateTo.style.width = "110px";
        });


        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (btn) {
                    btn.classList.remove('active');
                });
                this.classList.add('active');

                const expenseContainer = document.getElementById("expense-container");
                expenseContainer.innerHTML = '<canvas id="pieChartExpense"></canvas>';

                const incomeContainer = document.getElementById("income-container");
                incomeContainer.innerHTML = '<canvas id="pieChartIncome"></canvas>';

                const allBtn = document.getElementById('all-btn');
                const todayBtn = document.getElementById('today-btn');
                const weekBtn = document.getElementById('week-btn');
                const monthBtn = document.getElementById('month-btn');
                const yearBtn = document.getElementById('year-btn');
                const intervalBtn = document.getElementById('interval-btn');


                const today = formatDate(new Date());

                if (button === allBtn) {
                    that.showOperationPie('/categories/expense', 'expense', 'pieChartExpense');
                    that.showOperationPie('/categories/income', 'income', 'pieChartIncome');
                }

                if (button === todayBtn) {
                    that.showOperationPie('/categories/expense', 'expense', 'pieChartExpense', '/operations?period=today');
                    that.showOperationPie('/categories/income', 'income', 'pieChartIncome', '/operations?period=today');
                }

                if (button === weekBtn) {
                    that.showOperationPie('/categories/expense', 'expense', 'pieChartExpense', '/operations?period=week');
                    that.showOperationPie('/categories/income', 'income', 'pieChartIncome', '/operations?period=week');
                }

                if (button === monthBtn) {
                    that.showOperationPie('/categories/expense', 'expense', 'pieChartExpense', '/operations?period=month');
                    that.showOperationPie('/categories/income', 'income', 'pieChartIncome', '/operations?period=month');
                }

                if (button === yearBtn) {
                    that.showOperationPie('/categories/expense', 'expense', 'pieChartExpense', '/operations?period=year');
                    that.showOperationPie('/categories/income', 'income', 'pieChartIncome', '/operations?period=year');
                }

                if (button === intervalBtn) {
                    if (inputDateFrom.value && inputDateTo.value) {
                        that.showOperationPie('/categories/expense', 'expense', 'pieChartExpense', '/operations?period=interval&dateFrom=' + inputDateFrom.value + '&dateTo=' + inputDateTo.value);
                        that.showOperationPie('/categories/income', 'income', 'pieChartIncome', '/operations?period=interval&dateFrom=' + inputDateFrom.value + '&dateTo=' + inputDateTo.value);
                    } else {
                        if (!inputDateFrom.value) {
                            labelDateFrom.style.color = 'red';
                        }
                    }
                }


            });
        });

    }

    async getBalance() {
        const result = await CustomHttp.request(config.host + '/balance');
        if (result) {
            document.getElementById('balance').innerText = result.balance + '$';
        } else {
            document.getElementById('balance').innerText = 'Данные о балансе недоступны';
        }
    }


    async showOperationPie(responseAddress, operationsType, elementId, period = '/operations?period=all') {
        const arrayCategories = await CustomHttp.request(config.host + responseAddress);
        const allCategories = arrayCategories.map(item => item.title);
        const operations = await CustomHttp.request(config.host + period);
        const allOperations = operations.filter(item => item.type === operationsType);
        const totalAmountByCategory = allCategories.map(category => {
            let sum = allOperations.reduce((total, obj) => {
                if (obj.category === category) {
                    return total + obj.amount;
                }
                return total;
            }, 0);
            return sum;
        });

        const clearTotalAmountByCategory = allCategories.reduce((acc, category, index) => {
            if (totalAmountByCategory[index] !== 0) {
                acc.push({category: category, amount: totalAmountByCategory[index]});
            }
            return acc;
        }, []);


        let labels = clearTotalAmountByCategory.map(item => item.category);
        let data = clearTotalAmountByCategory.map(item => item.amount);
        const backgroundColors = [
            '#DC3545',
            '#20C997',
            '#0D6EFD',
            '#FFC107',
            '#FD7E14'
        ];
        const ctx = document.getElementById(elementId).getContext('2d');

        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors
                }]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Расходы за период'
                }
            }
        });

    }


}

