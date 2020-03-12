<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      {{data}}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Policies',
    data() {
      return {
        data: []
      }
    },
    async mounted() { // only client side hook no need to check
      const { data } = await this.$axios.get('/am/main/v2/module'); // await is not mandatory
      this.data = data[0]._data
    }
  }
</script>

<style scoped>

</style>
