<template>
  <b-button
    class="mt-4"
    @click="updateValue()"
    :disabled="loading"
    variant="primary"
  >
    <div class="button">
      {{ data.label }}
      <b-spinner
        v-if="loading && clicked"
        class="ml-2"
        style="width: 1.2rem; height: 1.2rem"
        variant="success"
        label="Spinning"
      ></b-spinner>
    </div>
  </b-button>
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
    store: {
      type: String,
      required: false,
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
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: this.data.name,
      });
    },
  },
  computed: {
    loading() {
      return this.$store.getters["data_card/getLoading"];
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
