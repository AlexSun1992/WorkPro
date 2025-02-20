import { mount } from "@vue/test-utils";
import ControlSlider from "./ControlSlider.vue";

describe("ControlSlider", () => {
  let wrapper;

  test("Show slider items", () => {
    wrapper = mount(ControlSlider, {
      slots: {
        default:
          "<div class='slider-item'></div><div class='slider-item'></div>",
      },
    });

    expect(wrapper.findAll(".slider-item").length).toBe(2);
  });

  test("SlickCarousel instance create", () => {
    wrapper = mount(ControlSlider, {
      slots: {
        default: "<div/>",
      },
    });

    expect(wrapper.findAll(".slick-slider").length).toBe(1);
  });

  test("Show sliders with props", () => {
    wrapper = mount(ControlSlider, {
      propsData: {
        params: {
          arrows: false,
          slidesToShow: 2,
        },
      },
      slots: {
        default:
          "<div class='slider-item'></div><div class='slider-item'></div><div class='slider-item'></div>",
      },
    });

    // aria-hidden=false - так помечается отображаемые слайды
    expect(wrapper.findAll("[aria-hidden=false]").length).toBe(2);
    expect(wrapper.findAll(".slick-arrow").length).toBe(0);
  });
});
