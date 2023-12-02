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

    static async deleteOperation(id) {
        return await CustomHttp.request(config.host + '/operations/' + id, 'DELETE');
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

    static async typeRequest(type) {
        const result = await CustomHttp.request(config.host + type);
        result.forEach(item => {
            const optionElement = document.createElement('option');
            optionElement.value = item.id;
            optionElement.text = item.title;
            document.getElementById('select-category').appendChild(optionElement);
        });
    }
}