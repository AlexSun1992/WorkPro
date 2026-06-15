<template>
  <form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label>
      <span v-html="data.label" />
      <span
        v-if="data.helpText"
        class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText" /></vue-easy-tooltip></span
      ></span>
    </template>
    <autocomplete
      :id="selectId"
      ref="autocomplete"
      :placeholder="placeholder"
      :class="validClass"
      :auto-select="true"
      :search="search"
      :get-result-value="getResultValue"
      :default-value="getCurrentValue"
      :disabled="!edit ? !edit : data.readonly || isDisabledByRelation"
      @submit="handleSubmit"
      @blur="handleBlur"
    />
    <div
      v-if="isErr === false"
      class="invalid-feedback"
    >
      {{ data.error ? data.error : validationErrorText }}
    </div>
  </form-group>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import { computed, getCurrentInstance, onBeforeMount, ref, watch } from "vue";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlEnum",
  components: { FormGroup, Autocomplete },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const store = instance.proxy.$store;

    const autocomplete = ref(null);
    const placeholderValue = ref("Выберите из списка");
    const validationErrorText = ref(null);
    const isErr = ref(null);
    const selectId = ref(`id${props.data.fieldId}`);

    const placeholder = computed(() => (placeholderValue.value ? placeholderValue.value : props.data.placeholder));
    const options = computed(() => {
      if (store.getters["data_card/getDataFieldByFieldId"](props.data.fieldId)?.options) {
        return store.getters["data_card/getDataFieldByFieldId"](props.data.fieldId)?.options;
      }
      if (props.data.value) {
        return [props.data];
      }
      return [];
    });
    const validClass = computed(() => {
      if (props.data.required) {
        if (isErr.value === true) {
          return "is-invalid";
        }
        if (isErr.value === false) {
          return "is-valid";
        }

        if (props.data.state !== null && props.data.state !== undefined) {
          return props.data.state === true ? "is-valid" : "is-invalid";
        }
      }

      return "";
    });
    const getCurrentValue = computed(
      () => options.value.find((item) => item.value === Number(props.data?.value?.value))?.text
    );
    const relationValue = computed(() => {
      if (props.data.fieldRelation) {
        const arrayFieldRelation = props.data.fieldRelation.split(";");

        if (arrayFieldRelation.length) {
          const fieldsRelations = store.getters["data_card/getDataFieldsByNames"](arrayFieldRelation);

          if (fieldsRelations) {
            return fieldsRelations[0].value?.value;
          }
        }
      }
      return null;
    });
    const isDisabledByRelation = computed(() => {
      if (props.data.fieldRelation) {
        const arrayFieldRelation = props.data.fieldRelation.split(";");

        if (arrayFieldRelation.length) {
          const fieldsRelations = store.getters["data_card/getDataFieldsByNames"](arrayFieldRelation);

          if (fieldsRelations.length > 0) {
            return !fieldsRelations.every((item) => item.value?.value);
          }
        }
      }
      return false;
    });

    const handleSubmit = (result) => {
      document.activeElement.blur();

      emit("update", {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value: result || null,
      });
    };
    const initData = async () => {
      let data = { ...props.data };

      if (typeof props.data.value === "number") {
        data = {
          ...props.data,
          value: props.data.options.find((item) => item.value === props.data.value),
        };
      }

      await store.dispatch("data_card/fetchDic", { ...data });

      if (props.data.fieldRelation) {
        emit("update", {
          fieldId: data.fieldId,
          name: data.name,
          value: data.value || {},
        });
      }
    };
    const getResultValue = (item) => item.text;
    const search = (value) => {
      initData();

      if (value) {
        const findValueInList = options.value.find((i) => i.text.includes(autocomplete.value?.value));
        if (
          findValueInList === undefined &&
          autocomplete.value?.value !== undefined &&
          getCurrentValue.value === undefined
        ) {
          validationErrorText.value = `По фразе "${autocomplete.value?.value}" ничего не найдено`;
          isErr.value = true;
        }

        if (findValueInList !== undefined) {
          isErr.value = false;
        }
      }
      if (
        value.length < 1 ||
        options.value.find((item) => item.value === Number(props.data?.value?.value))?.text === value
      ) {
        placeholderValue.value = value;
        autocomplete.value.value = "";

        return options.value;
      }
      return options.value.filter((item) => item.text.includes(value));
    };
    const handleBlur = () => {
      if (Boolean(autocomplete.value.value) === false) {
        const value = options.value.find((item) => item.value == Number(props.data?.value?.value));

        if (value === undefined && props.data.required) {
          validationErrorText.value = "Обязательно для заполнения";
          isErr.value = true;
          autocomplete.value.value = "";
        }
        if (value) {
          autocomplete.value.value = value.text;
          handleSubmit(value);
        }
      } else {
        const find = options.value.find((i) => i.text.includes(autocomplete.value?.value));

        if (find !== undefined) {
          autocomplete.value.value = find.text;
          isErr.value = false;

          handleSubmit(find);
        } else {
          validationErrorText.value = "Выберите значение из выпадающего списка";
          isErr.value = true;
          autocomplete.value.value = "";
          placeholderValue.value = "";
          handleSubmit(null);
        }
      }
    };

    watch(relationValue, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        initData();
      }
    });

    watch(validClass, (value) => {
      if (props.data.required) {
        if (props.data.state === false && value === "is-invalid") {
          validationErrorText.value = "Обязательно для заполнения";
        }
      }
    });

    watch(getCurrentValue, (value) => {
      autocomplete.value.value = value;
    });

    onBeforeMount(() => {
      if (!props.data.fieldRelation) {
        initData();
      }
    });

    return {
      autocomplete,
      validationErrorText,
      isErr,
      selectId,
      placeholder,
      validClass,
      getCurrentValue,
      isDisabledByRelation,
      search,
      getResultValue,
      handleBlur,
      handleSubmit,
    };
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
