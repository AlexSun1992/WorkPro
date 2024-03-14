<template>
  <button
    type="button"
    @click="updateValue()"
    :id="data.webId ? data.webId : ''"
    :disabled="isDisabled"
    :class="isLoading ? 'spinning' : ''"
  >
    {{ getLabel }}
    <b-spinner
      v-if="isLoading && isFetching"
      variant="success"
      label="Spinning"
    ></b-spinner>
  </button>
</template>

<script>
const DEFAULT_DISABLE_PERIOD = 60;
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
      disablePeriod: 0,
      timerId: null,
    };
  },

  beforeDestroy() {
    clearInterval(this.timerId);
  },

  methods: {
    async updateValue() {
      if (!this.isLoading && !this.isDisabled) {
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
    },
  },

  computed: {
    actionId() {
      return Number(this.data.name.replace("Item", ""));
    },

    actionParams() {
      const actionList = this.$store.getters["menu/flatmenu"];

      const menuItem = actionList.find(
        (item) => item.IDITEM === Number(this.$route.params.idItem)
      );

      const actionParams = menuItem.ACTIONSCUR.find(
        (item) => item.ID === this.actionId
      );
      return actionParams;
    },

    isDownloadControlButton() {
      return Boolean(this.data.isDownloadControl);
    },

    isActionWithPause() {
      if (this.actionParams.NTYPE === 56) {
        return true;
      }
      return false;
    },

    getLabel() {
      if (this.disablePeriod > 0) {
        return `${this.data.label} (${this.disablePeriod} сек.)`;
      }
      return this.data.label;
    },

    getSavedError() {
      return this.$store.getters["data_card/getSavedError"];
    },

    getFlatMenu() {
      return this.$store.getters["data_card/flatmenu"];
    },

    isLoading() {
      return this.isDownloadControlButton
        ? this.isFetching
        : this.$store.getters["data_card/getLoading"];
    },

    isDisabled() {
      return this.isDownloadControlButton
        ? this.isFetching
        : this.disablePeriod > 0 || this.data.readonly || this.isLoading;
    },

    isFetching() {
      return this.$store.getters["data_card/isFetchingAction"](this.actionId);
    },
  },
  watch: {
    isFetching() {
      if (
        this.isActionWithPause &&
        !this.isLoading &&
        this.getSavedError === false
      ) {
        this.disablePeriod = DEFAULT_DISABLE_PERIOD;
        clearInterval(this.timerId);
        this.timerId = setInterval(() => {
          this.disablePeriod -= 1;
        }, 1000);
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
