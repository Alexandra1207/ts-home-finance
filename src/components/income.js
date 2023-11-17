import {Sidebar} from "./sidebar";
import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http.js";
import {Functions} from "./functions.js";


export class Income {
    constructor() {
        this.income = null;
        this.agreeDeleteBtn = document.getElementById('agree-delete-btn');
        this.disagreeDeleteBtn = document.getElementById('disagree-delete-btn');
        this.createIncomeCategoryButton = document.getElementById('create-income-category-btn');

        Sidebar.sidebarButtons('income');

        this.init();

        this.createIncomeCategoryButton.addEventListener('click', function () {
            location.href = '#/create-income-category'
        });

    }

    async init() {

        const items = document.getElementById('items');
        const arrayItems = Array.from(items.querySelectorAll(".item"));
        arrayItems.slice(0, arrayItems.length - 1).forEach(function (item) {
            item.remove();
        });

        try {
            const result = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                if (result.message) {
                    throw new Error(result.message);
                }
                this.income = result;
            }
        } catch (error) {
            console.log(error);
        }

        this.income.forEach(function (element) {

            const item = document.createElement('div');
            item.className = 'p-3 border border-secondary rounded-3 item';
            item.setAttribute('data-id', element.id);

            const title = document.createElement('h2');
            title.innerText = element.title;

            const modifyButton = document.createElement('button');
            modifyButton.type = 'button';
            modifyButton.className = 'btn bg-primary text-white me-2 modify';
            modifyButton.innerText = 'Редактировать';


            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn bg-danger text-white delete';
            deleteButton.innerText = 'Удалить';

            item.appendChild(title);
            item.appendChild(modifyButton);
            item.appendChild(deleteButton);

            items.appendChild(item);
        })

        const deleteButtons = document.querySelectorAll('.delete');


        deleteButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const modalWindow = document.getElementById('modal');
                const dataID = button.parentNode.getAttribute('data-id');

                modalWindow.setAttribute('data-id', dataID);
                modalWindow.classList.remove('d-none');

                document.getElementById('myOverlay').classList.remove('d-none');
            });
        });


        this.agreeDeleteBtn.addEventListener('click', function () {
            const dataId = this.parentNode.parentNode.getAttribute('data-id');
            console.log(dataId);
            Functions.deleteCategory(dataId);
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');
            document.querySelector('[data-id="' + dataId + '"]').remove();

        });
        this.disagreeDeleteBtn.addEventListener('click', function () {
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');

        });

        const modifyButtons = document.querySelectorAll('.modify');
        modifyButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const id = this.parentNode.getAttribute('data-id');
                location.href = '#/modify-income-category?id=' + id;
            });
        });

    }
}

