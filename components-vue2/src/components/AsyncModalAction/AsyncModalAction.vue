<script>
export default {
  name: "AsyncModalAction",
  props: {
    data: {
      type: Object,
      default() {
        return {
          value: "",
          label:"",
        };
      },
    },
  },
  data() {
    return {
      isDialogOpen: false
    }
  }
};
</script>

<template>
  <dialog :open="isDialogOpen">
    <header>
      <span>{{ data.label }}</span>
      <button type="button">&#2715;</button>
    </header>
    <main>
      {{ data.value }}
    </main>
    <footer></footer>
  </dialog>
</template>

<style scoped></style>
