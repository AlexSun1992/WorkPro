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
import { thisExpression } from "@babel/types";

export default {
  name: "ControlButton",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    params: {
      type: Object,
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
        console.log("updateValuet");
        // console.log(
        //   this.$route.params.idModule,
        //   this.data.name.includes("Item"),
        //   this.$route.params.idCard,
        //   "dff"
        // );
        const menu = this.$store.getters["menu/flatmenu"].find((item) => item);

        // console.log(menu, "menu");
        // if (menu.ACTIONSCUR.length > 0) {
        const action = menu.ACTIONSCUR.find((item) => item.ID == 39691);
        console.log(action, "action");
        //   await this.$store.dispatch("data_card/fetchActionParams", {
        //     moduleId: action.IDADMMODULE,
        //     actionId: this.data.name.replace("Item", ""),
        //     cardId: action.NITEM,
        //   });
        // }
        // if (menu.ACTIONSCUR.length > 0) {
        //   const action = menu.ACTIONSCUR.find((item) => item.ID == 39691);
        //   await this.$store.dispatch("data_card/fetchActionParams", {
        //     moduleId: action.IDADMMODULE,
        //     actionId: this.data.name.replace("Item", ""),
        //     cardId: action.NITEM,
        //   });
        // }

        const sendData = {
          actionId: this.data.name.replace("Item", ""),
          relActionId: action.rel,
          relId: this.$route.params.idRel || this.params.idRel,
          rowId: this.$route.params.idCard || this.params.idCard,
        };
        console.log(sendData, "sendData");

        const answer = await this.$store.dispatch(
          "data_card/executeAction",
          swndData
        );
        console.log(answer, "ans");
        this.$emit("update", {
          fieldId: this.data.fieldId,
          value: this.data.name,
          action: this.data.name.includes("Item"),
        });

        const fields = this.$store.getters["data_card/getForm"];
        console.log(fields, "fields");

        const updatedFields = await eventHandler(
          fields.map((item) => ({ ...item })),
          this.data,
          "action"
        );
        if (updatedFields) {
          this.$store.commit("data_card/setForm", updatedFields || fields);
          const isError = updatedFields.some((item) => item.error === true);
          if (isError) {
            return isError;
          }
        }
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
