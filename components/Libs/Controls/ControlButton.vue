<template>
  <button
    type="button"
    @click="updateValue()"
    :id="data.webId ? data.webId : ''"
    :disabled="
      (isBtnCurLabelNeeded === true &&
        disablePeriod <= 60 &&
        getBtnId &&
        err === false) ||
      disabled
    "
    :class="loading ? 'spinning' : ''"
  >
    {{ getLabel }}

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
      disablePeriod: 0,
      error: false,
    };
  },

  methods: {
    async updateValue() {
      this.clicked = true;

      if (!this.loading && !this.disabled) {
        const fields = this.$store.getters["data_card/getForm"];
        if (typeof eventHandler === "function") {
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
        }
        this.$emit("update", {
          fieldId: this.data.fieldId,
          value: this.data.name,
          action: this.data.name.includes("Item"),
        });
      }

      if (this.err === false) {
        const getIntervalValue = setInterval(() => {
          this.disablePeriod += 1;
          if (this.disablePeriod === 60) {
            clearInterval(getIntervalValue);
            this.$store.commit("data_card/setNewLabelValue", false);
            this.disablePeriod = 0;
          }
        }, 1000);
      }
    },
  },

  computed: {
    getLabel() {
      if (
        this.isBtnCurLabelNeeded === true &&
        this.err === false &&
        this.getBtnId &&
        this.clicked === false
      ) {
        return `${this.data.label + " " + this.disablePeriod}`;
      }
      return this.data.label;
    },

    err() {
      return this.$store.getters["data_card/getSavedError"];
    },
    getBtnId() {
      if (this.data.fieldId === 51293) {
        return true;
      }
      return false;
    },
    isBtnCurLabelNeeded() {
      return this.$store.getters["data_card/getBtnCurNtype"];
    },
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
