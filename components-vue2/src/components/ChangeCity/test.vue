<template>
  <div></div>
</template>

<script>
export default {
  data() {
    name: "";
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
  },
  watch: {
    name(newName) {
      localStorage.name = newName;
    },
  },
};
</script>

<style lang="scss" scoped></style>
