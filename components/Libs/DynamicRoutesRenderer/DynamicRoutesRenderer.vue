<template>
  <div>
    {{ setUrl }}
    {{ getMenu }}
    <div v-if="getPage" class="container">
      <h1>
        {{ getPage.title.rendered }}
      </h1>
    </div>

    <div v-if="getPage" v-html="getPage.content.rendered"></div>
    <!-- <div v-if="getPage">
      <v-runtime-template :template="getPage.content.rendered"></v-runtime-template>
    </div> -->
  </div>
</template>

<script>
  import VRuntimeTemplate from "v-runtime-template";
  import Calculator from "../../Pages/Calculator";
  export default {
    components: {VRuntimeTemplate,Calculator},
    computed: {
      setUrl() {
        const url = this.$route.path;
        if (this.$route.path === '/') {
          return;
        }
        this.$store.dispatch('pages/fetchPageByUrl', url);
      },
      getPage() {
        return this.$store.getters['pages/getPageByUrl'];
      },
      getMenu() {
        this.$store.dispatch('pages/setMenuId');
        this.$store.dispatch('pages/getComponent', this.$store.getters['pages/getMenuId']);
      }
    }
  }
</script>

<style scoped>
  .container {
    text-align: center;
  }
</style>
