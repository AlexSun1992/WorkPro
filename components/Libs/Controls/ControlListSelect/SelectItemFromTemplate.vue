<template>
  <div>
    <slot name="data" v-for="item in dataContent.items" v-bind:content="item">
    </slot>
    <slot :update="update" v-bind:content="dataContent.items"> </slot>
  </div>

  <!-- <div>
    <b-form-group
      :label="isButtonRender.label"
      :class="{ required: isButtonRender.required }"
      :label-for="isButtonRender.name"
    >
      <b-input
        v-model="isButtonRender.value.text || 'Выберите из списка'"
        :readonly="true"
        class="mb-2"
        aria-controls="collapse-4"
        @click="openList"
      >
        {{ "Выберите из списка" }}
      </b-input>
      <b-collapse id="collapse-4" v-model="visible" class="mt-2">
        <b-card>
          <b-col style="width: 60rem">
            <slot
              name="data"
              v-for="item in dataContent.items"
              v-bind:content="item"
            >
            </slot>
            <slot :update="update" v-bind:content="dataContent.items"> </slot>
          </b-col>
        </b-card>
      </b-collapse>
    </b-form-group>
  </div> -->

  <!-- <div>
    <b-form-group
      :label="isButtonRender?.label"
      :class="{ required: isButtonRender?.required }"
      :label-for="isButtonRender?.name"
    >
      <b-input
        v-model="isButtonRender?.value.text || 'Выберите из списка'"
        :readonly="true"
        class="mb-2"
        :class="visible ? null : 'collapsed'"
        :aria-expanded="visible ? 'true' : 'false'"
        aria-controls="collapse-4"
        @click="openList"
      >
        {{ isButtonRender?.value.text || "Выберите из списка" }}
      </b-input>
      <b-collapse id="collapse-4" v-model="visible" class="mt-2">
        <b-card>
          <b-col style="width: 60rem">
            <slot
              name="data"
              v-for="item in dataContent.items"
              v-bind:content="item"
            >
            </slot>
            <slot :update="update" v-bind:content="dataContent.items"> </slot>
          </b-col>
        </b-card>
      </b-collapse>
    </b-form-group>
  </div> -->
</template>

<script>
import ChooseButton from "../../../Pages/Cabinet/Block/ChooseButton.vue";
import FilterBlock from "../../../Pages/Cabinet/Block/FilterBlock.vue";
import ObjectsOnMap from "../../ObjectsOnMap/ObjectsOnMap.vue";

export default {
  name: "SelectItemFromTemplate",
  components: {
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
    data: {
      type: Object,
      required: false,
      default: () => {},
    },

    itemId: {
      required: false,
      default: () => "",
    },
    name: {
      type: String,
      required: false,
      default: () => "",
    },
    isButtonRender: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  async fetch() {
    try {
      (await this.cardId)
        ? this.$store.dispatch("blocks/fetchWizardBlock", {
            itemId: this.itemId,
            cardId: this.cardId,
          })
        : this.$store.dispatch("blocks/fetchBlock", {
            id: this.itemId,
            query: { ...this.$route.query },
          });
    } catch (err) {
      this.$bvToast.toast(err.response.data.MESSAGE, {
        title: "Ошибка",
        variant: "danger",
        noAutoHide: true,
        solid: true,
      });
    }
  },

  // mounted() {
  //   console.log(this.isButtonRender);
  // },

  computed: {
    dataContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return block.data;
        } else {
          return {};
        }
      },
    },
    isEmptyContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          console.log(block);
          return !block?.data?.items.length;
        } else {
          return false;
        }
      },
    },
  },

  methods: {
    update(event) {
      this.$emit("update", event);
    },
    async openList() {
      console.log("!!!");
      this.visible = !this.visible;
      if (this.visible) {
        try {
          this.isLoad = true;
          await this.$store.dispatch("blocks/fetchBlock", {
            id: this.isButtonRender.menudic,
            query: this.$store.getters["data_card/getFilters"],
          });
          this.isLoad = false;
        } catch (err) {
          console.log(err);
        }
      }
    },
    selectItem(value) {
      const value_prepare = { ...value.data.item };
      console.log(value_prepare);
      // console.log({ ...value.data.item });
      // Object.keys(value_prepare).map(function (key, index) {
      //   if (Number.isInteger(value_prepare[key]) === false) {
      //     try {
      //       JSON.parse(value_prepare[key]);
      //       delete value_prepare[key];
      //     } catch (e) {
      //       value_prepare[key] = value_prepare[key];
      //     }
      //   } else {
      //     value_prepare[key] = value_prepare[key];
      //   }
      // });
      // this.visible = false;

      // this.$store.commit("data_card/setFilters", value_prepare);
      // console.log(value_prepare);
      // this.$emit("update", {
      //   fieldId: this.data.fieldId,
      //   name: this.data.name,
      //   value: {
      //     value: value_prepare,
      //     text:
      //       value.data.item[this.data.name.substring(2)] ||
      //       value.data.item[this.dataContent.fields[1].label],
      //   },
      // });
    },
    outside() {
      if (this.visible) {
        this.visible = false;
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
