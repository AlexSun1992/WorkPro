<template>
  <span>
    <b-form-group
      :label="data.label"
      :class="{ required: data.required }"
      :label-for="data.name"
    >
      <template v-slot:label
        ><span v-html="data.label"></span
        ><span v-if="data.helpText">
          (?)<vue-easy-tooltip with-arrow="true" position="top" offset="4">
            <span v-html="data.helpText"></span></vue-easy-tooltip></span
      ></template>
      <model-list-select
        :ref="selectId"
        :id="selectId"
        :list="options"
        option-value="value"
        option-text="text"
        :isDisabled="!edit ? !edit : data.readonly || isDisabled"
        :isError="isValid == false"
        v-model="fieldValue"
        placeholder="Выберите из списка"
        @select="onSelect"
        @searchchange="initData"
      >
      </model-list-select>

      <div class="mt-2">
        <span class="error" v-if="isValid == false">
          Обязательно для заполнения
        </span>
      </div>
    </b-form-group>
  </span>
</template>

<script>
import "vue-search-select/dist/VueSearchSelect.css";
import { ModelListSelect } from "vue-search-select";
import VueEasyTooltip from "vue-easy-tooltip";
export default {
  name: "ControlEnum",
  components: { ModelListSelect, VueEasyTooltip },
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
  data() {
    return {
      selectId: `id${this.data.fieldId}`,
      options: [],
      param: "",
    };
  },
  created() {
    if (this.data.value?.value || this.data.value?.value == 0)
      this.options.push(this.data.value);
  },

  mounted() {
    if (this.$refs[this.selectId]) {
      this.$refs[this.selectId].$el.children[this.selectId].onfocus = () => {
        this.initData();
      };
    }
  },
  methods: {
    initData() {
      let url = "";
      this.options = [];
      if (this.isDisabled) {
        return;
      }
      if (this.relationValue) {
        if (this.relationValue.value) {
          url = `/api/dicwf/${this.data.fieldId}/${this.relationValue.value.value}`;
        }
      } else {
        url = `/api/dic/55/${this.data.id}/${this.data.dic}`;
      }
      this.$axios({ url: url, method: "GET" })
        .then((resp) => {
          this.options = [];
          this.options = resp.data;
          if (this.options.length === 1) {
            let value = this.options[0];
            this.$emit("update", {
              fieldId: this.data.fieldId,
              name: this.data.name,
              value,
            });
            this.$emit("clear", { fieldName: this.data.name });
          }
          if (this.options.length === 2) {
            let value = this.options[1];
            this.$emit("update", {
              fieldId: this.data.fieldId,
              name: this.data.name,
              value,
            });
            this.$emit("clear", { fieldName: this.data.name });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    optionDisplayText(option) {
      return option.text;
    },
    onfocus() {
      if (this.edit) {
        this.initData();
      }
    },
    onSelect(items, lastSelectItem) {
      console.log(lastSelectItem);
    },
  },
  computed: {
    fieldValue: {
      get: function () {
        if (this.isDisabled) {
          return "";
        }
        if (this.options.length === 1) {
          return this.options[0];
        }
        if (this.options.length === 2) {
          return this.options[1];
        } else {
          return this.data.value;
        }
      },
      set: function (value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value,
        });
        this.$emit("clear", { fieldName: this.data.name });
      },
    },

    relationValue: {
      get: function () {
        if (this.data.isRelation) {
          if (this.data.fieldRelation !== null) {
            return this.$store.getters["data_card/getDataFieldByName"](
              this.data.fieldRelation
            );
          } else {
            return this.$store.getters["data_card/getDataFieldByName"](
              this.data.name
            );
          }
        } else {
          return null;
        }
      },
    },
    isValid() {
      return this.$store.getters["data_card/getDataFieldByFieldId"](
        `${this.data.fieldId}`
      )?.state;
    },
    isDisabled() {
      if (this.relationValue && this.data.fieldRelation) {
        if (this.relationValue.value) {
          if (!this.relationValue.value.value) {
            return true;
          }
        }
      } else {
        return false;
      }
    },
  },
  watch: {
    relationValue: function (val, old) {
      if (val.value?.value) {
        if (val.value.value !== old?.value.value) {
          this.initData();
        }
      }
    },
  },
};
</script>

<style scoped>
.ui.disabled.dropdown[data-v-3a0c7bea],
.ui.dropdown .menu > .disabled.item[data-v-3a0c7bea] {
  cursor: default;
  pointer-events: none;
  opacity: 1;
}

.error {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #f86c6b;
}

.required > legend:after {
  content: "*";
  color: red;
}

.ui.selection.dropdown.error {
  border-color: #f86c6b;
  background: none;
}

.help-text {
  font-size: 12px;
  margin-top: 10px;
}
</style>
