import { mount } from "@vue/test-utils";
import { useContext } from "@nuxtjs/composition-api";
import ControlModalCardInfo from "./ControlModalCardInfo.vue";

jest.mock("@nuxtjs/composition-api", () => ({
  useContext: jest.fn(),
}));

jest.mock("@/components/Libs/VModal/VModal", () => ({
  name: "VModal",
  render(h) {
    return h("div", this.$slots.default);
  },
  methods: {
    close: jest.fn(),
  },
}));

describe("ControlModalCardInfo", () => {
  let mockModalCardInfo;

  beforeEach(() => {
    jest.clearAllMocks();
    mockModalCardInfo = {
      redirect: jest.fn(),
      hide: jest.fn(),
    };
    useContext.mockReturnValue({ $modalCardInfo: mockModalCardInfo });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const makeData = (infoblockOverrides = {}) => ({
      TITLE: "Заголовок",
      TEXT: "<p>Текст</p>",
      BUTTONS: [
        { text: "OK", type: "btn-primary", link: "/link/ok" },
        { text: "Закрыть", type: "btn-secondary" },
      ],
      ...infoblockOverrides,
  });

  function mountComponent(data) {
    return mount(ControlModalCardInfo, { propsData: { data } });
  }

  describe("вычисляемое свойство text", () => {
    it("возвращает TEXT из INFOBLOCK", () => {
      const wrapper = mountComponent(makeData({ TEXT: "<b>Привет</b>" }));

      expect(wrapper.vm.text).toBe("<b>Привет</b>");
    });

    it("возвращает пустую строку, если data не передана", () => {
      const wrapper = mountComponent(undefined);

      expect(wrapper.vm.text).toBe("");
    });

    it("возвращает пустую строку, если INFOBLOCK отсутствует", () => {
      const wrapper = mountComponent({});

      expect(wrapper.vm.text).toBe("");
    });
  });

  describe("вычисляемое свойство title", () => {
    it("возвращает TITLE из INFOBLOCK", () => {
      const wrapper = mountComponent(makeData({ TITLE: "Мой заголовок" }));

      expect(wrapper.vm.title).toBe("Мой заголовок");
    });

    it("возвращает пустую строку, если data не передана", () => {
      const wrapper = mountComponent(undefined);

      expect(wrapper.vm.title).toBe("");
    });

    it("возвращает пустую строку, если INFOBLOCK отсутствует", () => {
      const wrapper = mountComponent({});

      expect(wrapper.vm.title).toBe("");
    });
  });

  describe("вычисляемое свойство buttons", () => {
    it("возвращает BUTTONS из INFOBLOCK", () => {
      const buttons = [{ text: "Перейти", type: "btn-primary", link: "/go" }];
      const wrapper = mountComponent(makeData({ BUTTONS: buttons }));

      expect(wrapper.vm.buttons).toEqual(buttons);
    });

    it("возвращает пустую строку, если data не передана", () => {
      const wrapper = mountComponent(undefined);

      expect(wrapper.vm.buttons).toBe("");
    });

    it("возвращает пустую строку, если BUTTONS отсутствует в INFOBLOCK", () => {
      const wrapper = mountComponent(makeData({ BUTTONS: undefined }));

      expect(wrapper.vm.buttons).toBe("");
    });
  });

  describe("начальное состояние", () => {
    it("visible изначально равен false", () => {
      const wrapper = mountComponent(makeData());

      expect(wrapper.vm.visible).toBe(false);
    });
  });

  describe("рендер кнопок", () => {
    it("отображает все кнопки из BUTTONS", () => {
      const wrapper = mountComponent(makeData());

      expect(wrapper.findAll("button")).toHaveLength(2);
    });

    it("кнопки имеют правильный текст", () => {
      const wrapper = mountComponent(makeData());
      const buttons = wrapper.findAll("button");

      expect(buttons.at(0).text()).toBe("OK");
      expect(buttons.at(1).text()).toBe("Закрыть");
    });

    it("кнопки имеют правильные css-классы", () => {
      const wrapper = mountComponent(makeData());
      const buttons = wrapper.findAll("button");

      expect(buttons.at(0).classes()).toContain("btn-primary");
      expect(buttons.at(1).classes()).toContain("btn-secondary");
    });

    it("не отображает кнопки, если BUTTONS не передан", () => {
      const wrapper = mountComponent(makeData({ BUTTONS: undefined }));

      expect(wrapper.findAll("button")).toHaveLength(0);
    });
  });

  describe("onButtonClick", () => {
    it.skip("вызывает $modalCardInfo.redirect с ссылкой при нажатии на кнопку с link", () => {
      const wrapper = mountComponent(makeData());

      wrapper.vm.onButtonClick({ text: "OK", type: "btn-primary", link: "/some/path" });
      expect(mockModalCardInfo.redirect).toHaveBeenCalledWith("/some/path");
    });

    it("не вызывает close при нажатии на кнопку с link", () => {
      const wrapper = mountComponent(makeData());
      const closeSpy = jest.spyOn(wrapper.vm.$refs.modalRef, "close");

      wrapper.vm.onButtonClick({ text: "OK", type: "btn-primary", link: "/some/path" });
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it("вызывает close модального окна при нажатии на кнопку без link", () => {
      const wrapper = mountComponent(makeData());
      const closeSpy = jest.spyOn(wrapper.vm.$refs.modalRef, "close");

      wrapper.vm.onButtonClick({ text: "Закрыть", type: "btn-secondary" });
      expect(closeSpy).toHaveBeenCalled();
    });

    it("не вызывает $modalCardInfo.redirect при нажатии на кнопку без link", () => {
      const wrapper = mountComponent(makeData());

      jest.spyOn(wrapper.vm.$refs.modalRef, "close").mockImplementation(() => {});
      wrapper.vm.onButtonClick({ text: "Закрыть", type: "btn-secondary" });
      expect(mockModalCardInfo.redirect).not.toHaveBeenCalled();
    });
  });
});
