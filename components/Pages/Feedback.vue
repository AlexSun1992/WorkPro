<template>
    <div>
      <v-runtime-template :template="content"></v-runtime-template>
    </div>
</template>

<script>
  import VRuntimeTemplate from "v-runtime-template";
  import { mapMutations, mapState } from 'vuex'
  export default {
    name: 'Feedback',
    components: {VRuntimeTemplate},
    head: {
      title: 'Обратная связь'
    },
    async asyncData ({ $axios }) {
      return {content: "<div><b-card>123</b-card><b-card>123</b-card><p>123</p></div>"}
    },
  }
</script>

<style scoped>

</style>
