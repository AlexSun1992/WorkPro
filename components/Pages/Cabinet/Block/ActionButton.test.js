import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ActionButton from "./ActionButton.vue";
import { optionModal } from "./ActionButton.helper.fixtures";

jest.mock("axios");

describe("ActionButton", () => {
  let wrapper;
  const localVue = createLocalVue();

  beforeEach(async () => {
    localVue.use(BootstrapVue);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("На странице отображается modal с текстом, переданным из конфигуратора", async () => {
    wrapper = mount(ActionButton, {
      localVue,
      propsData: {
        actionId: "38882",
        body: undefined,
        contextChanged: false,
        id: "buy_section_osago_lk2",
        insideContent: "",
        variant: "transparent",
      },
      computed: {
        action: () => ({
          ID: 38882,
          LCURWINDOW: false,
          LREQUESTCODE: true,
          SQUEST: "Test text",
          NITEM: 707,
          NTYPE: 4,
          SNAME: "Оформить новый полис ОСАГО",
        }),
      },
    });

    const spyBvModal = jest.spyOn(
      wrapper.find(".btn").vm.$bvModal,
      "msgBoxConfirm"
    );
    await wrapper.find(".btn").trigger("click");

    expect(spyBvModal).toHaveBeenCalledWith("Test text", optionModal);
  });

  it("На странице отображается modal с дефолтным текстом", async () => {
    wrapper = mount(ActionButton, {
      localVue,
      propsData: {
        actionId: "38882",
        body: undefined,
        contextChanged: false,
        id: "buy_section_osago_lk2",
        insideContent: "",
        variant: "transparent",
      },
      computed: {
        action: () => ({
          ID: 38882,
          LCURWINDOW: false,
          LREQUESTCODE: true,
          SNAME: "Оформить новый полис ОСАГО",
          SQUEST: "",
        }),
      },
    });

    const spyBvModal = jest.spyOn(
      wrapper.find(".btn").vm.$bvModal,
      "msgBoxConfirm"
    );
    await wrapper.find(".btn").trigger("click");

    expect(spyBvModal).toHaveBeenCalledWith(
      'Вы действительно хотите выполнить действие" Оформить новый полис ОСАГО"?',
      optionModal
    );
  });
});
