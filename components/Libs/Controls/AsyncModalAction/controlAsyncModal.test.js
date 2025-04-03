import { mount, shallowMount } from "@vue/test-utils";
import { nextTick } from "process";
import ControlAsyncModal from "./ControlAsyncModal.vue";
import ControlModal from "./ControlModal.vue";

describe("ControlAsyncModal", () => {
  let wrapper;
// TODO похоже, окружение тестирования не умеет работать с тэгом dialog. Не вызывается метод showModal
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
    const executeRequestMock = jest.fn();
    const modal = wrapper.findComponent(ControlModal);

    wrapper.vm.executeRequest = executeRequestMock;

    expect(wrapper.vm.executeRequest).not.toHaveBeenCalled();

    await modal.vm.$emit("open");

    expect(wrapper.vm.executeRequest).toHaveBeenCalled();
  });
});
