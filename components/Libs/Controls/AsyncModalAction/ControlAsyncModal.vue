<template>
  <div>
    <button
      class="btn-primary"
      type="button"
      @click="openModal"
      :disabled="isOpenModalDisabled"
      :id="elementId"
    >
      {{ data.label }}
    </button>

    <control-modal
      ref="modal"
      :data="data"
      @open="getRequestData"
      @close="closeModal"
      @ok="refreshPage"
      :closeOnESC="false"
      :show-cancel="false"
      :show-close="false"
      :show-ok="false"
    >
      <template v-slot:title>
        <VerifyTimer
          v-if="isRequestInProgress"
          @onFinish="stopAfterTimeOut"
          :duration="getTimerSeconds"
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
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";
import { SUCCESS_ID_STATUS, ERROR_ID_STATUS, WAIT_ID_STATUS } from "./asyncModal.constant";
import { isTrue } from "../AMCBoolean.helper";

const TOKEN_NAME = "auth._token.local";
const CANCEL_ERROR = "Canceled";

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
      default: 10,
    },
    // секунды на выполнение одного запроса
    secondsInterval: {
      type: Number,
      default: 3,
    },
    maxTimeout: {
      type: Number,
      default: 30,
    },
    modalTitle: {
      type: String,
      default: "Пожалуйста, подождите",
    },
  },
  data() {
    return {
      responseData: null,
      dialogMessage: null,
      isOpenModalDisabled: false,
      isRequestInProgress: false,
      abortController: null,
      counter: 0,
      requestTimeout: 0,
      interval: 0,
    };
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
    itemId() {
      return this.$attrs.params?.idItem;
    },
    elementId() {
      return this.data.webId || this.data.fieldId;
    },
    dialogBodyText() {
      return this.dialogMessage ?? this.responseData?.SMESSAGE ?? this.valueComputed;
    },
    getTimerSeconds() {
      return this.maxTimeout;
    },
  },
  watch: {
    counter(newVal) {
      if (newVal < 1) {
        this.refreshPage();
      }
    },
  },

  beforeDestroy() {
    this.clearRequestTimeout();
  },

  methods: {
    closeModal() {
      this.$refs?.modal?.closeModal(true);
    },
    clearRequestTimeout() {
      clearTimeout(this.requestTimeout);
      this.abortController?.abort();
    },
    stopAfterTimeOut() {
      this.clearRequestTimeout();
      this.refreshPage();
    },
    refreshPage() {
      if (this.$router) {
        this.$router.go(0);
      } else {
        window.location.reload();
      }

      this.setOpenModalBtnDisabled(false);
    },
    afterSuccessDataCheck() {
      this.closeModal();

      this.updateWizard(isTrue(this.responseData.BWIZARDSTEPS));

      this.goToUrl(this.responseData.SURL);
      this.setOpenModalBtnDisabled(true);
    },
    goToUrl(url) {
      this.clearRequestTimeout();

      if (!url) {
        return;
      }

      if (this.$router) {
        this.$router.push(url);
      } else {
        window.location.href = url;
      }
    },
    openModal() {
      this.responseData = null;
      this.dialogMessage = null;
      this.isOpenModalDisabled = false;
      this.isRequestInProgress = false;

      const form = this.$store.getters["data_card/getForm"];

      const requiredFieldWithOutValue = form.find((item) => item.required && item.visible && !item.value);

      if (requiredFieldWithOutValue) {
        return;
      }

      this.$refs.modal.openModal();
    },
    getRequestData() {
      this.responseData = null;

      this.isRequestInProgress = true;
      this.initRequest();
    },
    async doPostFetch(url, body) {
      const authToken = this.getCookie(TOKEN_NAME);
      this.abortController = new AbortController();

      const response = await fetch(url, {
        method: "post",
        signal: this.abortController.signal,
        body: body ?? {},
        headers: {
          authorization: authToken,
        },
      });
      if (response.ok) {
        return { status: response.status, data: await response.json() };
      }

      return { status: response.status, data: null };
    },
    getCookie(name) {
      const matches = document.cookie.match(
        new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1")}=([^;]*)`)
      );

      return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    async executeRequest() {
      const form = { ...this.$store.getters["data_card/getBodyForm"] };

      this.abortController = new AbortController();
      this.counter -= 1;

      try {
        const isFirstRequest = this.counter === this.attempts - 1;

        if (this.counter >= 0) {
          ["SEND_NSIS", "POLICY_NSIS"].forEach((name) => {
            if (name in form) form[name] = null;
          });

          const targetBtnClicked = ["SEND_NSIS", "POLICY_NSIS"].find((item) => item === this.data.name);

          if (targetBtnClicked && targetBtnClicked in form && isFirstRequest) {
            form[targetBtnClicked] = "CLICKED";
          }

          const result = await this.doPostFetch(
            `${window.location.origin}/am/main/v2/osago/CreatePolicySendNsis`,
            JSON.stringify(form)
          );
          if (result?.status === 200) {
            this.successDataHandler(result.data);
          } else {
            this.counter = 0;
            this.refreshPage();
          }
        }
      } catch (err) {
        if (err.toString() !== CANCEL_ERROR) {
          console.error(`executeRequest. Error: ${err}`);

          this.refreshPage();
        }
      }
    },
    initRequest() {
      this.counter = this.attempts;
      this.executeRequest();
    },
    successDataHandler(data) {
      this.setData(data[0]);
      this.abortController = null;

      if (this.responseData?.IDSTATUS === SUCCESS_ID_STATUS) {
        this.afterSuccessDataCheck();
      }

      if (this.responseData?.IDSTATUS === ERROR_ID_STATUS) {
        this.refreshPage();
      }
      if (this.responseData?.IDSTATUS === WAIT_ID_STATUS) {
        this.requestTimeout = setTimeout(() => {
          this.executeRequest();
        }, this.msIntervalComputed);
      }
    },
    setData(data) {
      this.responseData = data ? { ...data } : null;
    },
    setOpenModalBtnDisabled(state) {
      this.isOpenModalDisabled = state;
    },
    updateWizard(update) {
      this.$store.commit("wizard/setForceUpdate", update, { root: true });
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
