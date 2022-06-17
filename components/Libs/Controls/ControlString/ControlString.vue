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
      v-if="data.mask"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
      @blur="$emit('blur', $event)"
    ></string-masked>

    <string-autocomplete
      v-if="!data.mask && checkFieldName(fieldsNameHub, data.name)"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
    ></string-autocomplete>

    <string-text
      v-if="!data.mask && !checkFieldName(fieldsNameHub, data.name)"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
    >
    </string-text>
  </b-form-group>
</template>

<script>
import StringAutocomplete from "./StringAutocomplete.vue";
import StringMasked from "./StringMasked.vue";
import StringText from "./StringText.vue";
import isFieldNameBelogToAutocomplete from "./isFieldNameBelogToAutocomplete.js";

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

  data() {
    return {
      fieldsNameHub: [
        "SFIRSTNAME",
        "SSECONDNAME",
        "STHIRDNAME",
        "ADDRESS",
        "SISSUED_WHERE",
        "SDOCDEP",
        "SNEWPHONE",
        "SCODEFIELD",
        "SNEWEMAIL",
      ],
    };
  },

  computed: {
    label() {
      return `${this.data.label}`;
    },
  },
  methods: {
    checkFieldName(fieldsNameHub, compareName) {
      const isAutocompleteField = fieldsNameHub.find((item) =>
        item.includes(compareName)
      );

      return Boolean(isAutocompleteField);
    },
    updateField(e) {
      this.data.value = e.value;
      this.$emit("update", e);
    },
  },
};
</script>
