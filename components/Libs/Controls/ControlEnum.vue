<template>
  <span @click="onfocus">
    <b-form-group
      :label="data.label"
      :class="{ required: data.required }"
      :label-for="data.name"
      :label-cols="data.labelCols ? '' : 2"
      :label-class="data.labelCols"
    >
      <model-list-select
        :list="options"
        option-value="value"
        option-text="text"
        :isDisabled="!edit ? !edit : data.readonly"
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
      options: [],
      param: "",
    };
  },
  created() {
    if (this.data.value.value) this.options.push(this.data.value);
  },
  methods: {
    initData(param) {
      let url = "";
      if (this.relationValue) {
        if (this.relationValue.value) {
          url = `/api/dicwf/${this.data.fieldId}/${this.relationValue.value.value}`;
        }
      } else {
        url = `/api/dic/${this.$route.params.idModule}/${this.data.id}/${this.data.dic}`;
      }
      this.$axios({ url: url, method: "GET" })
        .then((resp) => {
          this.options = resp.data;
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
        return this.data.value;
      },
      set: function (value) {
        this.$emit("update", { fieldId: this.data.fieldId, value });
        this.$emit("clear", { fieldName: this.data.name });
        // this.$store.commit('data_card/setFormField', this.data)
      },
    },
    relationValue: {
      get: function () {
        if (this.data.isRelation) {
          return this.$store.getters["data_card/getDataFieldByName"](
            this.data.fieldRelation
          );
        } else {
          return null;
        }
      },
    },
    isValid() {
      return this.$store.getters["data_card/getDataFieldByFieldId"](
        `${this.data.fieldId}`
      ).state;
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
</style>
