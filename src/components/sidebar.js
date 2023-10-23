import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config.js";

export class Sidebar {

    static sidebarButtons(page) {
        const mainLink = document.getElementById('main-link');
        const incomeExpensesLink = document.getElementById('income-expenses-link');
        const categoriesButton = document.getElementById("categories-btn");
        const categoriesItems = document.getElementById('categories-items');
        const incomeLink = document.getElementById("income-link");
        const expensesLink = document.getElementById('expenses-link');

        const burgerButton = document.querySelector('.burger-btn');
        const sidebar = document.querySelector('.sidebar');
        const headerLogoLink = document.querySelector('.header-logo-link');

        function toggleSidebar() {
            burgerButton.classList.toggle('active');
            sidebar.classList.toggle('open');
            headerLogoLink.classList.toggle('d-none');
        }

        burgerButton.addEventListener('click', toggleSidebar);

        document.querySelectorAll('.sidebar-link').forEach((item) => {
            item.onclick = () => {
                burgerButton.classList.remove('active');
                sidebar.classList.remove('open');
                headerLogoLink.classList.remove('d-none');
                burgerButton.addEventListener('click', toggleSidebar);
            }
        });

        // function toggleSidebar() {
        //     this.classList.toggle('active');
        //     sidebar.classList.toggle('open');
        //     headerLogoLink.classList.toggle('d-none');
        // }
        //
        // burgerButton.addEventListener('click', toggleSidebar);
        //
        // document.querySelectorAll('.sidebar-link').forEach((item) => {
        //     item.onclick = () => {
        //         sidebar.classList.remove('open');
        //         burgerButton.classList.remove('active');
        //         headerLogoLink.classList.remove('d-none');
        //         burgerButton.addEventListener('click', toggleSidebar);
        //     }
        // });

        // burgerButton.addEventListener('click', function() {
        //     this.classList.toggle('active');
        //     sidebar.classList.toggle('open');
        //     headerLogoLink.classList.toggle('d-none');
        // });
        // document.querySelectorAll('.sidebar-link').forEach((item) => {
        //     item.onclick = () => {
        //         document.getElementById('sidebar').classList.remove('open');
        //         burgerButton.classList.remove('active');
        //         sidebar.classList.remove('open');
        //         headerLogoLink.classList.remove('d-none');
        //     }
        // })

        // burgerButton.addEventListener("click", function () {
        //     if (sidebar.classList.contains("open")) {
        //         sidebar.classList.remove('open');
        //         burgerButton.classList.remove('active');
        //         sidebar.classList.remove('open');
        //         headerLogoLink.classList.remove('d-none');
        //     } else {
        //             this.classList.add('active');
        //             sidebar.classList.add('open');
        //             headerLogoLink.classList.add('d-none');
        //     }
        // });


        mainLink.classList.remove('active');
        incomeExpensesLink.classList.remove('active');
        categoriesButton.classList.remove('active');
        incomeLink.classList.remove('active');
        expensesLink.classList.remove('active');
        categoriesItems.classList.add('d-none');

        if (page === 'main') {
            mainLink.classList.add('active');
        }
        if (page === 'income-expenses') {
            incomeExpensesLink.classList.add('active');
        }

        if (page === 'income') {
            incomeLink.classList.add('active');
            categoriesButton.classList.add("active");
            categoriesItems.classList.remove('d-none');
        }

        if (page === 'expenses') {
            expensesLink.classList.add('active');
            categoriesButton.classList.add("active");
            categoriesItems.classList.remove('d-none');
        }

        incomeExpensesLink.addEventListener("click", function (event) {
            event.preventDefault();
            location.href = '#/income-expenses';
        });
        mainLink.addEventListener("click", function (event) {
            event.preventDefault();
            location.href = '#/';
        });

        categoriesButton.addEventListener("click", function () {
            if (categoriesButton.classList.contains("active")) {
                categoriesButton.classList.remove("active");
                categoriesItems.classList.add('d-none');
            } else {
                categoriesButton.classList.add("active");
                categoriesItems.classList.remove('d-none');
            }
        });

        incomeLink.addEventListener("click", function (event) {
            event.preventDefault();
            location.href = '#/income';
        });
        expensesLink.addEventListener("click", function (event) {
            event.preventDefault();
            location.href = '#/expenses';
        });

    }

    static getSidebarInfo() {
        const profileElement = document.getElementById('profile');
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);


        if (userInfo && accessToken) {
            profileElement.innerText = userInfo.fullName;
        } else {
            location.href = '#/login';
        }

    }

    static async getBalance() {
        const result = await CustomHttp.request(config.host + '/balance');
        if (result) {
            document.getElementById('balance').innerText = result.balance + '$';
        } else {
            document.getElementById('balance').innerText = 'Данные о балансе недоступны';
        }
    }
}