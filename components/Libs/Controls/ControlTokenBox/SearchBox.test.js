import { mount } from "@vue/test-utils";
import SearchBox from "./SearchBox.vue";

const value = "Search";
const updatedValue = "Search1";

describe("SearchBox", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SearchBox, {
      propsData: {
        value
      }
    });
  });

  it('Set input value', async () => {
    expect(wrapper.vm.$refs.searchInput.value).toBe(value);

    await wrapper.setProps({ value: updatedValue });

    expect(wrapper.vm.$refs.searchInput.value).toBe(updatedValue);
  });

  it('Emit updated input value', () => {
    const input = wrapper.find('input');

    expect(wrapper.emitted().input.length).toBe(1);

    input.trigger('input', { value });

    expect(wrapper.emitted().input.length).toBe(2);
  });

  it('Clear input value', () => {
    wrapper.vm.clearInput();

    expect(wrapper.vm.value === "");
  });

  it('Clear input value', () => {
    wrapper.vm.searchComplete();

    expect(wrapper.emitted().searchComplete.length).toBe(1);
  });
});
