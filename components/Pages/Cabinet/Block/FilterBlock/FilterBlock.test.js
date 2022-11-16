import { createLocalVue, mount } from "@vue/test-utils";
import axios from "axios";
import FilterBlock from "./FilterBlock.vue";

jest.mock("axios");

describe("FilterBlock", () => {
  //   let wrapper;
  //   const createComponent = () => {
  //     wrapper = mount(FilterBlock);
  //   };
  //   beforeEach(() => {
  //     wrapper.destroy();
  //   });
  //

  it("first test for filterBlock", () => {
    // Arrange
    // createComponent();

    const wrapper = mount(FilterBlock);

    // Assert
    expect(wrapper.text()).not.toBe(undefined);
  });
});
