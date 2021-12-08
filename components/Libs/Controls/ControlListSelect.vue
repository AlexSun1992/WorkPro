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
        <content-block class="mypolices-all-block" :itemId="data.menudic">
          <v-runtime-template
            :itemId="data.menudic"
            v-if="getData"
            :template="getData"
          >
          </v-runtime-template>

          <b-card v-else>
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
        </content-block>
      </b-collapse>
    </b-form-group>
  </div>
</template>

<script>
import Grid from "../Table/Grid";
import VRuntimeTemplate from "v-runtime-template";
import ContentBlock from "../../Pages/Cabinet/Block/ContentBlock.vue";

export default {
  name: "ControlListSelect",
  components: {
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
    selectItem(value) {
      const value_prepare = { ...value.data.item };
      Object.keys(value_prepare).map(function (key, index) {
        try {
          JSON.parse(value_prepare[key]);
          delete value_prepare[key];
        } catch (e) {
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
