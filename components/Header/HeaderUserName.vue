<template>
    <div>{{user}} <i class="fa fa-chevron-down" aria-hidden="true"></i></div>
</template>

<script>
  export default {
    name: 'HeaderUserInfo',
    props: {
      userData: {
        type: Array
      }
    },
    computed: {
      user () {
        return `${this.userData[0]._data[0]['SFIRSTNAME']} ${this.userData[0]._data[0]['SSECONDNAME']}`;
      }
    }
  }
</script>

<style scoped>

</style>
