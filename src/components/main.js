import {Chart} from 'chart.js/auto';
import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http.js";
import {Sidebar} from "./sidebar.js";
import {Functions} from "./functions.js";


export class Main {
    constructor() {
        Sidebar.sidebarButtons('main');
        Functions.initOperations(this.handleButtonClick.bind(this));
        this.showPieChart('income');
        this.showPieChart('expense');
    }

    handleButtonClick(button) {

        const period = button.id === 'interval' ? Functions.getIntervalPeriod()  : `/operations?period=${button.id}`;

        if (period) {
            Functions.returnLabelDates();
            this.showPieChart('income', period);
            this.showPieChart('expense', period);
        } else {
            const incomeContainer = document.getElementById('income-container');
            const expenseContainer = document.getElementById('expense-container');
            incomeContainer.innerHTML = '';
            expenseContainer.innerHTML = '';
        }

    }


    async showPieChart(type, period = '/operations?period=all') {

        const containerId = type === 'income' ? 'income-container' : 'expense-container';
        const canvasId = type === 'income' ? 'pieChartIncome' : 'pieChartExpense';
        const typeApiUrl = type === 'income' ? '/categories/income' : '/categories/expense';

        const canvasContainer = document.getElementById(containerId);
        canvasContainer.innerHTML = `<canvas id=${canvasId}></canvas>`;


        const arrayCategories = await CustomHttp.request(config.host + typeApiUrl);
        const allCategories = arrayCategories.map(item => item.title);
        const operations = await CustomHttp.request(config.host + period);
        const allOperations = operations.filter(item => item.type === type);
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

        this.createChart(canvasId, clearTotalAmountByCategory);


    }

    createChart(canvasId, clearTotalAmountByCategory) {
        let labels = clearTotalAmountByCategory.map(item => item.category);

        let data = clearTotalAmountByCategory.map(item => item.amount);
        const backgroundColors = [
            '#DC3545',
            '#20C997',
            '#0D6EFD',
            '#FFC107',
            '#FD7E14'
        ];
        const ctx = document.getElementById(canvasId).getContext('2d');

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

