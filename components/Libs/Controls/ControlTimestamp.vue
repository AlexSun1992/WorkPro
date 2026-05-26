<template>
  <div>
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
              :with-arrow="true"
              position="top"
              :offset="4"
            >
              <span v-html="data.helpText" /></vue-easy-tooltip></span
        ></span>
      </template>
      <date-picker
        :id="data.fieldId"
        v-model="fieldValue"
        v-maska="maskTemplate"
        :disabled="!edit ? !edit : data.readonly"
        type="date"
        value-type="DD.MM.YYYY"
        :placeholder="data.placeholder"
        format="DD.MM.YYYY"
        :first-day-of-week="1"
        :lang="lang"
        :input-class="isValid"
        :clearable="!data.required"
        @blur="blur"
      />
      <p
        v-if="data.dangerText"
        class="danger-text"
      >
        {{ data.dangerText }}
      </p>

      <div
        v-if="data.state === false"
        class="invalid-feedback d-block"
      >
        {{ data.error || "Обязательно для заполнения" }}
      </div>
    </form-group>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import "@assets/scss/vue2-datepicker.css";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/ru";
import { computed, ref, onMounted, getCurrentInstance } from "vue";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlTimestamp",
  components: { DatePicker, FormGroup },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const store = instance.proxy.$store;
    const lang = ref("ru");
    const maskTemplate = ref("##.##.####");

    const updateValue = (value) => {
      emit("update", {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value,
      });
    };
    const blur = () => {
      updateValue(fieldValue.value);
    };

    const fieldValue = computed({
      get() {
        return props.data.value;
      },
      set(value) {
        updateValue(value);
      },
    });
    const isValid = computed(() => {
      if (props.data.state === false) {
        return "is-invalid";
      }
      if (props.data.state === true && props.data.value) {
        return "is-valid";
      }
      return null;
    });

    onMounted(() => {
      if (props.data?.value) {
        store.commit("data_card/setFormField", {
          fieldId: props.data.fieldId,
          name: props.data.name,
          value: props.data.value,
        });
      }
    });

    return { lang, maskTemplate, fieldValue, isValid, blur };
  },
};
</script>

<style scoped>
.invalid-feedback {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}
</style>
