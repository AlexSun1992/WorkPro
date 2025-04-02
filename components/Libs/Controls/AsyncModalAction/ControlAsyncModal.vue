<template>
  <div>
    <button type="button" @click="openModal">Кнопка</button>

    <control-modal
      ref="modal"
      :data="data"
      @open="openModalHandler"
      @close="closeModal"
      :show-cancel="false"
      :show-close="false"
      :show-ok="isRequestError"
    >
      <template>
        <span v-html="dialogBodyText"></span>
      </template>
    </control-modal>
  </div>
</template>

<script>
import ControlModal from "./ControlModal";
import { SUCCESS_ID_STATUS, ERROR_ID_STATUS } from "./asyncModal.constant";

export default {
  name: "ControlAsyncModal",
  components: { ControlModal },
  props: {
    data: {
      type: Object,
      default() {
        return {
          value:
            "Пожалуйста подождите&#8230",
          label: "Проверка данных",
          // число попыток выполнить один запрос
          attempts: 6,
          // секунды на выполнение одного запроса
          interval: 5,
        };
      },
    },
  },
  computed: {
    attemptsComputed() {
      return this.data?.attempts ?? 6;
    },
    intervalComputed() {
      const interval = this.data?.interval ?? 5;

      return interval * 1000;
    },
    cardId() {
      const id = this.$store.state.data_card.cardId;

      return id ? Number(id) : null;
    },
    dialogBodyText() {
      return this.dialogMessage ?? this.responseData?.SMESSAGE ?? this.data.value;
    },
  },
  data() {
    return {
      isOpen: false,
      responseData: null,
      dialogMessage: null,
      isRequestError: false,
    };
  },
  methods: {
    closeModal() {
      this.$refs.modal.closeModal();
      this.resetForm();
    },
    resetForm() {
      this.responseData = null;
      this.dialogMessage = null;
      this.isRequestError = false;
    },
    closeModalWithTimeout(timeout = 0) {
      setTimeout(() => this.closeModal(), timeout * 1000);
    },
    openModal() {
      this.$refs.modal.openModal();
    },
    openModalHandler() {
      this.getRequestData();
    },
    getRequestData() {
      this.responseData = null;

      this.executeRequestWithTimeout();
    },
    async executeRequest() {
      return this.$axios
        .post(
          "am/main/v2/osago/CreatePolicySendNsis",
          { ID: this.cardId },
          { signal: AbortSignal.timeout(this.intervalComputed) }
        )
    },
    executeRequestWithTimeout(attempts = this.attemptsComputed) {
      if (!attempts || this.responseData?.IDSTATUS === ERROR_ID_STATUS) {
        this.errorDataHandler();

        return;
      }

      this.executeRequest().then((data) => {
        this.successDataHandler(data?.data);
      });

      setTimeout(() => {
        this.executeRequestWithTimeout(attempts - 1);
      }, this.intervalComputed);
    },
    successDataHandler(data) {
      this.setData(data);

      if (this.responseData?.IDSTATUS === SUCCESS_ID_STATUS) {
        this.dialogMessage = "Проверка выполнена успешно";

        this.closeModalWithTimeout(3);
      }
    },
    errorDataHandler() {
      this.dialogMessage = "Кажется, потребуется ещё немного времени. Пожалуйста, повторите попытку чуть поже.";
      this.isRequestError = true;
    },
    setData(data) {
      this.responseData = data[0] ? { ...data[0] } : null;
    },
  },
};
</script>

<style scoped></style>
