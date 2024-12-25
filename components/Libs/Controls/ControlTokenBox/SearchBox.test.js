import { mount } from "@vue/test-utils";
import SearchBox from "./SearchBox.vue";

describe("SearchBox", () => {
  it('Set input value', () => {
    const value = "Serach";
    const updatedValue = "Serach";
    const wrapper = mount(SearchBox, {
      propsData: {
        value
      }
    })

    expect(wrapper.vm.$refs.searchInput.value).toBe(value);

    wrapper.setProps({value: updatedValue});

    expect(wrapper.vm.$refs.searchInput.value).toBe(updatedValue);
  });

  it('Emit updated input value', () => {
    const value = "Serach";
    const wrapper = mount(SearchBox, {

    });
    const input = wrapper.find('input');

    expect(wrapper.emitted().input.length).toBe(1);

    input.trigger('input', {value});

    expect(wrapper.emitted().input.length).toBe(2);
  });
});
