<template>
  <div class="app">
    Здесь будет будет HEADER и SIDEBAR
    <nuxt/>
    Здесь будет FOOTER
  </div>
</template>

<script>
  export default {
    name: 'DemoPage',
    head() {
      return {
        link: [
          // { rel: 'stylesheet', href: 'http://reso.ru/export/system/modules/ru.reso.bootstrap4/resources/css/reso-style.css' }
        ]
      }
    }
  }
</script>


