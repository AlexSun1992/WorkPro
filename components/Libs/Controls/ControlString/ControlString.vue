<template>
  <b-form-group
    :label="label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label
      ><span v-html="label"></span>
      <span
        v-if="data.helpText"
        class="position-relative"
        >&nbsp;
        <span
          class="tooltipster"
          v-click-outside="outSide"
          @click="toggleTooltipVisible(true)"
          @mouseenter="toggleTooltipVisible(true)"
          @mouseleave="toggleTooltipVisible(false)"
        >
          (?)<vue-easy-tooltip
            v-model="isTooltipVisible"
            :with-arrow="true"
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText"></span></vue-easy-tooltip></span></span
    ></template>
    <string-masked
      :id="data.fieldId"
      v-if="data.mask"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
      @blur="$emit('blur', $event)"
    />

    <string-autocomplete
      :id="data.fieldId"
      v-if="!data.mask && isAutocomplete"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
      :oneToMany="oneToManyData"
    />

    <string-simple
      :id="data.fieldId"
      v-if="!data.mask && !isAutocomplete"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
      :oneToMany="oneToManyData"
    />
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";
import ClickOutside from "vue-click-outside";
import StringAutocomplete from "./StringAutocomplete";
import StringMasked from "./StringMasked";
import StringSimple from "./StringSimple";
import { isFieldNameBelogToAutocomplete } from "./StringAutocomplete.helpers";

export default {
  name: "ControlString",
  components: { StringAutocomplete, StringMasked, StringSimple, BFormGroup },
  props: {
    data: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      required: true,
    },
    oneToManyData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      fieldsNameHub: [],
      isTooltipVisible: false,
    };
  },
  mounted() {
    if (this.data?.value) {
      this.$store.commit("data_card/setFormField", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.data.value,
      });
    }
  },

  computed: {
    isAutocomplete() {
      return isFieldNameBelogToAutocomplete(this.data.name);
    },

    label() {
      return `${this.data.label}`;
    },
  },
  directives: {
    ClickOutside,
  },
  methods: {
    updateField(e) {
      this.$emit("update", e);
    },
    toggleTooltipVisible(value) {
      this.isTooltipVisible = value;
    },
    outSide() {
      this.toggleTooltipVisible(false);
    },
  },
};
</script>
