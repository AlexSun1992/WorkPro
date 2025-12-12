import { mount } from "@vue/test-utils";
import CardFavourite from "./CardFavourite.vue";
// eslint-disable-next-line
import { CardFavouriteFixtures } from "./CardFavourite.fixtures";

// mock navigator clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
    readText: jest.fn(), // if you use readText
  },
});

describe("CardFavourite", () => {
  let wrapper;

  const createWrapper = (props = {}, options = {}) => mount(CardFavourite, {
      propsData: {
        data: {},
        ...props,
      },
      ...options,
    });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("Initial state", () => {
    it("renders correctly with default props", () => {
      wrapper = createWrapper({ data: CardFavouriteFixtures });
      expect(wrapper.exists()).toBe(true);
    });
    it("has a like button", () => {
      wrapper = createWrapper({ data: CardFavouriteFixtures });
      const likeButton = wrapper.find(".btn-heart");
      expect(likeButton.exists()).toBeTruthy();
    });
    it("has a choose button with correct selection behavior", () => {
      wrapper = createWrapper({ data: { ...CardFavouriteFixtures, LFAV: true }, hasChooseButton: true });
      const chooseButton = wrapper.find("[data-button-type='map-choose-button']");
      expect(chooseButton.exists()).toBeTruthy();
      chooseButton.trigger("click");
      expect(wrapper.emitted("update")).toBeTruthy();
      expect(wrapper.emitted("update")[0]).toEqual([CardFavouriteFixtures.ID]);
    });
    it("is selectable", () => {
      wrapper = createWrapper({ data: CardFavouriteFixtures, selectable: true });
      wrapper.trigger("click");
      expect(wrapper.emitted("click")).toBeTruthy();
      expect(wrapper.emitted("click")[0]).toEqual([CardFavouriteFixtures.ID]);
    });
    it("has a copy address button on mobile", () => {
      window.innerWidth = 375;
      wrapper = createWrapper({ data: CardFavouriteFixtures });
      const copyButton = wrapper.find(".copy-button");
      expect(copyButton.exists()).toBeTruthy();
      copyButton.trigger("click");
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(CardFavouriteFixtures.SADDRESS);
    });
    it("has a button that opens a new window", () => {
      wrapper = createWrapper({ data: CardFavouriteFixtures });
      const windowSpy = jest.spyOn(window, "open").mockImplementation(() => {});
      const navigateButton = wrapper.find("[data-button-type='map-url-button']");
      expect(navigateButton.exists()).toBeTruthy();
      navigateButton.trigger("click");
      expect(windowSpy).toHaveBeenCalledWith(CardFavouriteFixtures.SBUTTONTEXT[0].SURL);
    });
    // TODO: add integration tests with mock store
  });
});
