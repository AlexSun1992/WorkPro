<template>
  <div>
    <div v-if="getData.length" class="slider_in_col">
      <VueSlickCarousel v-bind="settings">
        <div v-for="(card, indx) in getData" :key="card.ID">
          <div
            :class="{
              box: true,
              'box-green': indx % 2 === 0,
              'box-blue': indx % 2 !== 0,
              active: Number(fieldValue.ID) === Number(card.ID),
            }"
            @click="changeColorCard(card)"
          >
            <div class="box-title">{{ card.SNAME }}</div>
            <div class="box-description">
              <div class="box-flag" v-if="card.BDEFAULT">Оптимальный</div>
              <div class="box-label">Травма</div>
              <div class="box-text">
                {{ formattedNum(card.NSUMTN) }} &#8381;
              </div>
              <div class="box-label">Инвалидность</div>
              <div class="box-text">
                {{ formattedNum(card.NSUMPN) }} &#8381;
              </div>
              <div class="box-label">Смерть<br />(за исключением ДТП)</div>
              <div class="box-text">
                {{ formattedNum(card.NSUMNODT) }} &#8381;
              </div>
              <div class="box-label">Смерть в ДТП</div>
              <div class="box-text">
                {{ formattedNum(card.NSUMDT) }} &#8381;
              </div>
            </div>
            <div ref="button" class="box-button">
              {{ formattedNum(card.NCOST) }} &#8381;
            </div>
          </div>
        </div>
      </VueSlickCarousel>
    </div>
  </div>
</template>

<script>
// TODO remove when transition actuary db is over (create date - 30.01.2025)
import VueSlickCarousel from "vue-slick-carousel";
import { formattedNumber } from "./formattedNumber";

export default {
  name: "ControlInsuredBox",
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
        infinite: false,
        initialSlide: null,
        centerMode: false,
        centerPadding: "20px",
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
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
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              dots: true,
              arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: "20px",
            },
          },
        ],
      },
      options: null,
    };
  },
  async created() {
    if (!this.getData.length) {
      this.options = await this.$axios.post("/api/list/55/766");
    }
    if (this.getData && this.getData.length > 3) {
      this.settings.centerMode = true;
    }
  },
  computed: {
    getData() {
      if (this.data.options) {
        return this.data.options;
      }
      if (this.options) {
        return this.options?.data ? this.options?.data.items : [];
      }
      return [];
    },
    fieldValue() {
      return (
        this.getData.find((item) => item.ID === Number(this.data.value)) ?? {}
      );
    },
  },
  methods: {
    formattedNum(obj) {
      return Number.isInteger(obj) ? formattedNumber(obj) : obj;
    },

    changeColorCard(card) {
      this.updateField(card.ID);
    },
    updateField(cardId) {
      const updateData = {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: Number(cardId),
      };
      this.$emit("update", updateData);
    },
    getPresetsClass(index) {
      const even = index % 2 === 0;
      return {
        box: true,
        "box-green": even,
        "box-blue": !even,
        active:
          Number(this.data.value) === Number(this.getPolicyCardOptions.ID),
      };
    },
  },
};
</script>
<style>
.cabinet .slick-slide {
  border: 10px solid #fff;
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
.box-blue.active .box-button {
  background-color: #3b86c8;
  color: #fff;
}
.box-green.active .box-button {
  background-color: #009639;
  color: #fff;
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
.slider_in_col {
  margin-left: -10px;
  margin-right: -10px;
}
@media (max-width: 480px) {
  .slider_in_col {
    margin-left: -16px;
    margin-right: -16px;
  }
}
</style>
