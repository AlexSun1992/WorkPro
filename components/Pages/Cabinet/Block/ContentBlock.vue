<template>
  <b-row>
      <slot v-for="item in dataContent.items"  name="data" v-bind:content="item"></slot>
  </b-row>
</template>

<script>
  import Grid from '~/components/Libs/Table/Grid'
  export default {
    name: 'ContentBlock',
    components: {Grid},
    props: {
      itemId: {
        type: String,
        required: true,
        default: () => null
      }
    },
    async  fetch () {
      try {
        await this.$store.dispatch('blocks/fetchBlock', this.itemId);
      } catch(err) {
        this.$bvToast.toast(err.response.data.MESSAGE, {
          title: `Ошибка`,
          variant: 'danger',
          noAutoHide: true,
          solid: true
        })
      }
    },
    computed: {
      dataContent: {
        get: function () {
          let block =  this.$store.getters['blocks/getBlockById'](this.itemId)
          if(block){
            return block.data
          }
          else{
            return {}
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
