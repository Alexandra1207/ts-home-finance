import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {
    constructor(page) {
        this.rememberMe = false;
        this.processElement = null;
        this.page = page;

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];


        if (this.page === 'signup') {
            this.fields.unshift({
                name: 'name',
                id: 'name',
                element: null,
                regex: /^([А-ЯЁ][а-яё]+)\s([А-ЯЁ][а-яё]+)(\s[А-ЯЁ][а-яё]+)*$/,
                valid: false,
            });
            this.fields.push({
                name: 'confirm-password',
                id: 'confirm-password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            })
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }

    }

    validateField(field, element) {

        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            element.parentElement.nextElementSibling.classList.remove('d-none');
            field.valid = false;
        }

        else {
            element.removeAttribute('style');
            element.parentElement.nextElementSibling.classList.add('d-none');
            field.valid = true;
        }
        this.validateForm();
    }

    matchPasswords() {
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirm-password");
        if (password.value !== confirmPassword.value && confirmPassword.value) {
            password.style.borderColor = 'red';
            confirmPassword.style.borderColor = 'red';
            return false;
        } else {
            password.removeAttribute('style');
            confirmPassword.removeAttribute('style');
            return true;
        }
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        const isValid = (this.page === 'signup') ? this.matchPasswords() && validForm : validForm;
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }


    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            const rememberMe = this.page === 'signup' ? false : document.getElementById('remember-me').checked;

            if (this.page === 'signup') {
                try {
                    const fullName = this.fields.find(item => item.name === 'name').element.value;
                    const [name, lastName] = fullName.split(' ');

                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'confirm-password').element.value,
                    })
                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }

                    }

                } catch (error) {
                    return console.log(error);
                }

            }
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                })

                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message);
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name + ' ' + result.user.lastName,
                        userId: result.user.id,
                        rememberMe: rememberMe
                    })
                    location.href = '#/'
                }

            } catch (error) {
                return console.log(error);
            }
        }
    }
}
