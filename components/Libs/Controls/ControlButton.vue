<template>
  <button
    type="button"
    @click="updateValue()"
    :id="data.webId ? data.webId : ''"
    :disabled="disabled"
    :class="loading ? 'spinning' : ''"
  >
    {{ data.label }}
    <b-spinner
      v-if="loading && clicked"
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
    async updateValue() {
      this.clicked = true;
      if (!this.loading && !this.disabled) {
        const fields = this.$store.getters["data_card/getForm"];

        const updatedFields = await eventHandler(
          fields.map((item) => ({ ...item })),
          this.data,
          "action"
        );
        if (updatedFields) {
          this.$store.commit("data_card/setForm", updatedFields || fields);
          const isError = updatedFields.some((item) => item.error === true);
          if (isError) {
            return;
          }
        }
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
