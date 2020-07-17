<template>
  <div>
    <b-button class="button" @click="openModal()" variant="secondary">{{ data.label }}</b-button>
  </div>
</template>

<script>
export default {
  name: 'ControlBoolean',
  data() {
    return {
      modalShow: false
    }
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false
    }
  },
  methods: {
    openModal() {
      this.modalShow = true;
      this.$emit('modal', {
        data: this.data,
        show: this.modalShow 
      });
    }
  }
}
</script>

<style scoped>
  .modal-body {
    min-height: 500px;
  }
  .button {
    margin-left: 100px;
  }
</style>
