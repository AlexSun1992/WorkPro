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
export default {
  name: "ControlEnum",
  components: { ModelListSelect },
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
    };
  },
  mounted() {
    if (this.$refs[this.selectId]) {
      this.$refs[this.selectId].$el.children[this.selectId].onfocus = () => {
        if (!this.data.fieldRelation) {
          this.initData();
        }
      };
    }
  },
  methods: {
    async initData() {
      await this.$store.dispatch("data_card/fetchDic", this.data);
      if (this.data.fieldRelation) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: {},
        });
      }
    },
  },
  computed: {
    fieldValue: {
      get: function () {
        return this.$store.getters["data_card/getDataFieldByName"](
          this.data.name
        )?.value;
      },
      set: function (value) {
        if (value?.value !== this.fieldValue?.value) {
          this.$store.commit("data_card/clearFormRelationField", this.data);
        }
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value,
        });
      },
    },
    relationValue: {
      get: function () {
        return this.$store.getters["data_card/getDataFieldByName"](
          this.data.fieldRelation
        )?.value;
      },
    },
    isValid() {
      return this.$store.getters["data_card/getDataFieldByFieldId"](
        `${this.data.fieldId}`
      )?.state;
    },
    isDisabled() {
      if (this.data.fieldRelation) {
        return (
          Boolean(
            this.$store.getters["data_card/getDataFieldByName"](
              this.data.fieldRelation
            )?.value?.value
          ) === false
        );
      } else {
        return false;
      }
    },
    options: {
      get: function () {
        if (
          this.$store.getters["data_card/getDataFieldByFieldId"](
            this.data.fieldId
          )?.options
        ) {
          return this.$store.getters["data_card/getDataFieldByFieldId"](
            this.data.fieldId
          )?.options;
        }
        if (this.data.value?.value) {
          return [this.data.value];
        }
        return [];
      },
    },
  },
  watch: {
    relationValue: function (newVal, oldVal) {
      if (newVal?.value !== oldVal?.value) {
        if (newVal?.value) {
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
