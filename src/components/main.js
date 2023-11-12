import {Chart} from 'chart.js/auto';
import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http.js";
import {Sidebar} from "./sidebar.js";


export class Main {
    constructor() {
        Sidebar.sidebarButtons('main');

        this.showPieChartIncome();
        this.showPieChartExpense();
        this.init();
    }

    init() {
        const that = this;

        const buttons = document.querySelectorAll('.btn');

        const labelDateFrom = document.getElementById('label-date-from');
        const inputDateFrom = document.getElementById('date-from');

        const labelDateTo = document.getElementById('label-date-to');
        const inputDateTo = document.getElementById('date-to');


        // labelDateFrom.addEventListener('click', function () {
        //     console.log(labelDateFrom);
        //     inputDateFrom.classList.remove('d-none');
        //     labelDateFrom.style.width = "110px";
        // });
        //
        // labelDateTo.addEventListener('click', function () {
        //     inputDateTo.classList.remove('d-none');
        //     labelDateTo.style.width = "110px";
        // });


        buttons.forEach(function (button) {
            button.addEventListener('click', function () {

                buttons.forEach(function (btn) {
                    btn.classList.remove('active');
                });
                this.classList.add('active');

                const allBtn = document.getElementById('all-btn');
                const todayBtn = document.getElementById('today-btn');
                const weekBtn = document.getElementById('week-btn');
                const monthBtn = document.getElementById('month-btn');
                const yearBtn = document.getElementById('year-btn');
                const intervalBtn = document.getElementById('interval-btn');

                if (button === allBtn) {
                    that.showPieChartIncome();
                    that.showPieChartExpense();
                }

                if (button === todayBtn) {
                    that.showPieChartIncome('/operations?period=today');
                    that.showPieChartExpense('/operations?period=today');
                }

                if (button === weekBtn) {
                    that.showPieChartIncome('/operations?period=week');
                    that.showPieChartExpense('/operations?period=week');
                }

                if (button === monthBtn) {
                    that.showPieChartIncome('/operations?period=month');
                    that.showPieChartExpense('/operations?period=month');
                }

                if (button === yearBtn) {
                    that.showPieChartIncome('/operations?period=month');
                    that.showPieChartExpense('/operations?period=month');

                }

                if (button === intervalBtn) {
                    if (inputDateFrom.value && inputDateTo.value) {
                        // labelDateFrom.classList.remove('text-danger');
                        // labelDateFrom.classList.remove('border-danger');
                        // labelDateTo.classList.remove('text-danger');
                        // labelDateTo.classList.remove('border-danger');
                        that.showPieChartIncome('/operations?period=interval&dateFrom=' + inputDateFrom.value + '&dateTo=' + inputDateTo.value);
                        that.showPieChartExpense('/operations?period=interval&dateFrom=' + inputDateFrom.value + '&dateTo=' + inputDateTo.value);
                    }
                    // else {
                    //     if (!inputDateFrom.value || !inputDateTo.value) {
                    //         labelDateFrom.classList.add('text-danger');
                    //         labelDateFrom.classList.add('border-danger');
                    //         labelDateTo.classList.add('text-danger');
                    //         labelDateTo.classList.add('border-danger');
                    //     }
                    // }
                }


            });
        });

    }

    async showPieChartIncome(period = '/operations?period=all') {
        const incomeContainer = document.getElementById("income-container");
        incomeContainer.innerHTML = '';
        incomeContainer.innerHTML = '<canvas id="pieChartIncome"></canvas>';


        const arrayCategories = await CustomHttp.request(config.host + '/categories/income');
        const allCategories = arrayCategories.map(item => item.title);
        const operations = await CustomHttp.request(config.host + period);
        const allOperations = operations.filter(item => item.type === 'income');
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
        const ctx = document.getElementById('pieChartIncome').getContext('2d');

        const chartIncome = new Chart(ctx, {
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

    async showPieChartExpense(period = '/operations?period=all') {

        const expenseContainer = document.getElementById("expense-container");
        expenseContainer.innerHTML = '';
        expenseContainer.innerHTML = '<canvas id="pieChartExpense"></canvas>';


        const arrayCategories = await CustomHttp.request(config.host + '/categories/expense');
        const allCategories = arrayCategories.map(item => item.title);
        const operations = await CustomHttp.request(config.host + period);
        const allOperations = operations.filter(item => item.type === 'expense');
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
        const ctx = document.getElementById('pieChartExpense').getContext('2d');

        const chartExpenses = new Chart(ctx, {
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
