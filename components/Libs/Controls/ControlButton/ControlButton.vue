<template>
  <button
    type="button"
    @click="updateValue()"
    :id="data.webId ? data.webId : ''"
    :disabled="
      (disablePeriod !== 60 && getAction === true && getSavedError === false) ||
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
      disablePeriod: 60,
      dataTimeOut: 0,
      getIntervalValue: null,
    };
  },

  created() {
    this.disablePeriod = 60;
    clearInterval(this.getIntervalValue);
    this.getIntervalValue = null;
  },

  methods: {
    async updateValue() {
      this.clicked = true;
      this.disablePeriod = 60;
      if (this.disablePeriod !== this.dataTimeOut) {
        clearInterval(this.getIntervalValue);
      }
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

      if (this.getSavedError === false) {
        this.getIntervalValue = setInterval(() => {
          this.disablePeriod -= 1;
          if (this.disablePeriod === this.dataTimeOut) {
            clearInterval(this.getIntervalValue);
            this.disablePeriod = 60;
          }
        }, 1000);
      }
    },
  },

  computed: {
    getAction() {
      const actionList = this.$store.getters["menu/flatmenu"];

      const actionId = this.data.name.replace("Item", "");

      const menuItem = actionList.find(
        (item) => item.IDITEM == this.$route.params.idItem
      );

      const CUR = menuItem.ACTIONSCUR.find((item) => item.ID == actionId);

      if (CUR.NTYPE === 56) {
        return true;
      }
      return null;
    },

    getLabel() {
      if (
        this.disablePeriod !== 60 &&
        this.getAction === true &&
        this.getSavedError === false
      ) {
        return `${this.data.label + " " + this.disablePeriod}`;
      }
      return this.data.label;
    },

    getSavedError() {
      return this.$store.getters["data_card/getSavedError"];
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
