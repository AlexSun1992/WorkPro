import { mount } from "@vue/test-utils";
import ObjectList from "./ObjectList.vue";
import { ControlSelectObjectFromMapFixtures } from "./ControlSelectObjectFromMap.fixtures";

const CardsFixtures = ControlSelectObjectFromMapFixtures.items;

describe("ObjectList", () => {
  let wrapper;

  const createWrapper = (props = {}, options = {}) => mount(ObjectList, {
      propsData: {
        dataContent: {},
        ...props,
      },
      ...options,
    });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("Initial state", () => {
    it("renders correctly with default props", () => {
      wrapper = createWrapper({ dataContent: CardsFixtures });
      expect(wrapper.exists()).toBe(true);
    });
    it("cards are selectable", () => {
      wrapper = createWrapper({ dataContent: CardsFixtures, selectable: true });
      const cards = wrapper.findAll(".agent-blocks");
      expect(cards.exists()).toBe(true);
      const firstCard = cards.at(0);
      firstCard.trigger("click");
      expect(wrapper.emitted("select")).toBeTruthy();
      expect(wrapper.emitted("select")[0]).toEqual([CardsFixtures[0].ID]);
    });
  });
});
