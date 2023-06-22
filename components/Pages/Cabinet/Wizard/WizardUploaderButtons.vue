<template>
  <div class="mt-4 buttons row">
    <div class="col-auto">
      <b-button
        :disabled="loading || isInValidFiles"
        variant="success"
        @click="saveUploader"
      >
        Отправить документы
        <b-spinner v-if="loading" variant="danger" label="Spinning" />
      </b-button>
    </div>
    <div class="col-auto">
      <b-button @click="goBack"> Назад </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WizardUploaderButtons",
  props: ["currentTab", "tabs", "qty", "loading"],
  methods: {
    getCurrentIndex() {
      return this.tabs.findIndex(
        (item) => item.idItem == this.currentTab.idItem
      );
    },
    async saveUploader() {
      const h = this.$createElement;
      const titleVNode = h("div", {
        domProps: {
          innerHTML:
            "<b>Вы уверены?</b><br>Убедитесь, что документы прикреплены корректно и Вы ничего не забыли. <br>Повторно отправить документы нельзя.",
        },
      });
      this.$bvModal
        .msgBoxConfirm(titleVNode, {
          title: "Вы уверены?",
          size: "md",
          buttonSize: "md",
          okVariant: "success",
          okTitle: "Да, отправить",
          cancelTitle: "Нет, передумал",
          footerClass: "p-2",
          hideHeaderClose: false,
          modalClass: ["cabinet"],
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.$emit("saveUploader");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    goBack() {
      const tab = this.tabs[this.getCurrentIndex() - 1];
      this.$emit("goBack", tab);
    },
  },
  computed: {
    isInValidFiles() {
      return this.$store.getters["uploader/isInValidFiles"];
    },
  },
};
</script>

<style scoped></style>
