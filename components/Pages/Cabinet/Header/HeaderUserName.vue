<template>
  <div :class="'ppl-info percent' + percent +  ' ppl-' + sex">
    <div class="ppl-avatar">
      <img src="">
    </div>
    <span class="ppl-name">{{user}}</span>
  </div>
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
      },
      percent () {
        return this.userData[0]._data[0]['NPROFILEFULLNESS'];
      },
      sex () {
        return this.userData[0]._data[0]['BSEX'] === 0 ? 'male' : 'female';
      }
    }
  }
</script>

<style scoped>

</style>
