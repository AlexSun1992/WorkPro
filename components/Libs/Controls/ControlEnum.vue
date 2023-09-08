<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label>
      <span v-html="data.label" />
      <span v-if="data.helpText">
        <span class="tooltipster">
          (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
            <span v-html="data.helpText" /></vue-easy-tooltip></span
      ></span>
    </template>
    <model-list-select
      :id="selectId"
      :ref="selectId"
      v-model="fieldValue"
      :list="options"
      option-value="value"
      option-text="text"
      :is-disabled="!edit ? !edit : data.readonly || isDisabled"
      :is-error="isValid == false"
      placeholder="Выберите из списка"
      @searchchange="initData"
    />

    <div v-if="isValid == false" class="mt-2">
      <span class="error"> Обязательно для заполнения </span>
    </div>
  </b-form-group>
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
  created() {
    if (this.data.fieldRelation) {
      const relationValue = this.$store.getters["data_card/getDataFieldByName"](
        this.data.fieldRelation
      )?.value;
      if (relationValue?.value) {
        this.initData();
      }
    }
  },
  computed: {
    fieldValue: {
      get() {
        return this.$store.getters["data_card/getDataFieldByName"](
          this.data.name
        )?.value;
      },
      set(value) {
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
      get() {
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
        const arrayFieldRelation = this.data.fieldRelation.split(";");
        if (arrayFieldRelation.length) {
          const fieldsRelations =
            this.$store.getters["data_card/getDataFieldsByNames"](
              arrayFieldRelation
            );
          if (fieldsRelations) {
            return fieldsRelations.some((item) => !item.value?.value);
          }
        }
        if (!this.data.fieldRelation.split(";")) {
          return (
            Boolean(
              this.$store.getters["data_card/getDataFieldByName"](
                this.data.fieldRelation
              )?.value?.value
            ) === false
          );
        }
      }
      return false;
    },
    options: {
      get() {
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
    relationValue(newVal, oldVal) {
      if (newVal?.value !== oldVal?.value) {
        if (newVal?.value) {
          this.initData();
        }
      }
    },
  },
  mounted() {
    if (this.$refs[this.selectId]) {
      this.$refs[this.selectId].$el.children[this.selectId].onfocus = () => {
        this.initData();
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
          value: this.data.value?.value ? this.data.value : {},
        });
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

.ui.selection.dropdown.error {
  border-color: #f86c6b;
  background: none;
}

.help-text {
  font-size: 12px;
  margin-top: 10px;
}
</style>
