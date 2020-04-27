<template>
  <div>
    {{ setUrl }}
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
      setUrl() {
        const url = this.$route.path;
        if (this.$route.path === '/') {
          return;
        }
        this.$store.dispatch('pages/fetchPageByUrl', url);
      },
      getPage() {
        if (this.counter == 1) {
          this.getMenu();
        }
        this.counter++;
        return this.$store.getters['pages/getPageByUrl'];
      }
    },
    methods: {
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
