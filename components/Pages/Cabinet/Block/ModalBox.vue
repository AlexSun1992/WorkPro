<template>
  <div>
    <div @click="toggleModalWindow">
      <slot v-if="$slots.button" name="button"></slot>
      <button v-if="$slots.button === undefined" name="buttonClue">
        Открыть модальное окно
      </button>
    </div>
    <div class="modal-notification-popup" v-if="isCardShown">
      <div @click="toggleModalWindow" class="close-btn"></div>
      <slot
        v-if="$slots.modal"
        name="modal"
        :onClick="toggleModalWindow"
      ></slot>
      <div v-if="$slots.modal === undefined">
        Для отображения карточки добавьте код modal
        <pre>&lt;template #button&gt;&lt;/template&gt;</pre>
        Для отображения модального окна
        <pre>&lt;template #modal&gt;&lt;/template&gt;</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalBox",

  data() {
    return {
      isCardShown: false,
    };
  },

  methods: {
    toggleModalWindow() {
      this.isCardShown = !this.isCardShown;
    },
  },
};
</script>

<style scoped>
.modal-notification {
  cursor: pointer;
}
.modal-notification .block-policy[data-id]:before {
  filter: grayscale(100%);
}
.modal-notification .block-policy[data-id]:after {
  background-color: #eff1f3;
}
.block-policy .description .question {
  display: table;
  margin: 1.5rem auto 0;
  position: relative;
  color: #43b02a;
}
.question:after {
  content: "";
  width: 100%;
  height: 1px;
  border-bottom: 1px dotted #43b02a;
  display: block;
  margin-top: 5px;
}
.modal-notification-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 800px;
  padding: 50px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0px 4px 26px 0px rgba(0, 0, 0, 0.08);
  font-family: Raleway;
  z-index: 2;
}
.modal-notification-popup .close-btn {
  float: right;
  width: 32px;
  height: 32px;
  background: #edf8ea url("/img/mnp-close-btn.svg") 50% 50% no-repeat;
  border-radius: 32px;
  cursor: pointer;
}
.modal-notification-popup .title {
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5rem;
}
.modal-notification-popup .description {
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 23px;
}

@media (max-width: 992px) {
  .modal-notification-popup {
    z-index: 12;
    max-width: 98%;
    max-height: 98vh;
    top: 1%;
    left: 1%;
    overflow: auto;
    padding: 20px;
    transform: translate(0%, 0%);
    overflow-y: auto;
  }
}
</style>