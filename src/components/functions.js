import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Functions {
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

    static async deleteCategory(id) {
        return await CustomHttp.request(config.host + '/categories/expense/' + id, 'DELETE');
    }

    static async createCategory(type, name) {
        return await CustomHttp.request(config.host + '/categories/' + type, 'POST', {"title": name});
    }

    static inputDates() {
        const labelDateFrom = document.getElementById('label-date-from');
        labelDateFrom.addEventListener('click', function (){
            labelDateFrom.classList.add('d-none');
            const dateFromBlock = document.getElementById('date-from-block')
            const inputDateFrom = document.createElement('input');
            inputDateFrom.id = 'input-date-from';
            inputDateFrom.setAttribute("type", "date");

            dateFromBlock.appendChild(inputDateFrom);
        })

        const labelDateTo = document.getElementById('label-date-to');
        labelDateTo.addEventListener('click', function (){
            labelDateTo.classList.add('d-none');
            const dateToBlock = document.getElementById('date-to-block')
            const inputDateTo = document.createElement('input');
            inputDateTo.id = 'input-date-to';
            inputDateTo.setAttribute("type", "date");

            dateToBlock.appendChild(inputDateTo);
        })
    }
}