import { createLocalVue, mount } from "@vue/test-utils";
// eslint-disable-next-line
import { CardFavouriteFixtures } from "./CardFavourite.fixtures";
import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import CardFavourite from "./CardFavourite.vue";

import * as blocks from "@/store/blocks";
import { ControlSelectObjectFromMapFixtures } from "./ControlSelectObjectFromMap.fixtures";

// mock navigator clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
    readText: jest.fn(), // if you use readText
  },
});

describe("CardFavourite", () => {
  let wrapper;

  const createWrapper = (props = {}, options = {}) =>
    mount(CardFavourite, {
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
  });
});

describe("CardFavourite store tests", () => {
  Vue.use(Vuex);
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  let store;
  let wrapper;
  let dispatchSpy;

  beforeEach(async () => {
    store = new Vuex.Store({
      modules: {
        blocks: {
          ...blocks,
          actions: {
            ...blocks.actions,
            executeAction: jest.fn((_, payload) => {}),
          },
          namespaced: true,
        },
        menu: {
          getters: {
            getActionById: jest.fn(() => (_) => ({ REL: "relActionId" })),
          },
          namespaced: true,
        },
      },
    });
    process.server = true;
    store.$axios = axios;
    global.eventHandler = () => null;
    store.commit("blocks/clearBlockById", 1);
    store.commit("blocks/addBlock", { blockId: 1, data: ControlSelectObjectFromMapFixtures });

    dispatchSpy = jest.spyOn(store, "dispatch");
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  const card = ControlSelectObjectFromMapFixtures.items[1];

  const createWrapper = (props = {}, options = {}) =>
    mount(CardFavourite, {
      localVue,
      propsData: {
        data: {},
        itemId: 336,
        ...props,
      },
      mocks: {
        $store: store,
      },
      ...options,
    });

  it("triggers an action on heart click", async () => {
    wrapper = createWrapper({ data: card, itemId: 1 });
    expect(wrapper.exists()).toBe(true);

    const likeButton = wrapper.find(".btn-heart");
    expect(likeButton.exists()).toBeTruthy();

    likeButton.trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(dispatchSpy).toHaveBeenCalledWith(
      "blocks/toggleFavoriteObject",

      expect.objectContaining({
        blockId: 1,
        idCard: card.ID,
        relId: card.REL,
        relationValue: card.IDMEDPARTNER,
      })
    );

    expect(likeButton.classes()).toContain("active");

    likeButton.trigger("click");

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(dispatchSpy).toHaveBeenCalledWith(
      "blocks/toggleFavoriteObject",

      expect.objectContaining({
        blockId: 1,
        idCard: card.ID,
        relId: card.REL,
        relationValue: card.IDMEDPARTNER,
      })
    );

    expect(likeButton.classes()).not.toContain("active");
  });
});
