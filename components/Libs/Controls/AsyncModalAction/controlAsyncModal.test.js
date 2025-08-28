import { mount } from "@vue/test-utils";
import ControlAsyncModal from "./ControlAsyncModal";
import ControlModal from "./ControlModal";
import { testData, getterMock } from "./controlAsyncModal.testData";

AbortSignal.timeout = (ms) => {
  const controller = new AbortController();

  setTimeout(() => controller.abort(new DOMException("TimeoutError")), ms);

  return controller.signal;
};

describe("ControlAsyncModal request handler", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ControlAsyncModal, {
      propsData: {
        data: {
          value: "Пожалуйста подождите&#8230",
          label: "Проверка данных",
          attempts: 7,
          interval: 5,
          name: "POLICY_NSIS",
        },
      },
      data() {
        return {
          counterStart: false,
        };
      },
      mocks: {
        $store: {
          state: {
            data_card: {
              cardId: 123,
            },
          },
          getters: {
            "data_card/getBodyForm": getterMock,
          },
        },
        $router: {
          push: jest.fn(),
          go: jest.fn(),
        },
        $refs: {
          modal: {
            close() {},
          },
        },
      },
      stubs: {
        "control-modal": ControlModal,
      },
    });

    jest.spyOn(wrapper.vm, "doPostFetch");
  });

  test("After open must start request", async () => {
    const executeRequestMock = jest.fn();
    const modal = wrapper.findComponent(ControlModal);

    wrapper.vm.executeRequest = executeRequestMock;

    expect(wrapper.vm.executeRequest).not.toHaveBeenCalled();

    await modal.vm.$emit("open");

    expect(wrapper.vm.executeRequest).toHaveBeenCalled();
  });

  test("Success request with success status", async () => {
    wrapper.setData({
      counter: 10,
    });
    jest.spyOn(wrapper.vm, "afterSuccessDataCheck");

    wrapper.vm.doPostFetch.mockResolvedValueOnce(Promise.resolve({ status: 200, data: [testData.successData] }));

    expect(wrapper.vm.afterSuccessDataCheck).not.toHaveBeenCalled();

    await wrapper.vm.executeRequest();

    expect(wrapper.vm.afterSuccessDataCheck).toHaveBeenCalled();
  });

  test("Success request with wait status", async () => {
    wrapper.setData({
      counter: 10,
    });
    jest.spyOn(wrapper.vm, "afterSuccessDataCheck");

    wrapper.vm.doPostFetch.mockResolvedValueOnce(Promise.resolve({ status: 200, data: [testData.waitData] }));

    expect(wrapper.vm.afterSuccessDataCheck).not.toHaveBeenCalled();

    await wrapper.vm.executeRequest();

    expect(wrapper.vm.afterSuccessDataCheck).not.toHaveBeenCalled();
    expect(wrapper.vm.counter).toBe(9);
  });

  test("Error status for request", async () => {
    wrapper.setData({
      counter: 10,
    });
    jest.spyOn(wrapper.vm, "refreshPage");

    wrapper.vm.doPostFetch.mockResolvedValueOnce(Promise.resolve({ status: 500, data: [testData.rejectData] }));

    expect(wrapper.vm.counter).toBe(10);
    expect(wrapper.vm.refreshPage).not.toHaveBeenCalled();

    await wrapper.vm.executeRequest();

    expect(wrapper.vm.refreshPage).toHaveBeenCalled();
    expect(wrapper.vm.counter).toBe(0);
  });

  test("Request should not be run if attempts = 0", async () => {
    wrapper.setData({
      counter: 1,
    });
    wrapper.vm.doPostFetch.mockResolvedValueOnce(Promise.resolve({ status: 200, data: [testData.successData] }));

    expect(wrapper.vm.doPostFetch).not.toHaveBeenCalled();

    await wrapper.vm.executeRequest();
    expect(wrapper.vm.doPostFetch).toHaveBeenCalledTimes(1);

    await wrapper.vm.executeRequest();
    expect(wrapper.vm.doPostFetch).toHaveBeenCalledTimes(1);
  });

  it("Добавляем значение Clicked для поля по которому CLICK для первого запроса", async () => {
    wrapper.setData({
      counter: 7,
      label: "Оформить полис",
    });

    const spy = jest.spyOn(wrapper.vm, "doPostFetch").mockResolvedValue({
      status: 200,
      data: [],
    });
    await wrapper.vm.executeRequest();
    const [calledUrl, calledBody] = spy.mock.calls[0];

    const parsedBody = JSON.parse(calledBody);

    expect(wrapper).not.toBe(null);
    expect(parsedBody.POLICY_NSIS).toBe("CLICKED");
  });
  it("Добавляем значение Clicked для поля по которому CLICK для последующих запросов", async () => {
    wrapper.setData({
      counter: 6,
      label: "Оформить полис",
      counterStart: true,
    });

    const spy = jest.spyOn(wrapper.vm, "doPostFetch").mockResolvedValue({
      status: 200,
      data: [],
    });
    await wrapper.vm.executeRequest();
    const [calledUrl, calledBody] = spy.mock.calls[0];

    const parsedBody = JSON.parse(calledBody);

    expect(wrapper).not.toBe(null);
    expect(parsedBody.POLICY_NSIS).toBe("NULL");
  });
});
