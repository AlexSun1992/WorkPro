<template>
<div>
  <v-runtime-template :template="content"></v-runtime-template>
</div>
</template>

<script>
  import VRuntimeTemplate from "v-runtime-template";
  import Calculator from "../../Pages/Calculator";
  export default {
    name: 'Preview',
    components: {VRuntimeTemplate, Calculator},
    head: {
      title: 'Предпросмотр страницы'
    },
    async asyncData ({ $axios, store, route }) {
      let dataPage = await $axios.get(`/wp-json/wpreso/v1/previews/${route.params.pageId}`)
      return {
        content: dataPage.data.content.rendered,
      }
    }
  }
</script>

<style scoped>

</style>
