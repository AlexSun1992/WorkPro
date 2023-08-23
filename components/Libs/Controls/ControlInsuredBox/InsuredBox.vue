<template>
  <div v-if="carouselCards.length">
    <VueSlickCarousel v-bind="settings">
      <div v-for="(card, indx) in carouselCards" :key="card.ID">
        <div
          :class="{
            box: true,
            'box-green': indx % 2 === 0,
            'box-blue': indx % 2 !== 0,
            active: Number(fieldValue.value) === Number(card.ID),
          }"
          @click="changeColorCard(card)"
        >
          <div class="box-title">{{ card.SNAME }}</div>
          <div class="box-description">
            <div class="box-flag" v-if="card.BDEFAULT">Оптимальный</div>
            <div class="box-label">Травма</div>
            <div class="box-text">{{ formattedNum(card.NSUMTN) }} &#8381;</div>
            <div class="box-label">Инвалидность</div>
            <div class="box-text">{{ formattedNum(card.NSUMPN) }} &#8381;</div>
            <div class="box-label">Смерть<br />(за исключением ДТП)</div>
            <div class="box-text">
              {{ formattedNum(card.NSUMNODT) }} &#8381;
            </div>
            <div class="box-label">Смерть в ДТП</div>
            <div class="box-text">{{ formattedNum(card.NSUMDT) }} &#8381;</div>
          </div>
          <div ref="button" class="box-button">
            {{ formattedNum(card.NCOST) }} &#8381;
          </div>
        </div>
      </div>
    </VueSlickCarousel>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import { formattedNumber } from "./formattedNumber";

export default {
  name: "InsuredBox",
  components: { VueSlickCarousel },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: Boolean,
      required: false,
      default: () => true,
    },
  },
  data() {
    return {
      settings: {
        arrows: true,
        focusOnSelect: true,
        slidesToShow: 3,
        speed: 500,
        infinite: true,
        initialSlide: null,
        centerMode: true,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              dots: false,
              arrows: true,
            },
          },
          {
            breakpoint: 992,
            settings: {
              dots: true,
              arrows: false,
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              dots: true,
              arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      },
    };
  },
  async created() {
    await this.fetchData();
    this.carouselCards.forEach((item, index) => {
      if (this.data.value.value === "undefined") {
        if (item.BDEFAULT === true) {
          this.settings.initialSlide = index;
        }
      } else if (item.ID === Number(this.data.value.value)) {
        this.settings.initialSlide = index;
      }
    });
  },
  computed: {
    carouselCards() {
      const block = this.$store.getters["blocks/getBlockById"](
        this.data.menudic
      );
      if (block) {
        return block.data.items;
      }
      return [];
    },
    fieldValue: {
      get() {
        return {
          text: String(this.data.value.text),
          value: String(this.data.value.value),
        };
      },
    },
  },
  methods: {
    async fetchData() {
      try {
        await this.$store.dispatch("blocks/fetchBlock", {
          id: this.data.menudic,
          query: this.$store.getters["data_card/getFilters"],
          ...this.$route.params,
        });
      } catch (err) {
        console.error(err);
      }
    },
    formattedNum(obj) {
      return Number.isInteger(obj) ? formattedNumber(obj) : obj;
    },

    changeColorCard(card) {
      this.updateField(card);
    },
    updateField(card) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: { text: String(card.ID), value: String(card.ID) },
      });
    },
  },
};
</script>
<style>
.cabinet .slick-slide {
  padding: 0 10px 20px 10px;
}
.cabinet .slick-slide:first-of-type {
  padding-left: 0;
}
.cabinet .slick-slide:last-of-type {
  padding-right: 0;
}
.cabinet .slick-prev:before,
.cabinet .slick-next:before {
  display: none;
}
.cabinet .slick-disabled {
  pointer-events: none;
  opacity: 0.5;
}
.cabinet .slick-prev {
  left: -20px;
}
.cabinet .slick-next {
  right: -20px;
}
.cabinet .slick-prev,
.cabinet .slick-next,
.cabinet .slick-prev:hover,
.cabinet .slick-next:hover,
.cabinet .slick-prev:focus,
.cabinet .slick-next:focus {
  width: 64px;
  height: 64px;
  border-radius: 64px;
  background: transparent url(/img/icon-slick.svg) 50% 50% no-repeat;
  z-index: 1;
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.1);
}
.cabinet .slick-prev {
  transform: translate(0, -50%) rotate(-180deg);
}
.cabinet .slick-dots li button:before {
  display: none;
}
.cabinet .slick-dots li button {
  width: 8px;
  height: 8px;
  border: 2px solid #c3c3c3;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;
  padding: 0;
  font-size: 0;
}
.cabinet .slick-dots li.slick-active button {
  background: #43b02a;
  border: 2px solid #43b02a;
}
</style>
<style scoped>
.box {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 49px auto 42px;
  border-radius: 30px;
  border: 2px solid var(--warmgrey-30, #e1e1e1);
  background: var(--white, #fff);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  padding: 30px 11px 28px;
  position: relative;
  cursor: pointer;
  height: 100%;
}
.box-title {
  font-family: Raleway;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5rem;
  margin: 0 19px;
  border-bottom: 1px solid #c3c3c3;
}
.box-label {
  margin-top: 1rem;
  padding: 0 19px;
  font-size: 0.875rem;
  line-height: 1.125rem;
}
.box-text {
  line-height: 1.25rem;
  font-weight: 700;
  padding: 0 19px;
}
.box-description {
  margin-bottom: 20px;
}
.box-button {
  padding: 11px 24px;
  border-radius: 15px;
  font-weight: 700;
  line-height: 1.25rem;
  text-align: center;
}
.box-green .box-button {
  background-color: #edf8ea;
  color: #009639;
}
.box-blue .box-button {
  background-color: #ecf3fa;
  color: #3b86c8;
}

.box-blue.active {
  border-color: #3b86c8;
}
.box-green.active {
  border-color: #009639;
}
.box-flag {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  padding: 4px 8px;
}
.box-blue .box-flag {
  background-color: #3b86c8;
}
.box-green .box-flag {
  background-color: #009639;
}
</style>
