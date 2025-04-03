import { mount, shallowMount } from "@vue/test-utils";
import { nextTick } from "process";
import ControlAsyncModal from "./ControlAsyncModal.vue";
import ControlModal from "./ControlModal.vue";

const requestData = [
  {
    IDSTATUS: 1,
    ID: 3279,
    SURL: "/cabinet/wizard/1081/55/0/1101/3279/3275D7BD5755C8FC3DB00813E6BAF5AE",
    SMESSAGE:
      "Проверяем данные в АИС Страхование, дождитесь завершения операции",
  },
];
describe("ControlAsyncModal", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ControlAsyncModal, {
      propsData: {
        data: {
          value: "Пожалуйста подождите&#8230",
          label: "Проверка данных",
          attempts: 6,
          interval: 5,
        },
      },
      mocks: {
        $store: {
          state: {
            data_card: {
              cardId: 123,
            },
          },
        },
        $router: {
          push: jest.fn(),
          go: jest.fn(),
        },
      },
      stubs: {
        "control-modal": ControlModal,
      },
    });
  });
  // TODO похоже, окружение тестирования не умеет работать с тэгом dialog. Говорит что несуществует метод showModal
  /* test("Show modal", async () => {
    wrapper = mount(ControlAsyncModal, {
      propsData: {
        data: {
          value: "Пожалуйста подождите&#8230",
          label: "Проверка данных",
          attempts: 6,
          interval: 5,
        },
      },
      mocks: {
        $store: {
          state: {
            data_card: {
              cardId: 123,
            },
          },
        },
        $router: {
          push: jest.fn(),
          go: jest.fn(),
        },
      },
      stubs: {
        'control-modal': ControlModal,
      },
    });

    expect(wrapper.find("dialog[open]").exists()).toBeFalsy();
    // console.log(wrapper.vm.openModal)
    console.log(wrapper.vm.$refs.modal.$refs.modal.showModal)
    await nextTick(() =>{});

    wrapper.vm.openModal()
    console.log(wrapper.html());
    // expect(wrapper.find("dialog[open]")).toBeTruthy();
  }); */
  test("After open must start request", async () => {
    const executeRequestMock = jest.fn();
    const modal = wrapper.findComponent(ControlModal);

    wrapper.vm.executeRequest = executeRequestMock;

    expect(wrapper.vm.executeRequest).not.toHaveBeenCalled();

    await modal.vm.$emit("open");

    expect(wrapper.vm.executeRequest).toHaveBeenCalled();
  });

  test("Success request handler", async () => {
    const executeRequestMock = jest.fn().mockReturnValue(new Promise((resolve) => { resolve({data: requestData}) }));

    wrapper.vm.executeRequest = executeRequestMock;
    await wrapper.vm.executeRequestWithTimeout();
    expect(wrapper.vm.isRequestSuccess).toBeTruthy();
  });
});
