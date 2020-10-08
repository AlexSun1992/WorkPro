<template>
  <div v-if="isOpenCard">
    <div v-for="item in dataContent.items" @click.prevent="openCard(item)">
      <slot name="data" v-bind:content="item"></slot>
    </div>
  </div>
    <div v-else>
      <slot v-for="item in dataContent.items"  name="data" v-bind:content="item"></slot>
    </div>
</template>

<script>
  import Grid from '~/components/Libs/Table/Grid'
  export default {
    name: 'ContentBlock',
    components: {Grid},
    props: {
      itemId: {
        required: true,
        default: () => null
      },
      isOpenCard: {
        type: Boolean,
        required: false,
        default: () => false
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
    },
    methods: {
      async openCard (item) {
        try {
          if(this.isOpenCard){
            $nuxt._router.push(`/cabinet/55/0/${this.itemId}/${item.ID}`)
          }

        } catch(err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: `Ошибка`,
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
        }
      },
    },
  }
</script>

<style scoped>

</style>
