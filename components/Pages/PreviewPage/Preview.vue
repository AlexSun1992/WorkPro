<template>
<div>
  <v-runtime-template :template="content"></v-runtime-template>
</div>
</template>

<script>
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'Preview',
    components: {VRuntimeTemplate},
    head: {
      title: 'Карусель'
    },
    async asyncData ({ $axios, store, route }) {
      let dataPage = await $axios.get(`/wp-json/wpreso/v1/previews/${route.params.pageId}`)
      let dataMenu = await $axios.get(`/wp-json/wp/v2/component/354`)
      store.commit('pages/setMenu', dataMenu.data.acf.list);
      return {
        content: dataPage.data.content.rendered,
      }
    }
  }
</script>

<style scoped>

</style>
