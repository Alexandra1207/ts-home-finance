import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UserInfoType} from "../types/user-info.type";
import {BalanceType} from "../types/balance.type";
import {ErrorType} from "../types/error.type";

export class Sidebar {
    private static isBurgerInitialized: Boolean = false;

    public static sidebarButtons(page: 'main' | 'income-expenses' | 'expenses' | 'income'): void {

        const mainLink: HTMLElement | null = document.getElementById('main-link');
        const incomeExpensesLink: HTMLElement | null = document.getElementById('income-expenses-link');
        const categoriesButton: HTMLButtonElement | null = document.getElementById("categories-btn") as HTMLButtonElement;
        const categoriesItems: HTMLElement | null = document.getElementById('categories-items');
        const incomeLink: HTMLElement | null = document.getElementById("income-link");
        const expensesLink: HTMLElement | null = document.getElementById('expenses-link');
        const logoutLink: HTMLElement | null = document.getElementById('logout-link');
        const logoutModal: HTMLElement | null = document.getElementById('logout-modal');
        const agreeLogoutButton: HTMLButtonElement | null = document.getElementById('agree-logout-btn') as HTMLButtonElement;
        const cancelLogoutButton: HTMLButtonElement | null = document.getElementById('cancel-logout-btn') as HTMLButtonElement;

        const burgerButton: HTMLButtonElement | null = document.querySelector('.burger-btn');
        const sidebar: HTMLElement | null = document.querySelector('.sidebar');
        const headerLogoLink: HTMLElement | null = document.querySelector('.header-logo-link');
        const sidebarOverlay: HTMLElement | null = document.getElementById('sidebarOverlay');

        if (!this.isBurgerInitialized) {
            (burgerButton as HTMLButtonElement).addEventListener('click', function () {
                (burgerButton as HTMLButtonElement).classList.toggle('active');
                (sidebar as HTMLElement).classList.toggle('open');
                (headerLogoLink as HTMLElement).classList.toggle('d-none');
            });
            this.isBurgerInitialized = true;
        }


        (mainLink as HTMLElement).classList.remove('active');
        (incomeExpensesLink as HTMLElement).classList.remove('active');
        (categoriesButton as HTMLButtonElement).classList.remove('active');
        (incomeLink as HTMLElement).classList.remove('active');
        (expensesLink as HTMLElement).classList.remove('active');
        (categoriesItems as HTMLElement).classList.add('d-none');

        if (page === 'main' && mainLink) {
            mainLink.classList.add('active');
        }
        if (page === 'income-expenses' && incomeExpensesLink) {
            incomeExpensesLink.classList.add('active');
        }

        if (page === 'income' && incomeLink && categoriesItems) {
            incomeLink.classList.add('active');
            categoriesButton.classList.add("active");
            categoriesItems.classList.remove('d-none');
        }

        if (page === 'expenses' && expensesLink && categoriesItems) {
            expensesLink.classList.add('active');
            categoriesButton.classList.add("active");
            categoriesItems.classList.remove('d-none');
        }

        (incomeExpensesLink as HTMLElement).addEventListener("click", function (event: MouseEvent) {
            event.preventDefault();
            (sidebar as HTMLElement).classList.remove('open');
            (burgerButton as HTMLButtonElement).classList.remove('active');
            (headerLogoLink as HTMLElement).classList.remove('d-none');
            location.href = '#/income-expenses';
        });

        (mainLink as HTMLElement).addEventListener("click", function (event: MouseEvent) {
            event.preventDefault();
            (sidebar as HTMLElement).classList.remove('open');
            (burgerButton as HTMLButtonElement).classList.remove('active');
            (headerLogoLink as HTMLElement).classList.remove('d-none');
            location.href = '#/';
        });

        (categoriesButton as HTMLButtonElement).addEventListener("click", function () {
            if (categoriesButton.classList.contains("active")) {
                categoriesButton.classList.remove("active");
                (categoriesItems as HTMLElement).classList.add('d-none');
            } else {
                categoriesButton.classList.add("active");
                (categoriesItems as HTMLElement).classList.remove('d-none');
            }
        });

        (incomeLink as HTMLElement).addEventListener("click", function (event: MouseEvent) {
            event.preventDefault();
            if (sidebar && burgerButton && headerLogoLink) {
                sidebar.classList.remove('open');
                burgerButton.classList.remove('active');
                headerLogoLink.classList.remove('d-none');
                location.href = '#/income';
            }
        });

        (expensesLink as HTMLElement).addEventListener("click", function (event: MouseEvent) {
            event.preventDefault();
            if (sidebar && burgerButton && headerLogoLink) {
                sidebar.classList.remove('open');
                burgerButton.classList.remove('active');
                headerLogoLink.classList.remove('d-none');
                location.href = '#/expenses';
            }
        });

        (logoutLink as HTMLElement).addEventListener("click", function (event: MouseEvent) {
            event.preventDefault();
            (logoutModal as HTMLElement).classList.remove('d-none');
            (sidebarOverlay as HTMLElement).classList.remove('d-none');
        })

        agreeLogoutButton.addEventListener("click", function () {
            if (logoutModal && sidebarOverlay) {
                logoutModal.classList.add('d-none');
                sidebarOverlay.classList.add('d-none');
                location.href = '#/logout';
            }
        })

        cancelLogoutButton.addEventListener("click", function () {
            if (logoutModal && sidebarOverlay) {
                logoutModal.classList.add('d-none');
                sidebarOverlay.classList.add('d-none');
            }
        })

    }

    public static getSidebarInfo(): void {
        const profileElement: HTMLElement | null = document.getElementById('profile');
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if ((userInfo as UserInfoType) && (accessToken as string)) {
            (profileElement as HTMLElement).innerText = (userInfo as UserInfoType).fullName;
        } else {
            location.href = '#/login';
        }
    }


    public static async getBalance(): Promise<void> {
        const balanceModal: HTMLElement | null = document.getElementById('balance-modal');
        const balance: HTMLElement | null = document.getElementById('balance');
        const agreeBalanceButton: HTMLButtonElement | null = document.getElementById('agree-balance-btn') as HTMLButtonElement;
        const cancelBalanceButton: HTMLButtonElement | null  = document.getElementById('cancel-balance-btn') as HTMLButtonElement;
        const newBalance: HTMLInputElement | null = document.getElementById('new-balance') as HTMLInputElement;
        const sidebarOverlay: HTMLElement | null = document.getElementById('sidebarOverlay');


        const result: BalanceType | ErrorType = await CustomHttp.request(config.host + '/balance');
        if (result as BalanceType && balance) {
            balance.innerText = (result as BalanceType).balance + '$';
        } else {
            (balance as HTMLElement).innerText = 'Данные о балансе недоступны';
        }

        (balance as HTMLElement).addEventListener('click', function () {
            (balanceModal as HTMLElement).classList.remove('d-none');
            (sidebarOverlay as HTMLElement).classList.remove('d-none');
        });

        cancelBalanceButton.addEventListener('click', function () {
            (balanceModal as HTMLElement).classList.add('d-none');
            (sidebarOverlay as HTMLElement).classList.add('d-none');
        });

        agreeBalanceButton.addEventListener('click', function () {
            if ((newBalance as HTMLInputElement).value) {
                sendData();
                (balance as HTMLElement).innerText = newBalance.value + '$';
                (balanceModal as HTMLElement).classList.add('d-none');
                (sidebarOverlay as HTMLElement).classList.add('d-none');
            }
        });

        async function sendData() {

            await CustomHttp.request(config.host + '/balance', 'PUT', {
                newBalance: (newBalance as HTMLInputElement).value
            });
        }
    }
}