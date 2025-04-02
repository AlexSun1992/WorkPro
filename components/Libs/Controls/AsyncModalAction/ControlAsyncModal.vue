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
      :show-ok="false"
    >
      <template>
        {{ dialogBodyText }}
      </template>
    </control-modal>
  </div>
</template>

<script>
import ControlModal from "./ControlModal";

export default {
  name: "ControlAsyncModal",
  components: { ControlModal },
  props: {
    data: {
      type: Object,
      default() {
        return {
          value:
            "Проверяем данные в АИС Страхование, дождитесь завершения операции",
          label: "Пожалуйста подождите",
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
      return this.successMessage ?? this.responseData?.SMESSAGE ?? this.data.value;
    },
  },
  data() {
    return {
      isOpen: false,
      abortController: null,
      responseData: null,
      successMessage: null
    };
  },
  methods: {
    closeModal() {
      this.$refs.modal.closeModal();
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
      this.abortController = new AbortController();

      return this.$axios
        .post(
          "am/main/v2/osago/CreatePolicySendNsis",
          { ID: this.cardId },
          { signal: this.abortController.signal }
        )
        /* .then((data) => this.setData(data.data))
        .catch((err) =>
          console.warn(
            `Ошибка при попытке получить данные по текущей карточке: ${err}`
          )
        ); */
    },
    closeActiveRequest() {
      this.abortController?.abort();
    },
    executeRequestWithTimeout(attempts = this.attemptsComputed) {
      console.log(`!!!! ${attempts}`);
      if (!attempts || this.responseData) {
        return;
      }

      this.executeRequest().then((data) => {
        this.successDataHandler(data);
      });

      setTimeout(() => {
        this.closeActiveRequest();

        this.executeRequestWithTimeout(attempts - 1);
      }, this.intervalComputed);
    },
    successDataHandler(data) {
      this.successMessage = "Проверка выполнена успешно";
      this.setData(data.data);

      this.closeModalWithTimeout(2);
    },
    setData(data) {
      this.responseData = data[0] ? { ...data[0] } : null;
    },
  },
};
</script>

<style scoped></style>
