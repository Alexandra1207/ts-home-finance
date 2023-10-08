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
        // this.getIncome();


//         var labels = ['Продукты', 'Транспорт', 'Жилье', 'Развлечения']; // Здесь можно указать категории расходов
//         var data = [200, 150, 300, 1000]; // Здесь нужно указать суммы расходов за период
//         var backgroundColors = [
//             'rgba(255, 99, 132, 0.7)',
//             'rgba(54, 162, 235, 0.7)',
//             'rgba(255, 206, 86, 0.7)',
//             'rgba(75, 192, 192, 0.7)'
//         ]; // Здесь можно указать цвета для каждой категории
//
// // Настройка диаграммы
//         var ctx = document.getElementById('pieChart').getContext('2d');
//         var chart = new Chart(ctx, {
//             type: 'pie',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     data: data,
//                     backgroundColor: backgroundColors
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 legend: {
//                     position: 'bottom'
//                 },
//                 title: {
//                     display: true,
//                     text: 'Расходы за период'
//                 }
//             }
//         });
        //Запрос доходов


    }


    async getBalance() {
        const result = await CustomHttp.request(config.host + '/balance');
        if (result) {
            document.getElementById('balance').innerText = result.balance + '$';
        } else {
            document.getElementById('balance').innerText = 'Данные о балансе недоступны';
        }
        // console.log(result);

        // const response = await fetch(config.host + '/balance', {
        //     method: 'GET',
        //     headers: {
        //         'Content-type': 'application/json',
        //         'Accept': 'application/json',
        //         'x-auth-token': localStorage.getItem(Auth.accessTokenKey)
        //     }
        // });
        //
        // if (response && response.status ===200) {
        //     const result = await response.json();
        //     console.log(result);
        //     if (result) {
        //         if (result.error) {
        //             throw new Error(result.error);
        //         }
        //         console.log(result.balance);
        //         document.getElementById('balance').innerText = result.balance + '$';
        //     }
        // }

    }


    async showOperationPie(responseAddress, operationsType, elementId) {
        const arrayCategories = await CustomHttp.request(config.host + responseAddress);
        console.log(arrayCategories);
        const allCategories = arrayCategories.map(item => item.title);
        console.log(allCategories);
        const operations = await CustomHttp.request(config.host + '/operations?period=all')
        console.log(operations);
        const allOperations = operations.filter(item => item.type === operationsType);
        console.log(allOperations);
        const totalAmountByCategory = allCategories.map(category => {
            let sum = allOperations.reduce((total, obj) => {
                if (obj.category === category) {
                    return total + obj.amount;
                }
                return total;
            }, 0);
            return sum;
        });
        console.log(totalAmountByCategory);

        const clearTotalAmountByCategory = allCategories.reduce((acc, category, index) => {
            if (totalAmountByCategory[index] !== 0) {
                acc.push({ category: category, amount: totalAmountByCategory[index] });
            }
            return acc;
        }, []);

        console.log(clearTotalAmountByCategory);


        let labels = clearTotalAmountByCategory.map(item => item.category);
        console.log(labels);
        let data = clearTotalAmountByCategory.map(item => item.amount); // Здесь нужно указать суммы расходов за период
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


    async getIncome() {
        // const incomeCategory = await CustomHttp.request(config.host + '/categories/income');
        // console.log(incomeCategory);

        const expenseCategory = await CustomHttp.request(config.host + '/categories/expense');
        console.log(expenseCategory);
        const allExpenseCategory = expenseCategory.map(item => item.title);
        console.log(allExpenseCategory);


        const operations = await CustomHttp.request(config.host + '/operations?period=all')
        console.log(operations);

        // const incomeOperations = operations.filter(item => item.type === 'income');
        // console.log(incomeOperations);

        const expenseOperations = operations.filter(item => item.type === 'expense');
        console.log(expenseOperations);


        const totalAmountByCategory = allExpenseCategory.map(category => {
            let sum = expenseOperations.reduce((total, obj) => {
                if (obj.category === category) {
                    return total + obj.amount;
                }
                return total;
            }, 0);
            return sum;
        });
        console.log(totalAmountByCategory);


        const clearTotalAmountByCategory = allExpenseCategory.reduce((acc, category, index) => {
            if (totalAmountByCategory[index] !== 0) {
                acc.push({ category: category, amount: totalAmountByCategory[index] });
            }
            return acc;
        }, []);

        console.log(clearTotalAmountByCategory);

        let labels = clearTotalAmountByCategory.map(item => item.category);
        // // console.log(incomeArray);
        // // var labels = ['Продукты', 'Транспорт', 'Жилье', 'Развлечения']; // Здесь можно указать категории расходов
        let data = clearTotalAmountByCategory.map(item => item.amount); // Здесь нужно указать суммы расходов за период
        const backgroundColors = [
            '#DC3545',
            '#20C997',
            '#0D6EFD',
            '#FFC107',
            '#FD7E14'
        ]; // Здесь можно указать цвета для каждой категории


// Настройка диаграммы
        var ctx = document.getElementById('pieChart').getContext('2d');
        var chart = new Chart(ctx, {
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

