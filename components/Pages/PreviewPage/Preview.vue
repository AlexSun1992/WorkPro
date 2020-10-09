<template>
<div>
  <v-runtime-template :template="content"></v-runtime-template>
</div>
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template'
import Calculator from '../../Pages/Calculator'
export default {
  layout: 'MainLayout',
  name: 'Preview',
  components: { VRuntimeTemplate, Calculator },
  head: {
    title: 'Предпросмотр страницы'
  },
  data () {
    return {
      counter: 0,
      dropDownValueSelected: { textSelected: null, valueSelected: null }
    }
  },
  async asyncData ({ $axios, store, route }) {
    const dataPage = await $axios.get(`/wp-json/wpreso/v1/previews/${route.params.pageId}`)
    return {
      content: dataPage.data.content.rendered
    }
  }
}
</script>

<style scoped>

</style>
