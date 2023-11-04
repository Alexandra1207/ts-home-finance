import {Sidebar} from "./sidebar";

export class ModifyIncomeCategory {
    constructor() {
        this.saveButton = document.getElementById('save');
        this.cancelButton = document.getElementById('cancel');
        // this.routeParams = getQueryParams();

        // console.log(document.location.hash.split('+').join(' '));

        Sidebar.sidebarButtons('income');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();

        this.saveButton.addEventListener('click', function() {
            location.href = '#/income'
        });
        this.cancelButton.addEventListener('click', function() {
            location.href = '#/income'
        });
    }

    // getQueryParams() {
    //     const qs = document.location.hash.split('+').join(' ');
    //
    //     let params = {},
    //         tokens,
    //         re = /[?&]([^=]+)=([^&]*)/g;
    //
    //     while (tokens = re.exec(qs)) {
    //         params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    //     }
    //
    //     return params;
    // }
}