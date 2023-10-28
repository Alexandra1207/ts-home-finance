import {Sidebar} from "./sidebar";
import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http";


export class Income {
    constructor() {
        this.income = null;
        this.agreeDeleteBtn = document.getElementById('agree-delete-btn');
        this.disagreeDeleteBtn = document.getElementById('disagree-delete-btn');
        this.deleteButtons = document.querySelectorAll('.delete');
        this.modifyButtons = document.querySelectorAll('.modify');
        this.createIncomeCategoryButton = document.getElementById('create-income-category-btn');

        Sidebar.sidebarButtons('income');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();

        this.init();

        this.deleteButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                document.getElementById('modal').classList.remove('d-none');
                document.getElementById('myOverlay').classList.remove('d-none');
            });
        });

        this.agreeDeleteBtn.addEventListener('click', function () {
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');
        });
        this.disagreeDeleteBtn.addEventListener('click', function () {
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');
        });

        this.modifyButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                location.href = '#/modify-income-category'
            });
        });

        this.createIncomeCategoryButton.addEventListener('click', function () {
            location.href = '#/create-income-category'
        });

    }

    async init() {

        // try {
        const result = await CustomHttp.request(config.host + '/categories/income');
        console.log(result);
        this.income = result;
        //     if (result) {
        //         if (result.error) {
        //             throw new Error(result.error);
        //         }
        //
        //         this.quiz = result;
        //     }
        // } catch (error) {
        //     console.log(error);
        // }

        // document.getElementById('person').innerHTML = 'Тест выполнил <span>' + userInfo.fullName + ', ' + userInfo.email + '</span>';
        // this.showAnswers();
        //
        // document.getElementById('return-result').onclick = function () {
        //     location.href = '#/result?id=' + that.routeParams.id;
        // }
    }

    showIncome() {

    }


}