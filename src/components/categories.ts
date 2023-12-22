import {Sidebar} from "./sidebar";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Functions} from "./functions";
import {CategoriesType} from "../types/categories.type";
import {ErrorType} from "../types/error.type";
import {OperationsType} from "../types/operations.type";

export class Categories {
    readonly page: 'income' | 'expenses';
    private categories: CategoriesType[];
    readonly createIncomeCategoryButton: HTMLElement | null;

    constructor(page: 'income' | 'expenses') {
        this.categories = [];
        this.createIncomeCategoryButton = document.getElementById('create-income-category-btn');
        this.page = page;

        const typeOperations: string = page === 'income' ? '/categories/income' : '/categories/expense';
        const modifyCategoryRoute: string = page === 'income' ? '#/modify-income-category?id=' : '#/modify-expenses-category?id=';
        const createCategoryRoute: string = page === 'income' ? '#/create-income-category' : '#/create-expenses-category';

        Sidebar.sidebarButtons(this.page);
        this.init(typeOperations, modifyCategoryRoute);

        if (this.createIncomeCategoryButton) {
            this.createIncomeCategoryButton.addEventListener('click', function () {
                location.href = createCategoryRoute;
            });
        }
    }

    private async init(typeOperations: string, modifyCategoryRoute: string): Promise<void> {
        const items: HTMLElement | null = document.getElementById('items');
        if (items) {
            const arrayItems = Array.from(items.querySelectorAll(".item"));
            arrayItems.slice(0, arrayItems.length - 1).forEach(function (item) {
                item.remove();
            });
        }

        const that: Categories = this;

        try {
            const result: CategoriesType[] | ErrorType = await CustomHttp.request(config.host + typeOperations);
            if (result) {
                if ((result as ErrorType).error) {
                    throw new Error((result as ErrorType).message);
                }
                this.categories = result as CategoriesType[];
            }
        } catch (error) {
            console.log(error);
        }

        this.categories.forEach(function (element: CategoriesType) {
            const item: HTMLElement | null = document.createElement('div');
            item.className = 'p-3 border border-secondary rounded-3 item';
            item.setAttribute('data-id', element.id.toString());

            const title: HTMLElement | null = document.createElement('h2');
            title.innerText = element.title;

            const modifyButton: HTMLButtonElement | null = document.createElement('button');
            modifyButton.type = 'button';
            modifyButton.className = 'btn bg-primary text-white me-2 modify';
            modifyButton.innerText = 'Редактировать';


            const deleteButton: HTMLButtonElement | null = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'btn bg-danger text-white delete';
            deleteButton.innerText = 'Удалить';

            item.appendChild(title);
            item.appendChild(modifyButton);
            item.appendChild(deleteButton);

            if (items) {
                items.appendChild(item);
            }
        })

        const deleteButtons: NodeListOf<HTMLButtonElement> | null = document.querySelectorAll('.delete');
        const modifyButtons: NodeListOf<Element> | null = document.querySelectorAll('.modify');
        const agreeDeleteBtn: HTMLElement | null = document.getElementById('agree-delete-btn');
        const disagreeDeleteBtn: HTMLElement | null = document.getElementById('disagree-delete-btn');
        const myOverlay: HTMLElement | null = document.getElementById('myOverlay');
        const modalWindow: HTMLElement | null = document.getElementById('modal');

        deleteButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const dataID: string | null = (button.parentNode as HTMLElement).getAttribute('data-id');

                if (modalWindow && dataID) {
                    modalWindow.setAttribute('data-id', dataID);
                    modalWindow.classList.remove('d-none');
                }

                if (myOverlay) {
                    myOverlay.classList.remove('d-none');
                }
            });
        });

        if (agreeDeleteBtn) {
            agreeDeleteBtn.addEventListener('click', function () {
                const dataId = ((this.parentNode as HTMLElement).parentNode as HTMLElement).getAttribute('data-id');
                const path = typeOperations + '/' + dataId;
                that.deleteCategory(path);
                that.deleteUndefinedOperations();

                if (modalWindow) {
                    modalWindow.classList.add('d-none');
                }
                if (myOverlay) {
                    myOverlay.classList.add('d-none');
                }

                const selectedItem: HTMLElement | null = document.querySelector('[data-id="' + dataId + '"]');
                if (selectedItem) {
                    selectedItem.remove();
                }

            });
        }


        if (disagreeDeleteBtn) {
            disagreeDeleteBtn.addEventListener('click', function () {
                if (modalWindow) {
                    modalWindow.classList.add('d-none');
                }
                if (myOverlay) {
                    myOverlay.classList.add('d-none');
                }
            });
        }


        modifyButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const id = (button.parentNode as HTMLElement).getAttribute('data-id');
                location.href = modifyCategoryRoute + id;
            });
        });

    }

    private async deleteCategory(path: string): Promise<void> {
        return await CustomHttp.request(config.host + path, 'DELETE');
    }

    private async deleteUndefinedOperations(): Promise<void> {
        const result: OperationsType[] | null = await CustomHttp.request(config.host + '/operations?period=all');
        if (result) {
            const undefinedOperations: OperationsType[] | null = result.filter(obj => !("category" in obj));
            undefinedOperations.forEach(function (item: OperationsType) {
                Functions.deleteOperation(item.id.toString());
            })
        }
    }

}