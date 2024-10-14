<template>
  <div v-if="data.value">
    <button class="btn-pencil" id="btn" @click="redirect()">
      {{ this.data.label }}
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
      this.$router.push(this.data.value);
    },
  },
};
</script>

<style scoped>
.btn-pencil {
  background: transparent url(/img/icon-change.svg) left center no-repeat;
  padding: 0px 0px 0px 32px;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #43b02a;
  position: relative;
  cursor: pointer;
  border: 0;
}
.btn-pencil:hover {
  text-decoration: underline;
}
</style>
