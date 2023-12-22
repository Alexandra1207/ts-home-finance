import {Form} from "./components/form";
import {Main} from "./components/main"
import {Auth} from "./services/auth"
import {CreateExpensesIncome} from "./components/create-expenses-income";
import {IncomeExpenses} from "./components/income-expenses";
import {ModifyExpensesIncome} from "./components/modify-expenses-income";
import {Sidebar} from "./components/sidebar";
import {ModifyCategory} from "./components/modify-category";
import {CreateCategory} from "./components/create-category";
import {Categories} from "./components/categories";
import {RouteType} from "./types/route.type";

export class Router {
    readonly contentElement: HTMLElement | null;
    readonly header: HTMLElement | null;
    readonly sidebarElement: HTMLElement | null;
    readonly stylesElement: HTMLElement | null;
    readonly titleElement: HTMLElement | null;

    private routes: RouteType[];

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
                sidebar: true,
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/income-expenses',
                title: 'Доходы и расходы',
                template: 'templates/income-expenses.html',
                styles: 'styles/income-expenses.css',
                sidebar: true,
                load: () => {
                    new IncomeExpenses();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'styles/income-expenses.css',
                sidebar: true,
                load: () => {
                    new Categories('income');
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                styles: 'styles/income-expenses.css',
                sidebar: true,
                load: () => {
                    new Categories('expenses');
                }
            },
            {
                route: '#/create-income-category',
                title: 'Создание категории доходов',
                template: 'templates/create-income-category.html',
                styles: 'styles/income-expenses.css',
                sidebar: true,
                load: () => {
                    new CreateCategory('income');
                }
            },
            {
                route: '#/create-expenses-category',
                title: 'Создание категории расходов',
                template: 'templates/create-expenses-category.html',
                styles: 'styles/income-expenses.css',
                sidebar: true,
                load: () => {
                    new CreateCategory('expenses');
                }
            },
            {
                route: '#/modify-income-category',
                title: 'Редактирование категории доходов',
                template: 'templates/modify-income-category.html',
                styles: 'styles/income-expenses.css',
                sidebar: true,
                load: () => {
                    new ModifyCategory('income');
                }
            },
            {
                route: '#/modify-expenses-category',
                title: 'Редактирование категории расходов',
                template: 'templates/modify-expenses-category.html',
                styles: 'styles/income-expenses.css',
                sidebar: true,
                load: () => {
                    new ModifyCategory('expenses');
                }
            },
            {
                route: '#/create-expenses-income',
                title: 'Создание дохода/расхода',
                template: 'templates/create-expenses-income.html',
                styles: 'styles/income-expenses.css',
                sidebar: true,
                load: () => {
                    new CreateExpensesIncome();
                }
            },
            {
                route: '#/modify-expenses-income',
                title: 'Редактирование дохода/расхода',
                template: 'templates/modify-expenses-income.html',
                styles: 'styles/income-expenses.css',
                sidebar: true,
                load: () => {
                    new ModifyExpensesIncome();
                }
            },
            {
                route: '#/logout',
                title: '',
                template: '',
                styles: '',
                sidebar: false,
                load: () => {
                    Auth.logout();
                }
            },
        ]
    }

    public async openRoute(): Promise<void> {

        const urlRoute: string = window.location.hash.split('?')[0];
        if (urlRoute === '') {
            // await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const newRoute: RouteType | undefined = this.routes.find(item => {
            return item.route === urlRoute;
        });


        if (newRoute) {
            if (newRoute.sidebar) {
                if (this.sidebarElement) {
                    this.sidebarElement.classList.remove('d-none');
                }
                if (this.sidebarElement) {
                    this.sidebarElement.innerHTML = await fetch('templates/sidebar.html').then(response => response.text());
                }
                Sidebar.getSidebarInfo();
                Sidebar.getBalance();
            } else {
                if (this.sidebarElement) {
                    this.sidebarElement.innerHTML = '';
                    this.sidebarElement.classList.add('d-none');
                }
                if (this.header) {
                    this.header.classList.add('d-none');
                }
                if (this.contentElement) {
                    this.contentElement.classList.remove('w-auto');
                    this.contentElement.classList.remove('p-5');
                }
            }
        }

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }
        if (newRoute.template && this.contentElement) {
            this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        }
        if (newRoute.styles && this.stylesElement) {
            this.stylesElement.setAttribute('href', newRoute.styles);
        }
        if (newRoute.title && this.titleElement) {
            this.titleElement.innerText = newRoute.title;
        }
        newRoute.load();
    }
}