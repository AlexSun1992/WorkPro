<template>
  <button
    type="button"
    @click="updateValue()"
    :id="data.webId ? data.webId : ''"
    :disabled="
      (isBtnCurLabelNeeded === true && disablePeriod <= 6 && getBtnId) ||
      disabled
    "
    :class="loading ? 'spinning' : ''"
  >
    {{
      isBtnCurLabelNeeded && getBtnId
        ? `Запросить код можно через ${disablePeriod}`
        : data.label
    }}
    <!-- {{ loading }}
    {{ isError }}
    {{ errorMessage }} -->
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
      //
      // const test = this.$store.getters["data_card/getLoading"];
      // console.log("test:", test);
      //
      // const isSavedError = this.$store.getters["data_card/getSavedError"];
      // console.log("isSavedError:", isSavedError);
      //
      const getError = this.$store.getters["data_card/getErrorMessage"];
      console.log("getError:", getError);
      //

      if (getError !== undefined) {
        console.log("Есть ошибка");
      }

      if (getError === undefined) {
        console.log("Ошибки нет");
      }

      const getIntervalValue = setInterval(() => {
        this.disablePeriod += 1;
        if (this.disablePeriod === 60) {
          this.disablePeriod = 0;
          clearInterval(getIntervalValue);
          this.$store.commit("data_card/setNewLabelValue", false);
        }
      }, 1000);
    },
  },
  computed: {
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
    isError() {
      return this.$store.getters["data_card/getSavedError"];
    },
    errorMessage() {
      return this.$store.getters["data_card/getErrorMessage"];
    },
  },
  watch: {
    loading() {
      if (!this.loading) {
        this.clicked = false;
      } else console.log("loading:", this.loading);
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
