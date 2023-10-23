export class ModifyExpenses {
    constructor() {
        this.saveButton = document.getElementById('save');
        this.cancelButton = document.getElementById('cancel');

        this.saveButton.addEventListener('click', function() {
            location.href = '#/expenses'
        });
        this.cancelButton.addEventListener('click', function() {
            location.href = '#/expenses'
        });
    }
}