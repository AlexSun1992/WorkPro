<template>
  <div>
    <b-card>
      <slot></slot>
    </b-card>
  </div>
</template>

<script>
import Form from '~/components/Libs/Form/Form'
import ActionButton from '~/components/Pages/Cabinet/Block/ActionButton'
export default {
  name: "ProfileSideBlock"
};
</script>

<style scoped>
  .card {
    min-width: 250px;
    max-width: 250px;
  }
</style>