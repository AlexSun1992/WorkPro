<template>
  <div>
    <b-button class="button" @click="openModal()" variant="secondary">{{ data.label }}</b-button>
  </div>
</template>

<script>
export default {
  name: 'ControlButton',
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
  .button {
    margin-top: 28px;
  }
</style>
