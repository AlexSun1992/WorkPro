<template>
  <div>
    <div v-if="getPage">
      <v-runtime-template :template="getPage.content.rendered"></v-runtime-template>
    </div>
  </div>
</template>

<script>
  import VRuntimeTemplate from "v-runtime-template";
  import Calculator from "../../Pages/Calculator";
  export default {
    components: {VRuntimeTemplate,Calculator},
    data(){
      return {
        counter: 0
      }
    },
    computed: {
      getPage() {
        return this.$store.getters['pages/getPageByUrl'];
      }
    }
  }
</script>

<style scoped>
  .container {
    text-align: center;
  }
</style>
