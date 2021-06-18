<template>
  <b-form-group
    :label="label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <string-masked
      v-if="data.mask"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
    ></string-masked>
    
    <string-autocomplete
      v-else
      :data="data"
      :edit="edit"
      @update="updateField($event)"
    ></string-autocomplete>
    
  </b-form-group>
</template>

<script>

import StringAutocomplete from "./StringAutocomplete";
import StringMasked from "./StringMasked";
export default {
  name: "ControlString",
  components: { StringAutocomplete, StringMasked },
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
  computed: {
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
