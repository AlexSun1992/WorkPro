<template>
  <form-group
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
          v-click-outside="outSide"
          class="tooltipster"
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
      v-if="data.mask"
      :id="data.fieldId"
      :data="data"
      :edit="edit"
      @update="updateField($event)"
      @blur="$emit('blur', $event)"
    />

    <string-autocomplete
      v-if="!data.mask && isAutocomplete"
      :id="data.fieldId"
      :data="data"
      :edit="edit"
      :one-to-many="oneToManyData"
      @update="updateField($event)"
    />

    <string-simple
      v-if="!data.mask && !isAutocomplete"
      :id="data.fieldId"
      :data="data"
      :edit="edit"
      :one-to-many="oneToManyData"
      @update="updateField($event)"
    />
  </form-group>
</template>

<script>
import ClickOutside from "vue-click-outside";
import StringAutocomplete from "./StringAutocomplete";
import StringMasked from "./StringMasked";
import StringSimple from "./StringSimple";
import { isFieldNameBelogToAutocomplete } from "./StringAutocomplete.helpers";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlString",
  components: { StringAutocomplete, StringMasked, StringSimple, FormGroup },
  directives: {
    ClickOutside,
  },
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

  computed: {
    isAutocomplete() {
      return isFieldNameBelogToAutocomplete(this.data.name);
    },

    label() {
      return `${this.data.label}`;
    },
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
