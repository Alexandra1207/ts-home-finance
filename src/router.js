import {Form} from "./components/form.js";
import {Main} from "./components/main.js"
import {Auth} from "./services/auth.js"
import {ModifyExpensesCategory} from "./components/modify-expenses-category.js"
import {Income} from "./components/income.js"
import {CreateIncomeCategory} from "./components/create-income-category.js";
import {ModifyIncomeCategory} from "./components/modify-income-category.js";
import {Expenses} from "./components/expenses.js";
import {CreateExpensesCategory} from "./components/create-expenses-category.js";
import {CreateExpensesIncome} from "./components/create-expenses-income.js";
import {IncomeExpenses} from "./components/income-expenses.js";
import {ModifyExpensesIncome} from "./components/modify-expenses-income.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.header = document.getElementById('header');
        this.sidebarElement = document.getElementById('sidebar');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');

        this.routes = [

            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/form.css',
                sidebar: false,
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'styles/form.css',
                sidebar: false,
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'styles/index.css',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/income-expenses',
                title: 'Доходы и расходы',
                template: 'templates/income-expenses.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new IncomeExpenses();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new Income();
                }
            },
            {
                route: '#/create-income-category',
                title: 'Создание категории расходов',
                template: 'templates/create-income-category.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new CreateIncomeCategory();
                }
            },
            {
                route: '#/modify-income-category',
                title: 'Редактирование категории доходов',
                template: 'templates/modify-income-category.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new ModifyIncomeCategory();
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '#/create-expenses-category',
                title: 'Создание категории расходов',
                template: 'templates/create-expenses-category.html',
                styles: 'styles/create-expenses-category.css',
                load: () => {
                    new CreateExpensesCategory();
                }
            },
            {
                route: '#/modify-expenses-category',
                title: 'Редактирование категории расходов',
                template: 'templates/modify-expenses-category.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new ModifyExpensesCategory();
                }
            },
            {
                route: '#/create-expenses-income',
                title: 'Создание дохода/расхода',
                template: 'templates/create-expenses-income.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new CreateExpensesIncome();
                }
            },
            {
                route: '#/modify-expenses-income',
                title: 'Редактирование дохода/расхода',
                template: 'templates/modify-expenses-income.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new ModifyExpensesIncome();
                }
            },
            {
                route: '#/logout',
                load: () => {
                    Auth.logout();
                }
            },
        ]
    }

    async openRoute() {

        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash;
        });

        if (newRoute.sidebar === false) {
            this.sidebarElement.classList.add('d-none');
            this.header.classList.add('d-none');
            this.contentElement.classList.remove('w-auto');
            this.contentElement.classList.remove('p-5');
        } else {
            this.sidebarElement.classList.remove('d-none');
            this.header.classList.remove('d-none');
            this.contentElement.classList.add('w-auto');
            this.contentElement.classList.add('p-5');
        }


        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }
        if (newRoute.template) {
            this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        }
        if (newRoute.styles) {
            this.stylesElement.setAttribute('href', newRoute.styles);
        }
        if (newRoute.title) {
            this.titleElement.innerText = newRoute.title;
        }

        newRoute.load();
    }
}