<template>
  <div>
    <b-card class="bg-six block-border-one block">
      <slot></slot>
    </b-card>
  </div>
</template>

<script>
import Form from '~/components/Libs/Form/Form'
import ActionButton from '~/components/Pages/Cabinet/Block/ActionButton'
export default {
  name: 'SideBlock'
}
</script>

<style scoped>

</style>
