<template>
  <div v-if="data.value">
    <button
      :id="data.fieldId"
      class="btn-pencil"
      @click="redirect()"
    >
      {{ data.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "ControlPencil",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  computed: {},
  methods: {
    redirect() {
      if (this.$router) {
        this.$router.push(this.data.value);
      } else {
        window.location.replace(this.data.value);
      }
    },
  },
};
</script>

<style scoped></style>
