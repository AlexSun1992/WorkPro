<template>
  <div>
    <slot name="card"></slot>
    <slot :isCardHidden="isCardHidden"></slot>
  </div>
</template>
<script>
export default {
  name: "ModalBox",
  props: {
    element: {
      type: String,
      required: true,
      default: () => null,
    },
    btnClose: {
      type: String,
      required: true,
      default: () => null,
    },
  },
  data() {
    return {
      isCardHidden: true,
    };
  },

  mounted() {
    const $el = document.querySelector(`.${this.element}`);
    const btnHideWindow = document.querySelector(`.${this.btnClose}`);

    $el.addEventListener("click", () => {
      this.isCardHidden = !this.isCardHidden;
    });

    btnHideWindow.addEventListener("click", () => {
      this.isCardHidden = !this.isCardHidden;
    });
  },
};
</script>
