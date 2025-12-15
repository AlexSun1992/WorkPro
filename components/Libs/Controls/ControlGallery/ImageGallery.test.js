import { createLocalVue, mount } from "@vue/test-utils";
import lightgallery from "lightgallery.js";
import ImageGallery from "./ImageGallery.vue";
import { ControlGalleryTestProps } from "./ControlGalleryTestData";

const localVue = createLocalVue();
localVue.use(lightgallery);
describe("ControlGallery", () => {
  test("Visible all imgs", () => {
    const wrapper = mount(ImageGallery, {
      propsData: ControlGalleryTestProps,
    });

    const imgs = wrapper.findAll("img");

    expect(imgs.length).toBe(ControlGalleryTestProps.urls.length);
  });

  test("Open full size img", async () => {
    // TODO нужно реализовать
    const wrapper = mount(ImageGallery, {
      propsData: ControlGalleryTestProps,
    });

    const imgs = wrapper.findAll("img");

    await imgs.at(0).trigger("click");
  });
});
