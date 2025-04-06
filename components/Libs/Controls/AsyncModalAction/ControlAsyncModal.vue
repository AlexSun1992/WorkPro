<template>
  <div>
    <button type="button" @click="openModal">Кнопка</button>

    <control-modal
      ref="modal"
      :data="data"
      @open="openModalHandler"
      @close="closeModal"
      @ok="refreshPage"
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
import {
  SUCCESS_ID_STATUS,
  ERROR_ID_STATUS,
  AWAIT_ERROR_MESSAGE,
  COMMON_ERROR_MESSAGE,
  SUCCESS_REQUEST_MESSAGE,
} from "./asyncModal.constant";
import { testData } from "./controlAsuncModal.testData";

export default {
  name: "ControlAsyncModal",
  components: { ControlModal },
  props: {
    data: {
      type: Object,
      default() {
        return {
          value: "Пожалуйста подождите&#8230",
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
      const id = this.$store.state.data_card?.cardId ?? -1;

      return id ? Number(id) : null;
    },
    dialogBodyText() {
      return (
        this.dialogMessage ?? this.responseData?.SMESSAGE ?? this.data.value
      );
    },
    isFinishResponse() {
      return this.isRequestError || this.isRequestSuccess;
    },
  },
  data() {
    return {
      isOpen: false,
      responseData: null,
      dialogMessage: null,
      isRequestError: false,
      isRequestSuccess: false,
    };
  },
  methods: {
    closeModal() {
      this.$refs?.modal?.closeModal();
    },
    refreshPage() {
      this.$router.go(null);
    },
    resetForm() {},
    afterSuccessDataCheck() {
      setTimeout(() => {
        const url = this.responseData.SURL;

        this.closeModal();

        if (url) {
          this.$router.push(url);
        }
      }, 3000);
    },
    openModal() {
      this.responseData = null;
      this.dialogMessage = null;
      this.isRequestError = false;
      this.isRequestSuccess = false;

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
      this.$axios
        .post(
          "am/main/v2/osago/CreatePolicySendNsis",
          { ID: this.cardId },
          { signal: AbortSignal.timeout(this.intervalComputed) }
        )
        .then((data) => {
          this.successDataHandler(data?.data);
        })
        .catch((err) => {
          this.errorDataHandler(COMMON_ERROR_MESSAGE);
        });
    },
    executeRequestWithTimeout(attempts = this.attemptsComputed) {
      if (!attempts || this.responseData?.IDSTATUS === ERROR_ID_STATUS) {
        this.errorDataHandler(AWAIT_ERROR_MESSAGE);

        return;
      }

      this.executeRequest();

      setTimeout(() => {
        if (!this.isFinishResponse) {
          this.executeRequestWithTimeout(attempts - 1);
        }
      }, this.intervalComputed);
    },
    successDataHandler(data) {
      this.setData(data);

      if (this.responseData?.IDSTATUS === SUCCESS_ID_STATUS) {
        this.isRequestSuccess = true;
        this.dialogMessage = SUCCESS_REQUEST_MESSAGE;

        this.afterSuccessDataCheck();

        return;
      }

      this.errorDataHandler(COMMON_ERROR_MESSAGE);
    },
    errorDataHandler(msg) {
      this.dialogMessage = msg ?? COMMON_ERROR_MESSAGE;
      this.isRequestError = true;
    },
    setData(data) {
      this.responseData = data[0] ? { ...data[0] } : null;
    },
  },
};
</script>

<style scoped></style>
