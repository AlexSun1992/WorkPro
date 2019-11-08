<template>
    <div>{{user}}</div>
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
        console.log(this.userData)
        return this.userData[0]._data[0]['SFIRSTNAME'];
      }
    }
  }
</script>

<style scoped>

</style>
