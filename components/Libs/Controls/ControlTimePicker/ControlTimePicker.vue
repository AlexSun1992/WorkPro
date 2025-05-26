<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template v-slot:label>
      <span v-html="data.label" />
      <span
        v-if="data.helpText"
        class="position-relative"
        >&nbsp;
        <span class="tooltipster"
          >(?)
          <vue-easy-tooltip
            :with-arrow="true"
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText" />
          </vue-easy-tooltip>
        </span>
      </span>
    </template>
    <b-form-input
      ref="userInput"
      v-model="value"
      v-mask="'##:##'"
      class="form-control"
      :placeholder="data.placeholder"
      :disabled="!edit ? !edit : data.readonly"
      type="text"
      :state="status"
      :formatter="timeFormatter"
      autocomplete="off"
      @blur="handleBlur"
      :id="data.name"
    />
    <b-form-invalid-feedback :state="status">{{
      data.error ? data.error : "Обязательно для заполнения"
    }}</b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";
import { debounce } from "../../../../utils/delayUtils";

export default {
  name: "ControlTimePicker",
  components: { BFormGroup },
  props: {
    data: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      value: "",
      status: null,
      debouncedSetValue: debounce(this.setValue, 200),
    };
  },

  computed: {
    outerState() {
      return this.data.state;
    },
  },

  mounted() {
    if (this.data.value) {
      this.value = this.data.value;
      this.setValue();
    }
  },

  watch: {
    value() {
      this.status = this.value.length > 4;
      this.debouncedSetValue();
    },
    outerState(newVal) {
      this.status = newVal;
    },
  },

  methods: {
    timeFormatter($event) {
      const value = $event.replace(/\D/g, "");

      let hour = value.substr(0, 2);
      let minutes = value.substr(2, 2);

      if (Number(hour) > 23) {
        hour = 23;
      }

      if (Number(minutes) > 59) {
        minutes = 59;
      }

      return $event.length > 2 ? `${hour}:${minutes}` : `${hour}`;
    },
    setValue() {
      const event = {
        value: this.value.replace(":", ""),
        name: this.data.name,
        fieldId: this.data.fieldId,
      };
      this.$emit("update", event);
    },
    handleBlur() {
      this.value = this.timeFormatter(this.value);
      if (this.value.length < 5) this.status = false;
    },
  },
};
</script>
