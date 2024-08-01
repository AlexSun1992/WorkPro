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
      v-if="data.mask"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
      @blur="$emit('blur', $event)"
      :id="data.name"
    />

    <string-autocomplete
      v-if="!data.mask && isAutocomplete"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
      :id="data.name"
    />

    <string-simple
      v-if="!data.mask && !isAutocomplete"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
      :id="data.name"
    />
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";
import StringAutocomplete from "./StringAutocomplete.vue";
import StringMasked from "./StringMasked.vue";
import StringSimple from "./StringSimple.vue";
import { isFieldNameBelogToAutocomplete } from "./StringAutocomplete.helpers";

export default {
  name: "ControlString",
  components: { StringAutocomplete, StringMasked, StringSimple, BFormGroup },
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
    isAutocomplete() {
      return isFieldNameBelogToAutocomplete(this.data.name);
    },

    label() {
      return `${this.data.label}`;
    },
  },
  methods: {
    updateField(e) {
      this.data.value = e.value;
      this.$emit("update", e);
    },
  },
};
</script>
