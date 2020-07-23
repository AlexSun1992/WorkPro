<template>
  <div>
    <b-button class="button" @click="openEdit()" variant="secondary">{{ data.label }}</b-button>
  </div>
</template>

<script>
export default {
  name: 'ControlButton',
  data() {
    return {
      editShow: false
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
    openEdit() {
      this.editShow = true;
      this.$emit('edit', {
        data: this.data,
        show: this.editShow 
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
