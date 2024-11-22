<template>
  <b-form-group
    :label="label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template v-slot:label
      ><span v-html="label"></span>
      <span v-if="data.helpText" class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
            <span v-html="data.helpText"></span></vue-easy-tooltip></span></span
    ></template>
    <string-masked
      ref="autocomplete"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
      @blur="blurField($event)"
    />
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";
import StringMasked from "../ControlString/StringMasked.vue";

export default {
  name: "ControlTimePicker",
  components: { StringMasked, BFormGroup },
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
      fieldsNameHub: [],
    };
  },

  computed: {
    label() {
      return `${this.data.label}`;
    },
  },
  methods: {
    updateField(e) {
      if (e.value.length === 4) {
        const originalString = e.value;
        const halfLength = Math.floor(originalString.length / 2);

        const hours = originalString.slice(0, halfLength);
        const minutes = originalString.slice(halfLength);

        if (Number(hours) > 23 || Number(minutes) > 59) {
          this.$emit("update", { ...e, value: "" });
          return;
        }
      }

      this.$emit("update", e);
    },
    blurField(e) {
      if (!e.value || e.value.length < 3) {
        this.$emit("update", { ...e, value: "" });
        this.$emit("blur", { ...e, value: "" });
      } else if (e.value.length === 3) {
        const time = `${e.value}0`;
        this.updateField({ ...e, value: time });
      }
    },
  },
};
</script>
