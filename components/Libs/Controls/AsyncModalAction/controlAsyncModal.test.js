import { mount } from "@vue/test-utils";
import axios from "axios";
import ControlAsyncModal from "./ControlAsyncModal.vue";
import ControlModal from "./ControlModal.vue";
import { testData } from "./controlAsyncModal.testData";

jest.mock("axios");
AbortSignal.timeout = (ms) => {
  const controller = new AbortController();

  setTimeout(() => controller.abort(new DOMException("TimeoutError")), ms);

  return controller.signal;
};

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
          getters: {
            "data_card/getBodyForm": {
              cardId: 123
            },
          }
        },
        $router: {
          push: jest.fn(),
          go: jest.fn(),
        },
        $axios: axios,
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

  test("Success request with success status", async () => {
    axios.post.mockResolvedValue({ data: [testData.succesaData] });

    await wrapper.vm.executeRequest();

    await wrapper.vm.executeRequest().then(() => {
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.isRequestSuccess).toBeTruthy();
      })
    });
  });

  test("Error status for request", async () => {
    axios.post.mockRejectedValue({ data: [testData.rejectData] });

    await wrapper.vm.executeRequest().catch(() => {
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.isRequestError).toBeTruthy();
      })
    });
  });

  test("Error status if attempts is end", async () => {
    wrapper.setProps({
      data: {
        value: "Пожалуйста подождите&#8230",
        label: "Проверка данных",
        attempts: 0,
      },
    });
    axios.post.mockResolvedValue({ data: [testData.rejectData] });

    wrapper.vm.executeRequestWithTimeout(0);

    expect(wrapper.vm.isRequestError).toBeTruthy();
  });
});
