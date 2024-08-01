<template>
  <div class="position-relative">
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
        :is-disabled="!edit ? !edit : data.readonly"
        @openList="openList"
        @selectItem="selectItem"
        :id="data.name"
      />
      <b-form-invalid-feedback>
        Обязательно для заполнения
      </b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>
<script>
import { BFormGroup } from "bootstrap-vue";
import ControlWrapperSelect from "../ControlWrapperSelect";
import { detectUniquePropertyName } from "./detectUniquePropertyName";

export default {
  name: "ControlListSelect",
  components: {
    ControlWrapperSelect,
    BFormGroup,
  },
  props: {
    itemId: {
      required: false,
      default: () => {},
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
    isButtonRender: {
      type: Object,
      required: false,
      default: () => {},
    },
    isEmpty: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },

  data() {
    return {
      visible: false,
      isLoad: false,
    };
  },

  computed: {
    dataContent: {
      get() {
        const block = this.$store.getters["blocks/getUnfilteredBlockById"](
          this.data.menudic
        );
        if (block) {
          return block.data;
        }
        return {};
      },
    },
    options: {
      get() {
        if (this.dataContent.items) {
          return this.dataContent.items;
        }
        if (Object.keys(this.itemValue).length !== 0) {
          return [this.itemValue];
        }
        return [];
      },
    },
    optionsValue: {
      get() {
        if (this.dataContent?.fields?.length > 1) {
          return detectUniquePropertyName(this.dataContent.items) || "ID";
        }
        if (Object.keys(this.itemValue).length !== 0) {
          return Object.keys(this.itemValue)[0];
        }
        return null;
      },
    },
    itemValue: {
      get() {
        if (typeof this.data?.value?.value === "string") {
          return JSON.parse(this.data?.value?.value);
        }
        if (typeof this.data?.value?.value === "object") {
          return this.data?.value?.value;
        }
        return {};
      },
    },
    selectId: {
      get() {
        return `id${this.data.fieldId}`;
      },
    },
    getData: {
      get() {
        const data = this.$store.getters["menu/getMenuById"](
          this.data.menudic
        )?.SVJCARDGRID;
        if (data) {
          return data;
        }
      },
    },
    isEmptyContent: {
      get() {
        const block = this.$store.getters["blocks/getBlockById"](
          this.data.menudic
        );
        if (block) {
          return !block?.data?.items.length;
        }
        return false;
      },
    },
  },
  methods: {
    displayText(item) {
      if (typeof this.$root.eventHandler === "function") {
        const text = this.$root.eventHandler(this.data, item, "displayText");
        if (typeof text === "string") {
          return text;
        }
      }
      return null;
    },
    selectItem(value) {
      const valuePrepare = { ...value };
      Object.keys(valuePrepare).map((key) => {
        if (Number.isInteger(valuePrepare[key]) === false) {
          try {
            JSON.parse(valuePrepare[key]);
            delete valuePrepare[key];
          } catch (e) {
            return null;
          }
        }
      });
      this.visible = false;
      this.$store.commit("data_card/setFilters", valuePrepare);

      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {
          value: { ...value },
          text:
            value[this.data.name.substring(2)] ||
            value[this.dataContent.fields[1].label],
        },
      });
    },
    clearItem() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {},
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
            query: this.$store.getters["data_card/getFilters"],
            ...this.$route.params,
          });
          this.isLoad = false;
        } catch (err) {
          console.error(err);
        }
      }
    },
  },
};
</script>

<style scoped></style>
