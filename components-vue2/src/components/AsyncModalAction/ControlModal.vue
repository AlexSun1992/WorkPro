<template>
  <dialog>
    <header>
      <span>{{ data.label }}</span>
      <button type="button" @click="closeModal">&#2715;</button>
    </header>

    <main>
      {{ data.value }}
    </main>

    <footer></footer>
  </dialog>
</template>

<script>
export default {
  name: "ControlModal",
  props: {
    data: {
      type: Object,
      default() {
        return {
          value: "",
          title: "Пожалуйста подождите",
        };
      },
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped></style>
