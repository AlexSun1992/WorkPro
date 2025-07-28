<template>
  <div>
    <VueSlickCarousel v-bind="params">
      <!-- В слот должны передаваться элементы слайдера без родительского элемента -->
      <slot></slot>
    </VueSlickCarousel>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";

export default {
  name: "ControlSlider",
  props: {
    params: {
      type: Object,
      default: () => ({
        arrows: true,
        slidesToShow: 3,
        dots: false,
        infinite: false,
        speed: 500,
        responsive: null,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000,
        initialSlide: 0,
        variableWidth: true,
        touchThreshold: 1,
      }),
    },
  },
  components: { VueSlickCarousel },
};
</script>
