import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config.js";

export class Sidebar {

    isBurgerInitialized = false;

    static sidebarButtons(page) {

        const mainLink = document.getElementById('main-link');
        const incomeExpensesLink = document.getElementById('income-expenses-link');
        const categoriesButton = document.getElementById("categories-btn");
        const categoriesItems = document.getElementById('categories-items');
        const incomeLink = document.getElementById("income-link");
        const expensesLink = document.getElementById('expenses-link');
        const logoutLink = document.getElementById('logout-link');
        const logoutModal = document.getElementById('logout-modal');
        const agreeLogoutButton = document.getElementById('agree-logout-btn');
        const cancelLogoutButton = document.getElementById('cancel-logout-btn');

        const burgerButton = document.querySelector('.burger-btn');
        const sidebar = document.querySelector('.sidebar');
        const headerLogoLink = document.querySelector('.header-logo-link');

        if (!this.isBurgerInitialized) {
            burgerButton.addEventListener('click', function () {
                burgerButton.classList.toggle('active');
                sidebar.classList.toggle('open');
                headerLogoLink.classList.toggle('d-none');
            });
            this.isBurgerInitialized = true;
        }


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
            sidebar.classList.remove('open');
            burgerButton.classList.remove('active');
            headerLogoLink.classList.remove('d-none');
            location.href = '#/income-expenses';
        });
        mainLink.addEventListener("click", function (event) {
            event.preventDefault();
            sidebar.classList.remove('open');
            burgerButton.classList.remove('active');
            headerLogoLink.classList.remove('d-none');
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
            sidebar.classList.remove('open');
            burgerButton.classList.remove('active');
            headerLogoLink.classList.remove('d-none');
            location.href = '#/income';
        });
        expensesLink.addEventListener("click", function (event) {
            event.preventDefault();
            sidebar.classList.remove('open');
            burgerButton.classList.remove('active');
            headerLogoLink.classList.remove('d-none');
            location.href = '#/expenses';
        });

        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            logoutModal.classList.remove('d-none');
            document.getElementById('sidebarOverlay').classList.remove('d-none');
        })

        agreeLogoutButton.addEventListener("click", function () {
            location.href = '#/logout';
            logoutModal.classList.add('d-none');
            document.getElementById('sidebarOverlay').classList.add('d-none');
        })

        cancelLogoutButton.addEventListener("click", function () {
            logoutModal.classList.add('d-none');
            document.getElementById('sidebarOverlay').classList.add('d-none');
        })

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
        const balanceModal = document.getElementById('balance-modal');
        const balance = document.getElementById('balance');
        const agreeBalanceButton = document.getElementById('agree-balance-btn')
        const cancelBalanceButton = document.getElementById('cancel-balance-btn')
        const newBalance = document.getElementById('new-balance');


        const result = await CustomHttp.request(config.host + '/balance');
        if (result) {
            balance.innerText = result.balance + '$';
        } else {
            balance.innerText = 'Данные о балансе недоступны';
        }

        balance.addEventListener('click', function () {
            balanceModal.classList.remove('d-none');
            document.getElementById('sidebarOverlay').classList.remove('d-none');
        });

        cancelBalanceButton.addEventListener('click', function () {
            balanceModal.classList.add('d-none');
            document.getElementById('sidebarOverlay').classList.add('d-none');
        });

        agreeBalanceButton.addEventListener('click', function () {
            if (newBalance.value) {
                sendData();
                balance.innerText = newBalance.value + '$';
                balanceModal.classList.add('d-none');
                document.getElementById('sidebarOverlay').classList.add('d-none');
            }
        });

        async function sendData() {

            await CustomHttp.request(config.host + '/balance', 'PUT', {
                newBalance: newBalance.value
            });
        }
    }
}