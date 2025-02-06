<template>
  <div>
    <button type="button" @click="showModal">Авторизоваться</button>

    <b-modal
      id="sms-auth-confirm-modal"
      v-model="isModalVisible"
      hide-footer
      :centered="true"
      :static="true"
      content-class="sms-confirm-modal"
      title="Введите код"
    >
      <form :action="submitForm">

        <input type="text">

        <input type="text">

        <button type="button"></button>
      </form>
    </b-modal>
  </div>
</template>

<script>

export default {
  name: "ControlAuthorization",
  components: {  },
  data: () => ({
    isModalVisible: false,
  }),
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    hideModal() {
      this.isModalVisible = false;
    },
    submitForm() {

    }
  },
};
</script>

<style lang="scss" scoped></style>
