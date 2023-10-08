import {Form} from "./components/form.js";
import {Main} from "./components/main.js"
import {Auth} from "./services/auth.js"

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.sidebarElement = document.getElementById('sidebar');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');

        this.routes = [
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
                route: '#/logout',
                load: () => {
                    Auth.logout();
                }
            }
        ]
    }

    async openRoute() {
        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash;
        });

        if (newRoute.sidebar === false) {
            this.sidebarElement.classList.add('d-none');
            this.contentElement.classList.remove('w-auto');
            // this.sidebarElement.style.display = 'none';
        } else {
            this.sidebarElement.classList.remove('d-none');
            this.contentElement.classList.add('w-auto');
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