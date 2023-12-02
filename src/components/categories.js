import {Sidebar} from "./sidebar.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Functions} from "./functions.js";

export class Categories {
    constructor(page) {
        this.categories = null;
        this.createIncomeCategoryButton = document.getElementById('create-income-category-btn');
        this.page = page;

        const typeOperations = page === 'income' ? '/categories/income' : '/categories/expense';
        const modifyCategoryRoute = page === 'income' ? '#/modify-income-category?id=' : '#/modify-expenses-category?id=';
        const createCategoryRoute = page === 'income' ? '#/create-income-category' : '#/create-expenses-category';

        Sidebar.sidebarButtons(this.page);
        this.init(typeOperations, modifyCategoryRoute);

        this.createIncomeCategoryButton.addEventListener('click', function () {
            location.href = createCategoryRoute;
        });
    }

    async init(typeOperations, modifyCategoryRoute) {
        const items = document.getElementById('items');
        const arrayItems = Array.from(items.querySelectorAll(".item"));
        const that = this;

        arrayItems.slice(0, arrayItems.length - 1).forEach(function (item) {
            item.remove();
        });

        try {
            const result = await CustomHttp.request(config.host + typeOperations);
            if (result) {
                if (result.message) {
                    throw new Error(result.message);
                }
                this.categories = result;
            }
        } catch (error) {
            console.log(error);
        }

        this.categories.forEach(function (element) {

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
        const modifyButtons = document.querySelectorAll('.modify');
        const agreeDeleteBtn = document.getElementById('agree-delete-btn');
        const disagreeDeleteBtn = document.getElementById('disagree-delete-btn');

        deleteButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const modalWindow = document.getElementById('modal');
                const dataID = button.parentNode.getAttribute('data-id');

                modalWindow.setAttribute('data-id', dataID);
                modalWindow.classList.remove('d-none');

                document.getElementById('myOverlay').classList.remove('d-none');
            });
        });

        agreeDeleteBtn.addEventListener('click', function () {
            const dataId = this.parentNode.parentNode.getAttribute('data-id');
            const path = typeOperations + '/' + dataId;
            that.deleteCategory(path);
            that.deleteUndefinedOperations();

            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');
            document.querySelector('[data-id="' + dataId + '"]').remove();

        });


        disagreeDeleteBtn.addEventListener('click', function () {
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');

        });

        modifyButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const id = this.parentNode.getAttribute('data-id');
                location.href = modifyCategoryRoute + id;
            });
        });

    }

    async deleteCategory(path) {
        return await CustomHttp.request(config.host + path, 'DELETE');
    }

    async deleteUndefinedOperations() {
        const result = await CustomHttp.request(config.host + '/operations?period=all');
        const undefinedOperations = result.filter(obj => !("category" in obj));
        undefinedOperations.forEach(function (item) {
            Functions.deleteOperation(item.id);
        })
    }

}