<template>
  <div>
    <button
      class="btn-primary"
      type="button"
      @click="openModal"
      :disabled="isOpenModalDisabled"
    >
      {{ data.label }}
    </button>

    <control-modal
      ref="modal"
      :data="data"
      @open="getRequestData"
      @close="closeModal"
      @ok="refreshData"
      :closeOnESC="false"
      :show-cancel="false"
      :show-close="false"
      :show-ok="isRequestError"
    >
      <template v-slot:title>
        <VerifyTimer
          v-if="isRequestInProgress"
          :duration="getTimerSeconds()"
          class="verify_timer"
        />
        <div>{{ modalTitle }}</div>
      </template>

      <template>
        <span v-html="dialogBodyText"></span>
      </template>
    </control-modal>
  </div>
</template>

<script>
import ControlModal from "./ControlModal";
import VerifyTimer from "../../VerifyUser/VerifyTimer.vue";
import {
  WAIT_ID_STATUS,
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
          label: "Оформить полис",
        };
      },
    },
    // число попыток выполнить один запрос
    attempts: {
      type: Number,
      default: 6
    },
    // секунды на выполнение одного запроса
    secondsInterval: {
      type: Number,
      default: 5
    },
    modalTitle: {
      type: String,
      default: "Пожалуйста, подождите"
    }
  },
  computed: {
    valueComputed() {
      return this.data?.value ?? "Проверяем данные в АИС Страхование, дождитесь завершения операции";
    },
    msIntervalComputed() {
      return this.secondsInterval * 1000;
    },
    cardId() {
      const cardId = Number(this.$store.state.data_card?.cardId);

      return Number.isInteger(cardId) ? cardId : -1;
    },
    dialogBodyText() {
      return (
        this.dialogMessage ?? this.responseData?.SMESSAGE ?? this.valueComputed
      );
    },
    isFinishResponse() {
      return this.isRequestError || this.isRequestSuccess;
    },
  },
  data() {
    return {
      responseData: null,
      dialogMessage: null,
      isRequestError: false,
      isRequestSuccess: false,
      isOpenModalDisabled: false,
      isRequestInProgress: false
    };
  },
  methods: {
    closeModal() {
      this.$refs?.modal?.closeModal();
    },
    refreshData() {
      this.$store.dispatch("data_card/fetchForm");
      this.setOpenModalBtnDisabled(false);
    },
    afterSuccessDataCheck() {
      const url = this.responseData.SURL;

      this.closeModal();

      if (url) {
        this.setOpenModalBtnDisabled(true);
        this.$router.push(url);
      }
    },
    openModal() {
      this.responseData = null;
      this.dialogMessage = null;
      this.isRequestError = false;
      this.isRequestSuccess = false;
      this.isOpenModalDisabled = false;
      this.isRequestInProgress = false;

      this.$refs.modal.openModal();
    },
    getRequestData() {
      this.responseData = null;

      this.isRequestInProgress = true;
      this.executeRequestWithTimeout(this.attempts);
    },
    async executeRequest() {
      const form = {...this.$store.getters["data_card/getBodyForm"]};

      try {
        const result = await this.$axios
          .post(
            "am/main/v2/osago/CreatePolicySendNsis",
            form,
            { signal: AbortSignal.timeout(this.msIntervalComputed) }
          )
        if (result.status === 200) {
          this.successDataHandler(result?.data);
        }
      } catch (err) {
        console.error(`executeRequest. Error: ${err}`);
      }
    },
    executeRequestWithTimeout(attempts) {
      if (!attempts) {
        this.isRequestInProgress = false;
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
      this.setData(data[0]);

      if (this.responseData?.IDSTATUS === SUCCESS_ID_STATUS) {
        this.isRequestSuccess = true;
        this.dialogMessage = SUCCESS_REQUEST_MESSAGE;

        this.afterSuccessDataCheck();
      }
    },
    errorDataHandler(msg) {
      this.dialogMessage = msg ?? COMMON_ERROR_MESSAGE;
      this.isRequestError = true;
    },
    setData(data) {
      this.responseData = data ? { ...data } : null;
    },
    setOpenModalBtnDisabled(state) {
      this.isOpenModalDisabled = state;
    },
    getTimerSeconds() {
      return this.attempts * this.secondsInterval;
    },
  },
};
</script>

