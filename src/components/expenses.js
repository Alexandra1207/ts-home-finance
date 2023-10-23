import {Sidebar} from "./sidebar";

export class Expenses {
    constructor() {
        this.deleteButtons = document.querySelectorAll('.delete');
        this.agreeDeleteBtn = document.getElementById('agree-delete-btn');
        this.disagreeDeleteBtn = document.getElementById('disagree-delete-btn');
        this.modifyButtons = document.querySelectorAll('.modify');
        this.createIncomeCategoryButton = document.getElementById('create-income-category-btn');


        Sidebar.sidebarButtons('expenses');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();


        const modifyButton = document.querySelectorAll('.modify');
        this.modifyButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                location.href = '#/modify-expenses-category'
            });
        });


        this.deleteButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                document.getElementById('modal').classList.remove('d-none');
                document.getElementById('myOverlay').classList.remove('d-none');
            });
        });

        this.agreeDeleteBtn.addEventListener('click', function() {
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');
        });
        this.disagreeDeleteBtn.addEventListener('click', function() {
            document.getElementById('modal').classList.add('d-none');
            document.getElementById('myOverlay').classList.add('d-none');
        });

        this.createIncomeCategoryButton.addEventListener('click', function() {
            location.href = '#/create-expenses-category'
        });

    }
}