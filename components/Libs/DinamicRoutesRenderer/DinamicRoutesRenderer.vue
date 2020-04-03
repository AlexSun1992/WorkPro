<template>
  <div>
   
  </div>
</template>

<script>

  export default {
    props: ['url'],
    data () {
      return {
        pageUrl: ''
      }
    },
    watch: {
      url: function (url) {
        debugger
        this.pageUrl = url.slice(url.lastIndexOf('/'));
      }
    }
  }
</script>
