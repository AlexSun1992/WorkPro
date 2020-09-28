<template>
  <div class="wrapper main_page">
    <div class="animated fadeIn">
      <div>
        <div class="justify-content-lg-center">
          <DynamicRoutesRenderer/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DynamicRoutesRenderer from '~/components/Libs/DynamicRoutesRenderer/DynamicRoutesRenderer'
  export default {
    layout: 'MainLayout',
    components: {DynamicRoutesRenderer}
  }
</script>

<style lang="scss">
    .main_page { @import '~/assets/scss/main.scss'}
</style>
