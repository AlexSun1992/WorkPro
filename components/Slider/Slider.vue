<template>
  <agile ref="carousel" :slidesToShow="slides" :dots="false" :navButtons="false">
    <slot></slot>
  </agile>
</template>

<script>
  export default {
    name: 'Slider',
    data () {
      return {
        counter: 0
      }
    },
    props: {
      slides: {
        type: Number,
        required: true,
        default: () => 1
      },
    },
    methods: {
      goToNext () {
        if(this.counter < this.slides){
          this.$refs.carousel.goToNext()
          this.counter ++
        }

      },
      goToPrev () {
        if(this.counter !== 0){
          this.$refs.carousel.goToPrev()
          this.counter --
        }
      }
    },
  }
</script>

<style scoped>

</style>
