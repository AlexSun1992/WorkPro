import { mask } from "vue-the-mask";

export const applyMask = {
  bind(el, binding) {
    if (binding.value && binding.value !== "") {
      mask(el, binding);
    }
  },
  unbind() {},
};
