<template>
  <form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label
      ><span v-html="data.label"></span>
      <span
        v-if="data.helpText"
        class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip
            :with-arrow="true"
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText"></span></vue-easy-tooltip></span></span
    ></template>

    <currency-input
      class="form-control"
      :class="validClass"
      :placeholder="placeholder"
      :disabled="!edit ? !edit : data.readonly"
      v-model="fieldValue"
      :allow-negative="false"
      :currency="{ suffix: ` ${placeholder}` }"
      :precision="precision"
      @blur="eventHandlerBlur"
      :id="oneToManyData ? String(oneToManyData.index) : data.name"
    />

    <p
      v-if="data.dangerText"
      class="danger-text"
    >
      {{ data.dangerText }}
    </p>
    <div
      class="invalid-feedback"
      v-if="data.state === false"
    >
      {{ data.error ? data.error : "Обязательно для заполнения" }}
    </div>
  </form-group>
</template>

<script>
import { CurrencyInput } from "vue-currency-input";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlCustomDouble",
  components: { CurrencyInput, FormGroup },
  props: {
    data: {
      type: Object,
      required: true,
    },
    oneToManyData: {
      type: Object,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const { $store } = instance.proxy;
    const precision = computed(() => (props.data?.mask ? props.data.mask.length : 2));
    const placeholder = computed(() => props.data.placeholder || "");

    const fieldValue = computed({
      get() {
        if (props.data.value !== 0) {
          return props.data.value;
        }
        return {};
      },
      set(value) {
        emit("update", {
          fieldId: props.data.fieldId,
          name: props.data.name,
          value: value !== null ? Number(value) : null,
        });
      },
    });
    const validClass = computed(() => {
      if (props.data.state !== null && props.data.state !== undefined) {
        return props.data.state === true ? "is-valid" : "is-invalid";
      }
      return "";
    });

    function eventHandlerBlur() {
      emit("blur", {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value: props.data.value,
      });
    }
    onMounted(() => {
      if (props.data?.value) {
        $store.commit("data_card/setFormField", {
          fieldId: props.data.fieldId,
          name: props.data.name,
          value: !Number(props.data?.value) ? props.data?.value : Number(props.data?.value),
        });
      }
    });

    return {
      precision,
      placeholder,
      fieldValue,
      validClass,
      eventHandlerBlur,
    };
  },
};
</script>

<style scoped></style>
