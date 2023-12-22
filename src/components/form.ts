import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import config from "../../config/config";
import {FormFieldType} from "../types/form-field.type";
import {SignupResponseType} from "../types/signup-response.type";
import {LoginResponseType} from "../types/login-response.type";
import {ErrorType} from "../types/error.type";

export class Form {
    private rememberMe: boolean;
    readonly processElement: HTMLElement | null;
    readonly page: "signup" | "login";
    private fields: FormFieldType[];

    constructor(page: "signup" | "login") {
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

        const that: Form = this;
        this.fields.forEach((item: FormFieldType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, <HTMLInputElement>this);
                }
            }

        });

        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            }
        }
    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        if (element.parentElement) {
            if (!element.value || !element.value.match(field.regex)) {
                element.style.borderColor = 'red';
                if (element.parentElement.nextElementSibling) {
                    element.parentElement.nextElementSibling.classList.remove('d-none');
                }
                field.valid = false;
            } else {
                element.removeAttribute('style');
                if (element.parentElement.nextElementSibling) {
                    element.parentElement.nextElementSibling.classList.add('d-none');
                }
                field.valid = true;
            }
        }

        this.validateForm();
    }

    private matchPasswords(): boolean {
        const password = document.getElementById("password") as HTMLInputElement;
        const confirmPassword = document.getElementById("confirm-password") as HTMLInputElement;
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

    private validateForm(): boolean {
        const validForm: boolean = this.fields.every(item => item.valid);
        const isValid: boolean = (this.page === 'signup') ? this.matchPasswords() && validForm : validForm;
        if (this.processElement) {
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }
        return isValid;
    }


    private async processForm(): Promise<void> {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email')?.element?.value;
            const password = this.fields.find(item => item.name === 'password')?.element?.value;
            const rememberMe = this.page === 'signup' ? false : (document.getElementById('remember-me') as HTMLInputElement).checked;

            if (this.page === 'signup') {
                try {
                    const fullName = this.fields.find(item => item.name === 'name')?.element?.value;
                    let name: string | undefined = "";
                    let lastName: string | undefined = "";
                    if (fullName) {
                        [name, lastName] = fullName.split(' ');
                    }

                    const result: SignupResponseType | ErrorType = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'confirm-password')?.element?.value,
                    })
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }

                    }

                } catch (error) {
                    console.log(error);
                    return;
                }

            }
            try {
                const result: LoginResponseType | ErrorType = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                })

                if (result) {
                    if ((result as ErrorType).error) {
                        throw new Error((result as ErrorType).message);
                    }
                    Auth.setTokens((result as LoginResponseType).tokens.accessToken, (result as LoginResponseType).tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: (result as LoginResponseType).user.name + ' ' + (result as LoginResponseType).user.lastName,
                        userId: (result as LoginResponseType).user.id,
                        rememberMe: rememberMe
                    })
                    location.href = '#/'
                }

            } catch (error) {
                console.log(error);
                return;
            }
        }
    }
}
