export interface IUser {
    login: string | number;
    user_type: string;
    password: string | number;
    recaptcha_token: string;
}