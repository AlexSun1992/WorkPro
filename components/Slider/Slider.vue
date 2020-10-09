<template>
  <agile
    ref="carousel"
    :slidesToShow="slides"
    :dots="false"
    :navButtons="false"
  >
    <slot></slot>
  </agile>
</template>

<script>
export default {
  name: "Slider",
  data() {
    return {
      counter: 0,
    };
  },
  props: {
    slides: {
      type: Number,
      required: true,
      default: () => 1,
    },
  },
  methods: {
    goToNext() {
      if (this.counter < this.slides) {
        this.$refs.carousel.goToNext();
        this.counter++;
        this.$store.commit("slider/setButtonLeftDisabled", this.counter === 0);
        this.$store.commit(
          "slider/setButtonRightDisabled",
          this.counter === this.slides
        );
      }
    },
    goToPrev() {
      if (this.counter !== 0) {
        this.$refs.carousel.goToPrev();
        this.counter--;
        this.$store.commit("slider/setButtonLeftDisabled", this.counter === 0);
        this.$store.commit(
          "slider/setButtonRightDisabled",
          this.counter === this.slides
        );
      }
    },
  },
};
</script>

<style scoped></style>
