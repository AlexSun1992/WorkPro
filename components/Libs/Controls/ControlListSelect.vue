<template>
  <div v-click-outside="outside">
    <b-form-group
      :label="data.label"
      :class="{ required: data.required }"
      :label-for="data.name"
    >
      <control-wrapper-select
        :options="options"
        :select-id="selectId"
        :item-value="itemValue"
        :options-value="optionsValue"
        :display-text="displayText"
        @openList="openList"
        @selectItem="selectItem"
      />
    </b-form-group>
  </div>
</template>
<script>
import Grid from "../Table/Grid";
import VRuntimeTemplate from "v-runtime-template";
import ContentBlock from "../../Pages/Cabinet/Block/ContentBlock.vue";
import ControlWrapperSelect from "./ControlWrapperSelect";

export default {
  name: "ControlListSelect",
  components: {
    ControlWrapperSelect,
    Grid,
    VRuntimeTemplate,
    ContentBlock,
  },

  data() {
    return {
      visible: false,
      isLoad: false,
    };
  },
  props: {
    dictionaryList: {
      type: Object,
      required: false,
      default: () => null,
    },
    data: {
      type: Object,
      required: true,
      default: () => {},
    },

    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  computed: {
    dataContent: {
      get: function () {
        const block = this.$store.getters["blocks/getUnfilteredBlockById"](
          this.data.menudic
        );
        if (block) {
          return block.data;
        } else {
          return {};
        }
      },
    },
    options: {
      get: function () {
        return this.dataContent.items || [];
      },
    },
    optionsValue: {
      get: function () {
        if (this.dataContent?.fields?.length > 1) {
          return this.dataContent?.fields[1].key || "ID";
        }
      },
    },
    itemValue: {
      get: function () {
        return this.data?.value?.value || {};
      },
    },
    selectId: {
      get: function () {
        return `id${this.data.fieldId}`;
      },
    },
    getData: {
      get: function () {
        const data = this.$store.getters["menu/getMenuById"](
          this.data.menudic
        ).SVJCARDGRID;
        if (data) {
          return data;
        }
      },
    },
    isEmptyContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](
          this.data.menudic
        );
        if (block) {
          return !block?.data?.items.length;
        } else {
          return false;
        }
      },
    },
  },
  methods: {
    update(event) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {
          value: event,
          text: event.SNAME,
        },
      });
    },
    displayText: function (item) {
      return this.$root.eventHandler(this.data, item, "displayText");
    },
    selectItem(value) {
      const value_prepare = { ...value };
      Object.keys(value_prepare).map(function (key) {
        if (Number.isInteger(value_prepare[key]) === false) {
          try {
            JSON.parse(value_prepare[key]);
            delete value_prepare[key];
          } catch (e) {
            value_prepare[key] = value_prepare[key];
          }
        } else {
          value_prepare[key] = value_prepare[key];
        }
      });
      this.visible = false;
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {
          value: value_prepare,
          text:
            value[this.data.name.substring(2)] ||
            value[this.dataContent.fields[1].label],
        },
      });
    },
    outside() {
      if (this.visible) {
        this.visible = false;
      }
    },
    async openList() {
      this.visible = !this.visible;
      if (this.visible) {
        try {
          this.isLoad = true;
          await this.$store.dispatch("blocks/fetchBlock", {
            id: this.data.menudic,
            query: this.$store.getters["data_card/getFiltersAllFields"],
          });
          this.isLoad = false;
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
  directives: {
    clickOutside: {
      bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind: function (el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
};
</script>

<style scoped></style>
