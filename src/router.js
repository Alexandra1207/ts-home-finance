import {Form} from "./components/form.js";
import {Main} from "./components/main.js"
import {Auth} from "./services/auth.js"
import {CreateExpensesIncome} from "./components/create-expenses-income.js";
import {IncomeExpenses} from "./components/income-expenses.js";
import {ModifyExpensesIncome} from "./components/modify-expenses-income.js";
import {Sidebar} from "./components/sidebar.js";
import {ModifyCategory} from "./components/modify-category.js";
import {CreateCategory} from "./components/create-category.js";
import {Categories} from "./components/categories.js";

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
                    new Categories('income');
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new Categories('expenses');
                }
            },
            {
                route: '#/create-income-category',
                title: 'Создание категории доходов',
                template: 'templates/create-income-category.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new CreateCategory('income');
                }
            },
            {
                route: '#/create-expenses-category',
                title: 'Создание категории расходов',
                template: 'templates/create-expenses-category.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new CreateCategory('expenses');
                }
            },
            {
                route: '#/modify-income-category',
                title: 'Редактирование категории доходов',
                template: 'templates/modify-income-category.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new ModifyCategory('income');
                }
            },
            {
                route: '#/modify-expenses-category',
                title: 'Редактирование категории расходов',
                template: 'templates/modify-expenses-category.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new ModifyCategory('expenses');
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
            return item.route === urlRoute;
        });


        if (newRoute.sidebar !== false) {
            this.sidebarElement.classList.remove('d-none');
            this.sidebarElement.innerHTML = await fetch('templates/sidebar.html').then(response => response.text());
            Sidebar.getSidebarInfo();
            Sidebar.getBalance();
        } else {
            this.sidebarElement.innerHTML = '';
            this.sidebarElement.classList.add('d-none');
            this.header.classList.add('d-none');
            this.contentElement.classList.remove('w-auto');
            this.contentElement.classList.remove('p-5')
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