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
