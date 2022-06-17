<template>
  <b-form-group
    :label="label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template v-slot:label
      ><span v-html="label"></span
      ><span v-if="data.helpText">
        (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
          <span v-html="data.helpText"></span></vue-easy-tooltip></span
    ></template>
    <string-masked
      :data="data"
      :edit="edit"
      @update="updateField($event)"
      @blur="$emit('blur', $event)"
    ></string-masked>

    <string-autocomplete
      :data="data"
      :edit="edit"
      @update="updateField($event)"
    ></string-autocomplete>

    <string-text :data="data" :edit="edit" @update="updateField($event)">
    </string-text>
  </b-form-group>
</template>

<script>
import StringAutocomplete from "./StringAutocomplete";
import StringMasked from "./StringMasked";
import StringText from "./StringText.vue";
export default {
  name: "ControlString",
  components: { StringAutocomplete, StringMasked, StringText },
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
