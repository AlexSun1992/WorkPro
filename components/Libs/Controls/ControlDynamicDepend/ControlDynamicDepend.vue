<template>
  <div class="price">
    <font size="16">{{ value }}</font>
  </div>
</template>

<script>
export default {
  name: "ControlDynamicDepend",
  data() {
    return {};
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  computed: {
    value() {
      return new Intl.NumberFormat("ru-RU", {}).format(
        Array.isArray(this.data.options)
          ? this.data.options[0]?.value
          : this.data.value
      );
    },
  },
};
</script>
<style scoped>
.price font:after {
  content: "\20BD";
  font-family: "SF Pro Display", Helvetica, Arial, system-ui, -apple-system,
    Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif,
    "Apple Color Emoji";
  padding-left: 10px;
}
.price {
  font-size: 3rem;
  font-weight: 700;
  font-family: Raleway;
  font-feature-settings: "pnum" on, "lnum" on;
  line-height: 77px;
}
font + font {
  margin-left: 20px;
}
</style>
