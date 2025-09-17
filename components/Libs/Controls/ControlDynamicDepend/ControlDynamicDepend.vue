<template>
  <div>
    <div class="price">
      <font size="16">{{ fullPrice }}</font>
    </div>
    <control-dynamic-list
      v-if="textForDynamicList"
      :data="createData"
    ></control-dynamic-list>
  </div>
</template>

<script>
import ControlDynamicList from "./ControlDynamicList.vue";

export default {
  name: "ControlDynamicDepend",
  data() {
    return {};
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: { ControlDynamicList },
  watch: {
    value(newV, oldV) {
      if (oldV !== newV) {
        this.updateValue(newV);
      }
    },
  },
  methods: {
    updateValue(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value,
      });
    },
  },
  created() {
    if ("options" in this.data) {
      this.updateValue(this.data.options[0]?.value);
    }
  },
  computed: {
    value() {
      return (
        new Intl.NumberFormat("ru-RU", {}).format(
          Array.isArray(this.data.options) ? this.data.options[0]?.value : this.data.value
        ) || this.data.value
      );
    },
    fullPrice() {
      return this.data.fullPrice?.toLocaleString("ru-RU") || this.value;
    },
    createData() {
      return {
        options: [
          {
            text: this.textForDynamicList,
          },
        ],
      };
    },

    showDescription() {
      return this.fullPrice !== this.value;
    },

    additionalOptions() {
      const options = this.data.additional?.reduce((acc, cur) => `${acc}\n${cur}`, "");
      return `${this.data.options[0].SCOMMENT_DYNAMIC}${options}`;
    },

    textForDynamicList() {
      if (this.showDescription) {
        return this.additionalOptions;
      }
      if ("options" in this.data && this.data.options.length) {
        return "SCOMMENT" in this.data.options[0] ? this.data.options[0]?.SCOMMENT : "";
      }
      return "";
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
