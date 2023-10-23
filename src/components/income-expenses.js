import {Sidebar} from "./sidebar.js";

export class  IncomeExpenses {
    constructor() {

        this.createIncomeButton = document.getElementById('create-income');
        this.createIncomeExpense = document.getElementById('create-expense');
        this.modifyButtons = document.querySelectorAll('.modify-btn');
        this.trashButtons = document.querySelectorAll('.trash-btn');
        this.agreeDeleteBtn = document.getElementById('agree-delete-btn');
        this.disagreeDeleteBtn = document.getElementById('disagree-delete-btn');



        Sidebar.sidebarButtons('income-expenses');
        Sidebar.getSidebarInfo();
        Sidebar.getBalance();

        this.createIncomeButton.addEventListener('click', function() {
            location.href = '#/create-expenses-income';
        });
        this.createIncomeExpense.addEventListener('click', function() {
            location.href = '#/create-expenses-income';
        });

        this.modifyButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                location.href = '#/modify-expenses-income';
            });
        });
        this.trashButtons.forEach(function(button) {
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


    }
}