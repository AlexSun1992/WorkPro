<template>
  <div class="wrapper">
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
    components: {DynamicRoutesRenderer}
  }
</script>

<style scoped>

</style>

