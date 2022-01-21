<template>
  <button type="button" @click="updateValue()" :disabled="loading || disabled">
    {{ data.label }}
    <b-spinner
      v-if="loading && clicked"
      class="ml-2"
      style="width: 1.2rem; height: 1.2rem"
      variant="success"
      label="Spinning"
    ></b-spinner>
  </button>
</template>

<script>
export default {
  name: "ControlButton",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      clicked: false,
    };
  },

  methods: {
    updateValue() {
      this.clicked = true;
      if (!this.loading && !this.disabled) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          value: this.data.name,
          action: this.data.name.includes("Item"),
        });
      }
    },
  },
  computed: {
    loading() {
      return this.$store.getters["data_card/getLoading"];
    },
    disabled() {
      return this.data.readonly;
    },
  },
  watch: {
    loading() {
      if (!this.loading) {
        this.clicked = false;
      }
    },
  },
};
</script>

<style>
.button {
  display: flex;
  align-items: center;
}
</style>
