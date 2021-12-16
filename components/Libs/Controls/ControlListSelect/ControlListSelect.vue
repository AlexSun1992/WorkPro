<template>
  <div v-click-outside="outside">
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
        <select-item-from-template
          @update="update"
          class="mypolices-all-block"
          :itemId="data.menudic"
          name="Vasya"
        >
          <!-- Динамический шаблон -->
          <v-runtime-template
            :itemId="data.menudic"
            v-if="getData"
            :template="getData"
          >
          </v-runtime-template>

          <!-- Динамический шаблон -->

          <b-card>
            <b-col style="width: 60rem">
              <grid
                :load="isLoad"
                :action="true"
                :total="dataContent.total"
                :fields="dataContent.fields"
                :items="dataContent.items"
              >
                <template v-slot:actions="slotProps">
                  <b-button
                    v-on:click="selectItem(slotProps)"
                    class="btn-table-open"
                    >Выбрать</b-button
                  >
                </template>
              </grid>
            </b-col>
          </b-card>
        </select-item-from-template>
      </b-collapse>
    </b-form-group>
  </div>
</template>
<script>
import Grid from "../../Table/Grid";
import VRuntimeTemplate from "v-runtime-template";
import ContentBlock from "../../../Pages/Cabinet/Block/ContentBlock.vue";
import SelectItemFromTemplate from "./SelectItemFromTemplate.vue";
import ChooseButton from "../../../Pages/Cabinet/Block/ChooseButton.vue";

export default {
  name: "ControlListSelect",
  components: {
    Grid,
    VRuntimeTemplate,
    ContentBlock,
    SelectItemFromTemplate,
    ChooseButton,
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
      // console.log(value_prepare);
      this.$store.commit("data_card/setFilters", value_prepare);
      console.log(value_prepare);
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
            query: this.$store.getters["data_card/getFilters"],
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
