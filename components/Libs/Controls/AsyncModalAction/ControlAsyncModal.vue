<template>
  <div>
    <button type="button" @click="openModal" :disabled="isOpenModalDisabled">
      Оформить полис
    </button>

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
      <template v-slot:title>
        <VerifyTimer :duration="timerSeconds" />
        <div>{{ data.label }}</div>
      </template>

      <template>
        <span v-html="dialogBodyText"></span>
      </template>
    </control-modal>
  </div>
</template>

<script>
import ControlModal from "./ControlModal";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer.vue";
import {
  SUCCESS_ID_STATUS,
  ERROR_ID_STATUS,
  AWAIT_ERROR_MESSAGE,
  COMMON_ERROR_MESSAGE,
  SUCCESS_REQUEST_MESSAGE,
} from "./asyncModal.constant";

export default {
  name: "ControlAsyncModal",
  components: { VerifyTimer, ControlModal },
  props: {
    data: {
      type: Object,
      default() {
        return {
          value:
            "Проверяем данные в АИС Страхование, дождитесь завершения операции",
          label: "Пожалуйста, подождите",
          // число попыток выполнить один запрос
          attempts: 6,
          // секунды на выполнение одного запроса
          secondsInterval: 5,
        };
      },
    },
  },
  computed: {
    attemptsComputed() {
      return this.data?.attempts ?? 6;
    },
    msIntervalComputed() {
      const interval = this.data?.secondsInterval ?? 5;

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
    timerSeconds() {
      return this.attemptsComputed * this.data.secondsInterval;
    },
  },
  data() {
    return {
      isOpen: false,
      responseData: null,
      dialogMessage: null,
      isRequestError: false,
      isRequestSuccess: false,
      isOpenModalDisabled: false,
    };
  },
  methods: {
    closeModal() {
      this.$refs?.modal?.closeModal();
    },
    refreshPage() {
      this.$router.go(null);
      this.setOpenModalBtnDisabled(true);
    },
    resetForm() {},
    afterSuccessDataCheck() {
      setTimeout(() => {
        const url = this.responseData.SURL;

        this.closeModal();

        if (url) {
          this.setOpenModalBtnDisabled(true);
          this.$router.push(url);
        }
      }, 10);
    },
    openModal() {
      this.responseData = null;
      this.dialogMessage = null;
      this.isRequestError = false;
      this.isRequestSuccess = false;
      this.isOpenModalDisabled = false;

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
          { signal: AbortSignal.timeout(this.msIntervalComputed) }
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
      }, this.msIntervalComputed);
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
    setOpenModalBtnDisabled(state = false) {
      this.isOpenModalDisabled = state;
    },
  },
};
</script>

<style scoped></style>
