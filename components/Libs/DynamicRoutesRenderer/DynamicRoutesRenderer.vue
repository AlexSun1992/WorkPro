<template>
  <div>
    {{ setUrl }}
    <div v-if="getPage" class="container">
      <h1>
        {{ getPage.title.rendered }}
      </h1>
    </div>
    <div v-if="getPage" v-html="getPage.content.rendered"></div>
  </div>
</template>

<script>
  export default {
    computed: {
      setUrl() {
        const url = this.$route.path;
        // const url = this.$store.getters['pages/url'];
        if (this.$route.path === '/') {
          this.$store.dispatch('pages/fetchPageByUrl', '/index');
          return;
        }
        this.$store.dispatch('pages/fetchPageByUrl', url);
      },
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
