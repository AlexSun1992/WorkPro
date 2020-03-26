<template>
  <div>
    <v-runtime-template :template="content"></v-runtime-template>
  </div>
</template>

<script>
  import VRuntimeTemplate from "v-runtime-template";
  import { mapMutations, mapState } from 'vuex'
  export default {
    layout: 'DemoLayout',
    name: 'Feedback',
    head: {
      title: 'Карусель'
    },
    async asyncData ({ $axios }) {
      const {data} = await $axios.get('/wp-json/acf/v3/main/239')
      return {content: data.acf.carousel}
    },
    components: {VRuntimeTemplate}
  }
</script>

<style scoped>

</style>
