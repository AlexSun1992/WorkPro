<template>
    <div  v-html="content"/>
</template>

<script>
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    layout: 'DemoLayout',
    name: 'DemoPage',
    head: {
      title: 'Демонстрационная страница'
    },
    async asyncData ({ $axios }) {
      const {data} = await $axios.get('/wp-json/wp/v2/pages/160')
      return {content: data.content.rendered}
    },
    components: {VRuntimeTemplate}
  }
</script>

<style scoped>

</style>
