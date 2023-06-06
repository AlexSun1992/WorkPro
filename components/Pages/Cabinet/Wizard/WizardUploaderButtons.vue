<template>
  <div class="mt-4 buttons row">
    <div class="col-auto">
      <b-button :disabled="loading" variant="success" @click="saveUploader">
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
      this.$emit("saveUploader");
    },
  },
};
</script>

<style scoped></style>
