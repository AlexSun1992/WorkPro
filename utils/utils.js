import { mask } from "vue-the-mask";

export const applyMask = {
  update(el, binding) {
    if (binding.value && binding.value !== "") {
      mask(el, binding);
    }
  },
  unbind() {},
};
