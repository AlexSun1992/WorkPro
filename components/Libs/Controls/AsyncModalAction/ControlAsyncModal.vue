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
    />
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
          value: "Идёт обработка сурового запроса!",
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
    }
  },
  data() {
    return {
      isOpen: false,
      abortController: null,
      responseData: null,
    };
  },
  methods: {
    closeModal() {},
    openModal() {
      this.$refs.modal.openModal();
    },
    openModalHandler() {
      this.executeAction();
    },
    executeAction() {
      this.abortController = new AbortController();
      this.$axios.post(
        "am/main/v2/osago/CreatePolicySendNsis",
        { ID: this.cardId },
        { signal: this.abortController.signal }
      ).then(data => this.setData(data.data))
        .catch(err => console.warn(`Ошибка при попытке получить данные по текущей карточке: ${err}`));

      setTimeout(() => {
        this.abortController?.abort();
      }, this.intervalComputed)
    },
    executeWithTimeout(attempts = this.attemptsComputed) {
      if (attempts) {
        this.executeAction();
      }
      setTimeout(() => {

      }, this.intervalComputed);
    },
    setData(data) {

    }
  },
};
</script>

<style scoped></style>
