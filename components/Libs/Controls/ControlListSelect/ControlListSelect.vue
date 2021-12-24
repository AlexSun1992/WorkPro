<template>
  <div>
    <b-form-group
      :label="data.label"
      :class="{ required: data.required }"
      :label-for="data.name"
    >
      <b-input
        v-model="data.value.text || 'Выберите из списка'"
        :readonly="true"
        class="mb-2"
        :class="visible ? null : 'collapsed'"
        :aria-expanded="visible ? 'true' : 'false'"
        aria-controls="collapse-4"
        @click="openList"
      >
        {{ data.value.text || "Выберите из списка" }}
      </b-input>
      <b-collapse id="collapse-4" v-model="visible" class="mt-2">
        <wrapper-item-from-template
          class="mypolices-all-block"
          :isButtonRender="data"
          @update="update"
          v-if="getData"
          :itemId="data.menudic"
          :isEmpty="isEmptyContent"
          :template="getData"
        ></wrapper-item-from-template>
      </b-collapse>
    </b-form-group>
  </div>
</template>
<script>
import Grid from "../../Table/Grid";
import VRuntimeTemplate from "v-runtime-template";
import SelectItemFromTemplate from "./SelectItemFromTemplate.vue";
import ChooseButton from "../../../Pages/Cabinet/Block/ChooseButton.vue";
import FilterBlock from "../../../Pages/Cabinet/Block/FilterBlock.vue";
import ObjectsOnMap from "../../ObjectsOnMap/ObjectsOnMap.vue";
import WrapperItemFromTemplate from "./WrapperItemFromTemplate.vue";

export default {
  name: "ControlListSelect",
  components: {
    Grid,
    VRuntimeTemplate,
    SelectItemFromTemplate,
    WrapperItemFromTemplate,
    ChooseButton,
    FilterBlock,
    ObjectsOnMap,
  },

  data() {
    return {
      visible: false,
      isLoad: false,
    };
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
      Object.keys(event).map(function (key, index) {
        if (Number.isInteger(event[key]) === false) {
          try {
            JSON.parse(event[key]);
            delete event[key];
          } catch (e) {
            event[key] = event[key];
          }
        } else {
          event[key] = event[key];
        }
      });
      this.visible = false;
      this.$store.commit("data_card/setFilters", event);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {
          value: event,
          text: event.SNAME || event.SFIRSTNAME + " " + event.SSECONDNAME,
        },
      });
    },
    selectItem(value) {
      const value_prepare = { ...value.data.item };

      Object.keys(value_prepare).map(function (key, index) {
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

      this.$store.commit("data_card/setFilters", value_prepare);

      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {
          value: value_prepare,
          text:
            value.data.item[this.data.name.substring(2)] ||
            value.data.item[this.dataContent.fields[1].label],
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