<style scoped>
.verify_timer {
  font-family: Raleway;
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 65px;
  color: #a4a4a4;
  padding-left: 52px;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MCA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDMuODMzMzRDMTYuNzAzNyAzLjgzMzM0IDEzLjQ4MTMgNC44MTA4MiAxMC43NDA1IDYuNjQyMThDNy45OTk2OCA4LjQ3MzUzIDUuODYzNDcgMTEuMDc2NSA0LjYwMjAxIDE0LjEyMTlDMy4zNDA1NSAxNy4xNjc0IDMuMDEwNSAyMC41MTg1IDMuNjUzNTggMjMuNzUxNUM0LjI5NjY3IDI2Ljk4NDUgNS44ODQwMiAyOS45NTQyIDguMjE0ODkgMzIuMjg1MUMxMC41NDU4IDM0LjYxNiAxMy41MTU1IDM2LjIwMzMgMTYuNzQ4NSAzNi44NDY0QzE5Ljk4MTUgMzcuNDg5NSAyMy4zMzI2IDM3LjE1OTUgMjYuMzc4MSAzNS44OThDMjkuNDIzNSAzNC42MzY1IDMyLjAyNjUgMzIuNTAwMyAzMy44NTc4IDI5Ljc1OTVDMzUuNjg5MiAyNy4wMTg3IDM2LjY2NjcgMjMuNzk2NCAzNi42NjY3IDIwLjVDMzYuNjY2NyAxOC4zMTEzIDM2LjIzNTYgMTYuMTQ0IDM1LjM5OCAxNC4xMjE5QzM0LjU2MDQgMTIuMDk5OSAzMy4zMzI4IDEwLjI2MjUgMzEuNzg1MSA4LjcxNDg5QzMwLjIzNzUgNy4xNjcyNSAyOC40MDAyIDUuOTM5NTkgMjYuMzc4MSA1LjEwMjAxQzI0LjM1NiA0LjI2NDQzIDIyLjE4ODcgMy44MzMzNCAyMCAzLjgzMzM0Wk0yMCAzMy44MzMzQzE3LjM2MjkgMzMuODMzMyAxNC43ODUxIDMzLjA1MTMgMTIuNTkyNCAzMS41ODYzQzEwLjM5OTcgMzAuMTIxMiA4LjY5MDc4IDI4LjAzODggNy42ODE2MSAyNS42MDI0QzYuNjcyNDQgMjMuMTY2MSA2LjQwODQgMjAuNDg1MiA2LjkyMjg3IDE3Ljg5ODhDNy40MzczNCAxNS4zMTI0IDguNzA3MjIgMTIuOTM2NiAxMC41NzE5IDExLjA3MTlDMTIuNDM2NiA5LjIwNzIxIDE0LjgxMjQgNy45MzczNCAxNy4zOTg4IDcuNDIyODdDMTkuOTg1MiA2LjkwODQgMjIuNjY2MSA3LjE3MjQ0IDI1LjEwMjUgOC4xODE2MUMyNy41Mzg4IDkuMTkwNzggMjkuNjIxMiAxMC44OTk3IDMxLjA4NjMgMTMuMDkyNEMzMi41NTEzIDE1LjI4NTEgMzMuMzMzMyAxNy44NjI5IDMzLjMzMzMgMjAuNUMzMy4zMzMzIDI0LjAzNjIgMzEuOTI4NiAyNy40Mjc2IDI5LjQyODEgMjkuOTI4MUMyNi45Mjc2IDMyLjQyODYgMjMuNTM2MiAzMy44MzMzIDIwIDMzLjgzMzNaTTI1LjE2NjcgMjEuNTVMMjEuNjY2NyAxOS41MzMzVjEyLjE2NjdDMjEuNjY2NyAxMS43MjQ2IDIxLjQ5MTEgMTEuMzAwNyAyMS4xNzg1IDEwLjk4ODJDMjAuODY2IDEwLjY3NTYgMjAuNDQyIDEwLjUgMjAgMTAuNUMxOS41NTggMTAuNSAxOS4xMzQxIDEwLjY3NTYgMTguODIxNSAxMC45ODgyQzE4LjUwODkgMTEuMzAwNyAxOC4zMzMzIDExLjcyNDYgMTguMzMzMyAxMi4xNjY3VjIwLjVDMTguMzMzMyAyMC41IDE4LjMzMzMgMjAuNjMzMyAxOC4zMzMzIDIwLjdDMTguMzQzMiAyMC44MTQ4IDE4LjM3MTMgMjAuOTI3NCAxOC40MTY3IDIxLjAzMzNDMTguNDUxIDIxLjEzMjIgMTguNDk1NyAyMS4yMjcyIDE4LjU1IDIxLjMxNjdDMTguNTk1NiAyMS40MTE0IDE4LjY1MTUgMjEuNTAwOCAxOC43MTY3IDIxLjU4MzNMMTguOTgzMyAyMS44TDE5LjEzMzMgMjEuOTVMMjMuNDY2NyAyNC40NUMyMy43MjA3IDI0LjU5NCAyNC4wMDggMjQuNjY4NyAyNC4zIDI0LjY2NjdDMjQuNjY5IDI0LjY2OTMgMjUuMDI4NSAyNC41NDkzIDI1LjMyMiAyNC4zMjU2QzI1LjYxNTUgMjQuMTAxOSAyNS44MjY0IDIzLjc4NzEgMjUuOTIxOCAyMy40MzA2QzI2LjAxNzEgMjMuMDc0IDI1Ljk5MTQgMjIuNjk2IDI1Ljg0ODcgMjIuMzU1NkMyNS43MDYgMjIuMDE1MyAyNS40NTQ0IDIxLjczMTkgMjUuMTMzMyAyMS41NUgyNS4xNjY3WiIgZmlsbD0iI0E0QTRBNCIvPgo8L3N2Zz4K")
    left center no-repeat;
  margin-bottom: 0.5rem;
  display: block;
}
@media (max-width: 568px) {
  .verify_timer {
    font-size: 1.5rem;
    line-height: 40px;
  }
}
</style>
