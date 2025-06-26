<template>
  <div>
    <b-form-group
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
      />
      <p
        v-if="data.dangerText"
        class="danger-text"
      >
        {{ data.dangerText }}
      </p>
      <b-form-invalid-feedback :state="data.state">
        {{ data.error ? data.error : "Обязательно для заполнения" }}
      </b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "../../../assets/scss/vue2-datepicker.css";
import "vue2-datepicker/locale/ru";
import { BFormGroup, BFormInvalidFeedback } from "bootstrap-vue";

export default {
  name: "ControlTimestamp",
  components: { DatePicker, BFormGroup, BFormInvalidFeedback },
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
      lang: "ru",
      state: "timestamp form-control",
      maskTemplate: "##.##.####",
    };
  },

  computed: {
    fieldValue: {
      get() {
        return this.data.value;
      },
      set(value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value,
        });
      },
    },
    isValid: {
      get() {
        if (this.data.state === false && !this.data.value) {
          return "is-invalid";
        }
        if (this.data.state === true && this.data.value) {
          return "is-valid";
        }
        return null;
      },
    },
  },
};
</script>
