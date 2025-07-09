import { createLocalVue, mount, RouterLinkStub } from "@vue/test-utils";
import Vuex from "vuex";
import WizardProgressBar from "./WizardProgressBar.vue";
import { propsWizardProgressBar, storeWizardProgressBar } from "./WizardProgressBarTestData";

describe("WizardProgressBar", () => {
  const mockRoute = {
    params: {
      idWizard: "1036",
      idModule: "55",
      idParent: "0",
      idItem: "1039",
      idCard: "303",
      idRel: "05F91C609FC13367FE963AE026A4BE76",
    },
  };
  const mockRouter = {
    push: jest.fn(),
  };
  let localVue = createLocalVue();

  localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Vuex.Store(storeWizardProgressBar);

  it("Available tabs for dropdown menu", () => {
    const propsData = propsWizardProgressBar;
    const wrapper = mount(WizardProgressBar, {
      propsData,
      localVue,
      stubs: { NuxtLink: RouterLinkStub },
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
        $store: store,
      },
    });

    expect(wrapper.vm.availableTabs.length).toBe(wrapper.vm.currentTab.order);
  });

  it("Go to next page", () => {
    const prevTabId = propsWizardProgressBar.tabs[1].id;
    const prevUrl = `/cabinet/wizard/1036/55/0/1039/303/05F91C609FC13367FE963AE026A4BE76`;
    const propsData = propsWizardProgressBar;
    const wrapper = mount(WizardProgressBar, {
      propsData,
      localVue,
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
        $store: store,
      },
      stubs: { NuxtLink: RouterLinkStub },
    });

    expect(wrapper.vm.$router.push).not.toBeCalled();

    wrapper.vm.value = prevTabId;
    wrapper.vm.goToTab();

    expect(wrapper.vm.$router.push).toBeCalled();
    expect(wrapper.vm.$router.push.mock.calls[0][0]).toBe(prevUrl);
  });

  test("Progress bar position for single step", () => {
    const propsData = { ...propsWizardProgressBar };
    propsData.tabs = [propsData.tabs[2]];
    const wrapper = mount(WizardProgressBar, {
      propsData,
      localVue,
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
        $store: store,
      },
      stubs: { NuxtLink: RouterLinkStub },
    });

    expect(wrapper.vm.progressPosition).toBe("100%");
    expect(wrapper.html()).not.toContain("Следующий этап");
  });
});
