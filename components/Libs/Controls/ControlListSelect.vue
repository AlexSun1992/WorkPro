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
      </b-collapse>
    </b-form-group>
  </div>
</template>

<script>
import Grid from "../Table/Grid";
export default {
  name: "ControlListSelect",
  components: { Grid },
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
  },
  methods: {
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
      console.log(value_prepare);
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
