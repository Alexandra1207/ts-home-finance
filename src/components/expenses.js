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

        // const burgerButton = document.querySelector('.burger-btn');
        // const sidebar = document.querySelector('.sidebar');
        // const headerLogoLink = document.querySelector('.header-logo-link');

        // function toggleSidebar() {
        //     if (burgerButton.classList.contains('active')) {
        //         burgerButton.classList.remove('active');
        //         sidebar.classList.remove('open');
        //         headerLogoLink.classList.remove('d-none');
        //     } else {
        //         burgerButton.classList.add('active');
        //         sidebar.classList.add('open');
        //         headerLogoLink.classList.add('d-none');
        //     }
        //
        // }
        //
        // burgerButton.addEventListener('click', toggleSidebar);


        this.modifyButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                location.href = '#/modify-expenses-category';
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
            location.href = '#/create-expenses-category';
        });

    }
}