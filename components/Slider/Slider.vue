<template>
  <div>
    <agile
      ref="carousel"
      :slidesToShow="slides"
      :navButtons="false"
      :options="myOptions"
    >
      <slot></slot>
    </agile>
  </div>
</template>

<script>
export default {
  name: "Slider",
  data() {
    return {
      counter: 0,
      myOptions: {
        navButtons: false,
        dots: false,
        responsive: [
          {
            breakpoint: 575,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 0,
            settings: {
              slidesToShow: 1,
              dots: true,
            },
          },
          {
            breakpoint: 992,
            settings: {
              dots: false,
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 4,
            },
          },
        ],
      },
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
