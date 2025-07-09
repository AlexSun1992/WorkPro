import { mount } from "@vue/test-utils";
import ControlPencil from "./ControlPencil.vue";

describe("ControlPencil", () => {
  let wrapper;
  let mockRoute;
  let mockRouter;

  const createComponent = () => {
    wrapper = mount(ControlPencil, {
      propsData: {
        data: {
          value: "/cabinet/wizard/1036/55/0/1039/143/79E05751C0A117A1B932C1A1BD9691A2",
        },
      },
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
      },
    });
  };

  beforeEach(() => {
    mockRoute = {
      path: "/cabinet/wizard/1036/55/0/1040/143/79A0F781ED168E5DBD28A56635C5FBCA",
    };
    mockRouter = {
      push: jest.fn(),
    };
  });

  afterEach(() => {
    wrapper.destroy();
    jest.resetModules();
  });

  it.only("проверяем редирект по нажатию, если в value пришла ссылка", async () => {
    createComponent();
    wrapper.find(".btn-pencil").trigger("click");
    expect(mockRouter.push).toHaveBeenCalledWith("/cabinet/wizard/1036/55/0/1039/143/79E05751C0A117A1B932C1A1BD9691A2");
  });
});
