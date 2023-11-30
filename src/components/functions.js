import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Functions {

    static initOperations(handleButtonClick) {
        const buttons = document.querySelectorAll('.btn');

        Functions.inputDates();

        buttons.forEach((button) => {
            button.addEventListener('click', () => {

                buttons.forEach((btn) => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                handleButtonClick(button);
            });
        });

    }

    static returnLabelDates() {
        const inputDateFrom = document.getElementById('input-date-from');
        const inputDateTo = document.getElementById('input-date-to');
        const labelDateFrom = document.getElementById('label-date-from');
        const labelDateTo = document.getElementById('label-date-to');

        if (inputDateFrom) {
            inputDateFrom.remove();
        }

        if (inputDateTo) {
            inputDateTo.remove();
        }

        labelDateFrom.classList.remove('d-none', 'text-danger', 'border-danger');
        labelDateTo.classList.remove('d-none', 'text-danger', 'border-danger');
    }


    static getIntervalPeriod() {
        const inputDateFrom = document.getElementById('input-date-from');
        const inputDateTo = document.getElementById('input-date-to');

        if (inputDateFrom && inputDateTo && inputDateFrom.value && inputDateTo.value) {
            return '/operations?period=interval&dateFrom=' + inputDateFrom.value + '&dateTo=' + inputDateTo.value;
        } else {
            this.validateDateInputs();
            return null;
        }

    }

    static validateDateInputs() {
        const inputDateFrom = document.getElementById('input-date-from');
        const inputDateTo = document.getElementById('input-date-to');
        const labelDateFrom = document.getElementById('label-date-from');
        const labelDateTo = document.getElementById('label-date-to');

        if (!inputDateFrom || !inputDateTo) {
            labelDateFrom.classList.add('text-danger');
            labelDateFrom.classList.add('border-danger');
            labelDateTo.classList.add('text-danger');
            labelDateTo.classList.add('border-danger');
        }
        if (inputDateFrom || inputDateTo) {
            if (!inputDateFrom && !inputDateTo.value) {
                labelDateFrom.classList.add('text-danger');
                labelDateFrom.classList.add('border-danger');
                inputDateTo.classList.add('border-danger');
            } else if (!inputDateTo && !inputDateFrom.value) {
                labelDateTo.classList.add('text-danger');
                labelDateTo.classList.add('border-danger');
                inputDateFrom.classList.add('border-danger');
            } else if (!inputDateFrom.value && !inputDateTo.value) {
                inputDateFrom.classList.add('border-danger');
                inputDateTo.classList.add('border-danger');
            }
        }

    }

    static async initCategoryItems(typeOperations, modifyCategory) {
        const items = document.getElementById('items');
        const arrayItems = Array.from(items.querySelectorAll(".item"));
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
            console.log(dataId);
            // const link = typeOperations + '/';
            // console.log(link);
            // Functions.deleteCategory(dataId);
            const path = typeOperations + '/' + dataId;
            console.log(config.host + path);
            Functions.deleteCategory(path);
            Functions.deleteUndefinedOperations();
            // await CustomHttp.request(config.host + typeOperations + '/' + dataId, 'DELETE');

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
                location.href = modifyCategory + id;
            });
        });

    }

    static async deleteUndefinedOperations() {
        const that = this;
        const result = await CustomHttp.request(config.host + '/operations?period=all');
        const undefinedOperations = result.filter(obj => !("category" in obj));
        undefinedOperations.forEach(function (item) {
            that.deleteOperation(item.id);
        })
    }

    static async deleteOperation(id) {
        return await CustomHttp.request(config.host + '/operations/' + id, 'DELETE');
    }

    // static async deleteCategory(link, id) {
    //     return await CustomHttp.request(config.host + link + id, 'DELETE');
    // }
    // static async deleteCategory(id) {
    //     return await CustomHttp.request(config.host + '/categories/expense/' + id, 'DELETE');
    // }
    static async deleteCategory(path) {
        return await CustomHttp.request(config.host + path, 'DELETE');
    }

    // static async deleteCategory(typeOperations, id) {
    //     console.log(typeOperations);
    //     return await CustomHttp.request(config.host + typeOperations + '/' + id, 'DELETE');
    // }

    static async createCategory(type, name) {
        return await CustomHttp.request(config.host + '/categories/' + type, 'POST', {"title": name});
    }

    static inputDates() {
        const labelDateFrom = document.getElementById('label-date-from');
        labelDateFrom.addEventListener('click', function () {
            labelDateFrom.classList.add('d-none');
            const dateFromBlock = document.getElementById('date-from-block')
            const inputDateFrom = document.createElement('input');
            inputDateFrom.id = 'input-date-from';
            inputDateFrom.setAttribute("type", "date");

            dateFromBlock.appendChild(inputDateFrom);
        })

        const labelDateTo = document.getElementById('label-date-to');
        labelDateTo.addEventListener('click', function () {
            labelDateTo.classList.add('d-none');
            const dateToBlock = document.getElementById('date-to-block')
            const inputDateTo = document.createElement('input');
            inputDateTo.id = 'input-date-to';
            inputDateTo.setAttribute("type", "date");

            dateToBlock.appendChild(inputDateTo);
        })
    }

}