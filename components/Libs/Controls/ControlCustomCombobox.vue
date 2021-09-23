<template>
  <div>
    <b-form-group
      :label="data.label"
      :class="{ required: data.required }"
      :label-for="data.name"
    >
      <template v-slot:label><span v-html="data.label"></span></template>
      <autocomplete
        ref="autocomplete"
        v-model="data.value"
        @change="update"
        :options="data.options"
        :disabled="!edit ? !edit : data.readonly"
        :class="{ 'error-outline': isValid == false }"
        :state="data.state"
      ></autocomplete>
      <p v-if="data.helpText" class="help-text">{{ data.helpText }}</p>
      <p v-if="data.dangerText" class="danger-text">{{ data.dangerText }}</p>
      <b-form-invalid-feedback>
        Обязательно для заполнения
      </b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  name: "ControlCustomCombobox",
  components: {
    Autocomplete,
  },
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
  methods: {
    update() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: String(this.data.value),
      });
    },
  },
  computed: {
    isValid() {
      return this.$store.getters["data_card/getDataFieldByFieldId"](
        `${this.data.fieldId}`
      )?.state;
    },
  },

  created() {
    this.data.value = this.data.value ? this.data.value : null;
    if (this.data.placeholder !== undefined && this.data.value === null) {
      const item = {
        value: null,
        text: this.data.placeholder,
        disabled: true,
      };

      if (this.data.options[0].text !== this.data.placeholder) {
        this.data.options.unshift(item);
      }
    }
  },
};
</script>
