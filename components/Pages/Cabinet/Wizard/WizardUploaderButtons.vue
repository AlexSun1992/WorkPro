<template>
  <div class="mt-4 buttons row">
    <div class="col-auto">
      <b-button
        :disabled="loading || !isValidFiles"
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
  props: ["loading"],
  methods: {
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
      global.history.back();
    },
  },
  computed: {
    isValidFiles() {
      return this.$store.getters["uploader/isValidFiles"];
    },
  },
};
</script>

<style scoped></style>
