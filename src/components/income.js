import {Sidebar} from "./sidebar";

export class Income {
    constructor() {

        this.agreeDeleteBtn = document.getElementById('agree-delete-btn');
        this.disagreeDeleteBtn = document.getElementById('disagree-delete-btn');
        this.deleteButtons = document.querySelectorAll('.delete');
        this.modifyButtons = document.querySelectorAll('.modify');
        this.createIncomeCategoryButton = document.getElementById('create-income-category-btn');

        Sidebar.sidebarButtons('income');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();


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

        this.modifyButtons.forEach(function(button) {
            button.addEventListener('click', function() {
               location.href = '#/modify-income-category'
            });
        });

        this.createIncomeCategoryButton.addEventListener('click', function() {
            location.href = '#/create-income-category'
        });

    }

}