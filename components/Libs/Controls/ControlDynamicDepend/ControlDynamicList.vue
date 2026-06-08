<template>
  <div v-html="value"></div>
</template>

<script>
export default {
  name: "ControlDynamicList",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    value() {
      const text = Array.isArray(this.data.options) ? this.data.options[0]?.text : "";
      return typeof text === "string" ? text.replace(/\n/g, "<br />") : "";
    },
  },
};
</script>

<style scoped>
.price font:after {
  content: "\20BD";
  font-family: "SF Pro Display", Helvetica, Arial, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
    Noto Sans, sans-serif, "Apple Color Emoji";
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
