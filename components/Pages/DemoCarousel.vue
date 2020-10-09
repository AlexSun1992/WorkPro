<template>
  <div>
    <v-runtime-template :template="content"></v-runtime-template>
  </div>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import { mapMutations, mapState } from "vuex";
export default {
  layout: "DemoLayout",
  name: "Feedback",
  head: {
    title: "Карусель",
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get("/wp-json/wp/v2/pages?slug=index");
    return { content: data[0].content.rendered };
  },
  components: { VRuntimeTemplate },
};
</script>

<style scoped></style>
