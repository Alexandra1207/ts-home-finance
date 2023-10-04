import {Auth} from "../services/auth.js";
import config from "../../config/config.js";


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

    async init() {
        //Запрос баланса
        const response = await fetch(config.host + '/balance', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': localStorage.getItem(Auth.accessTokenKey)
            }
        });
        console.log(response);


        //Выход из системы
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            // return;
        }
    }

    // async getBalance() {
    //     const response = await fetch(config.host + '/balance', {
    //         method: 'GET',
    //         headers: {
    //             'Content-type': 'application/json',
    //             'Accept': 'application/json',
    //             'x-access-token': localStorage.getItem(Auth.accessTokenKey)
    //         }
    //     }, localStorage.getItem("userInfo"));
    //     // const result = await CustomHttp.request(config.host + '/balance');
    //     console.log(localStorage.getItem("userInfo"));
    // }
    //
    // async exitProfile() {
    //     const urlRoute = window.location.hash.split('?')[0];
    //     if (urlRoute === '#/logout') {
    //         await Auth.logout();
    //         window.location.href = '#/login';
    //         // return;
    //     }
    // }
}


//
// const logoutLink = document.getElementById('logout-link');
// logoutLink.addEventListener("click", function(event) {
//     event.preventDefault();
//     Auth.removeTokens();
//     localStorage.clear();
//     window.location.href = '#/login';
// });


// if (window.location.hash === '#/logout') {
//     Auth.removeTokens();
//     localStorage.clear();
//     // localStorage.removeItem(userInfo);
//     // localStorage.removeItem(Auth.accessTokenKey);
//     window.location.href = '#/login';
//     // return;
// }
