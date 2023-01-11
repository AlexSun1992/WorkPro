import { createLocalVue, mount } from "@vue/test-utils";
import axios from "axios";
import Cookies from "js-cookie";
import LoginButton from "./LoginButton.vue";
import Vuex from "vuex";

jest.mock("js-cookie");

describe("LoginButton", () => {
    let wrapper;

    const createComponent = () => {
        wrapper = mount(LoginButton, {
            mocks: {
                $store: { commit: () => null },
            },
        });
    };

    afterEach(() => {
        wrapper.destroy();
    });

    it("Должна отображаться ссылка на 'Другие полисы'", async() => {
        createComponent();

        const getButton = await wrapper.find(".btn");

        await wrapper.find(".btn").trigger("click");
        await getButton.trigger("click");

        expect(wrapper.text()).toContain("Другие полисы");
    });

    it("Отображение 'Личный кабинет' при отсутствии авторизации", () => {
        createComponent();
        const getBtnText = wrapper.find("#unauthentificated-btn > button").text();
        expect(getBtnText).toBe("Личный кабинет");
    });

    it("Должна отображаться ссылка на 'Другие полисы'", () => {
        const getLinksList = LoginButton.computed.getNavigationList.call();
        expect(getLinksList).toEqual(["ОСАГО", "Другие полисы"]);
    });

    it("Проверяем замокивание localStorage", () => {
        Cookies.get.mockImplementation(() => "token");
        const result =
            '{"STHIRDNAME":"Николаевич","DBIRTHDATE":"1992-01-09 00:00:00.0","SPHONE":"9032374418","SUSERNAME":"9032374418","SFIRSTNAME":"Алексей","ID":968441,"BSEX":1,"SEMAIL":"mgafk1992@mail.ru","NPROFILEFULLNESS":90,"SSECONDNAME":"Гаврилов","IDAUTHTYPE":2,"IDMEDPARTNER":6046398}';
        window.localStorage.setItem("USER_INFO", result);

        expect(window.localStorage.getItem("USER_INFO")).toEqual(result);
    });

    it("Отображение имени владельца личного кабинета", () => {
        Cookies.get.mockImplementation(() => "token");
        const result =
            '{"STHIRDNAME":"Николаевич","DBIRTHDATE":"1992-01-09 00:00:00.0","SPHONE":"9032374418","SUSERNAME":"9032374418","SFIRSTNAME":"Алексей","ID":968441,"BSEX":1,"SEMAIL":"mgafk1992@mail.ru","NPROFILEFULLNESS":90,"SSECONDNAME":"Гаврилов","IDAUTHTYPE":2,"IDMEDPARTNER":6046398}';
        window.localStorage.setItem("USER_INFO", result);
        createComponent();

        const getBtnText = wrapper.find("#authentificated-btn > button").text();

        const getObject = JSON.parse(result);
        const getName = getObject.SFIRSTNAME;
        const getSurName = getObject.SSECONDNAME;
        const getFullName = getName + " " + getSurName;

        expect(getBtnText).toEqual(getFullName);
    });

    it("Должна отображаться ссылка на 'Главная'", async() => {
        Cookies.get.mockImplementation(() => "token");
        const result =
            '{"STHIRDNAME":"Николаевич","DBIRTHDATE":"1992-01-09 00:00:00.0","SPHONE":"9032374418","SUSERNAME":"9032374418","SFIRSTNAME":"Алексей","ID":968441,"BSEX":1,"SEMAIL":"mgafk1992@mail.ru","NPROFILEFULLNESS":90,"SSECONDNAME":"Гаврилов","IDAUTHTYPE":2,"IDMEDPARTNER":6046398}';
        window.localStorage.setItem("USER_INFO", result);
        createComponent();
        Object.defineProperty(window, "location", {
            value: {
                href: "http://localhost:8000/cabinet/55/0/701",
            },
            configurable: true,
        });
        await wrapper.find(".dropdown-item").trigger("click");
        expect(wrapper.text()).toContain("Личный кабинет");
    });

    it("Должен отображаться список из 3 элементов", () => {
        Cookies.get.mockImplementation(() => "token");
        const result =
            '{"STHIRDNAME":"Николаевич","DBIRTHDATE":"1992-01-09 00:00:00.0","SPHONE":"9032374418","SUSERNAME":"9032374418","SFIRSTNAME":"Алексей","ID":968441,"BSEX":1,"SEMAIL":"mgafk1992@mail.ru","NPROFILEFULLNESS":90,"SSECONDNAME":"Гаврилов","IDAUTHTYPE":2,"IDMEDPARTNER":6046398}';

        window.localStorage.setItem("USER_INFO", result);
        const getLinksList = LoginButton.computed.getNavigationList.call();

        expect(getLinksList).toEqual(["Личный кабинет", "ОСАГО", "Выйти"]);
    });

    it("Пытаемся найти кнопку (Никак не получается отловить событие нажатия на кнопку)", async() => {
        createComponent();
        await wrapper.find(".btn").trigger("click");
        const getPopup = await wrapper.find(".dropdown-menu");
    });
});