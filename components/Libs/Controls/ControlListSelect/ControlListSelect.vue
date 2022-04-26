<template>
  <div>
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
        <b-form-invalid-feedback>
          Обязательно для заполнения
        </b-form-invalid-feedback>
      </b-form-group>
      <div class="col-lg-2 pt-lg-2 text-nowrap">
        <b-button
          v-if="!isLoad && itemValue[optionsValue] && getData"
          class="reload-captcha mt-1"
          variant="outline-success"
          @click="clearItem"
        >
          {{ data.placeholder || "Очистить" }}
        </b-button>
        <b-spinner v-if="isLoad" />
      </div>
    </div>
  </div>
</template>
<script>
import ControlWrapperSelect from "../ControlWrapperSelect";

export default {
  name: "ControlListSelect",
  components: {
    ControlWrapperSelect,
  },
  directives: {
    clickOutside: {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
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
        return this.dataContent.items || [];
      },
    },
    optionsValue: {
      get() {
        if (this.dataContent?.fields?.length > 1) {
          return this.dataContent?.fields[1].key || "ID";
        }
      },
    },
    itemValue: {
      get() {
        return this.data?.value?.value || {};
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
        ).SVJCARDGRID;
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
      return this.$root.eventHandler(this.data, item, "displayText");
    },
    selectItem(value) {
      const valuePrepare = { ...value };
      Object.keys(valuePrepare).map((key) => {
        if (Number.isInteger(valuePrepare[key]) === false) {
          try {
            JSON.parse(valuePrepare[key]);
            delete valuePrepare[key];
          } catch (e) {
            console.error(e);
          }
        }
      });
      this.visible = false;
      this.$store.commit("data_card/setFilters", valuePrepare);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {
          value: valuePrepare,
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
            query: this.$store.getters["data_card/getFiltersAllFields"],
          });
          this.isLoad = false;
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
};
</script>

<style scoped></style>
