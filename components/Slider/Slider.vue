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
    <agile
      ref="carousel"
      :slidesToShow="slides"
      :navButtons="false"
      :options="myOptions2"
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
        responsive: [
          {
            breakpoint: 600,
            settings: {
              dots: false,
            },
          },
          {
            breakpoint: 900,
            settings: {
              navButtons: true,
              dots: true,
              infinite: false,
            },
          },
        ],
      },
      myOptions2: {
        navButtons: false,
        responsive: [
          {
            breakpoint: 600,
            settings: {
              dots: false,
            },
          },
          {
            breakpoint: 900,
            settings: {
              navButtons: true,
              dots: true,
              infinite: false,
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
