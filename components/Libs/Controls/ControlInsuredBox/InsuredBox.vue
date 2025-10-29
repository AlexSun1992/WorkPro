<template>
  <div>
    <div v-if="!data.options[0].S_ORDER">
      <OldInsuredBox
        @update="updateField"
        :data="data"
      />
    </div>
    <div v-if="data.options[0].S_ORDER">
      <div
        v-if="getData.length"
        class="slider_in_col"
      >
        <VueSlickCarousel
          v-if="activeSlide !== undefined"
          v-bind="settings"
          @swipe="handleSwipe"
          :initialSlide="activeSlide"
          :key="`slider-${getData.length}`"
        >
          <div
            v-for="(card, indx) in getData"
            :key="data.options[indx + 1].ID"
          >
            <InsuredBoxCard
              @update="updateField"
              @isRendered="setFieldValueBoolean"
              :val="val"
              :isCreated="isCreated"
              :card="card"
              :index="indx"
              :data="data"
              :tooltipData="getTooltipsData"
            />
          </div>
        </VueSlickCarousel>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import InsuredBoxCard from "./InsuredBoxCard.vue";
import OldInsuredBox from "./OldControlInsuredBox.vue"; // TODO remove when transition actuary db is over (create date - 30.01.2025)

export default {
  name: "ControlInsuredBox",
  components: { VueSlickCarousel, InsuredBoxCard, OldInsuredBox },
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
      windowWidth: 0,
      isMounted: false,
      settings: {
        arrows: true,
        focusOnSelect: true,
        slidesToShow: 3,
        infinite: false,
        initialSlide: null,
        centerMode: false,
        centerPadding: "20px",
        responsive: [
          {
            breakpoint: 1226,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              dots: false,
              arrows: true,
            },
          },
          {
            breakpoint: 1225,
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
      activeSlide: null,
      val: null,
      isCreated: null,
      slide: null,
    };
  },
  watch: {
    getDataLength(oldValue, newValue) {
      if (oldValue !== newValue) {
        this.chooseCurrSlide();
      }
    },
  },

  updated() {
    const slide = this.data.options.findIndex((opt) => opt.value === Number(this.data.value));

    if (slide === 1) {
      this.activeSlide = 0;
    }
  },

  mounted() {
    this.windowWidth = window.innerWidth;
    this.chooseCurrSlide();
  },

  computed: {
    getPolicyCardOptions() {
      return this.data.options[this.index + 1];
    },
    getTooltipsData() {
      return this.data.options[0]?.S_INFO || [];
    },
    getData() {
      const { options } = this.data;
      const firstOption = options?.[0];

      if (firstOption.S_ORDER) {
        const policyOptions = [];
        for (let policyCard = 1; policyCard < options.length; policyCard++) {
          const tempArray = Object.values(firstOption.S_ORDER).map((value) => {
            const upperedValue = value.toUpperCase();
            return {
              [firstOption[upperedValue]]: options[policyCard][upperedValue],
            };
          });
          policyOptions.push(tempArray);
        }
        return policyOptions;
      }
      if (this.options?.data) {
        return this.options.data.items;
      }
      return [];
    },
    getDataLength() {
      return this.getData.length;
    },
  },
  methods: {
    chooseCurrSlide() {
      const { options, value } = this.data;

      if (typeof value === "undefined") {
        return;
      }

      if (value) {
        // Находим начальный слайд
        let slide = options.findIndex((opt) => opt.value === Number(value));

        // Если не нашли по value, ищем слайд по умолчанию
        if (slide === -1) {
          slide = options.findIndex((opt) => opt.BDEFAULT) ? options.findIndex((opt) => opt.BDEFAULT) : 0;
        }

        this.slide = slide;

        // Обрабатываем случай, когда слайд первый или не найден
        if (slide <= 0) {
          this.activeSlide = 0;
          return;
        }

        // Для десктопной версии
        if (this.windowWidth >= 1226) {
          if (slide - 2 >= 0) {
            this.activeSlide = slide === options.length - 1 ? slide - 3 : slide - 2;
          } else {
            this.activeSlide = slide - 1;
          }
        } else {
          // Для мобильной версии
          this.activeSlide = slide - 1;
        }
      }
    },

    inputsBlur() {
      document.querySelectorAll("input").forEach((input) => {
        input.blur();
      });
    },
    handleSwipe() {
      this.inputsBlur();
      this.closeAllTooltips();
    },

    closeAllTooltips() {
      this.$store.commit("data_card/setToggleTooltip", { tooltipKey: null, isShow: false });
    },
    setFieldValueBoolean(val) {
      this.isCreated = val;
    },

    updateField(updateData) {
      this.val = updateData.value;

      this.$emit("update", {
        fieldId: updateData.fieldId,
        name: updateData.name,
        value: updateData.value,
      });
    },
  },
};
</script>
<style scoped>
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
.slider_in_col::v-deep .slick-prev,
.slider_in_col::v-deep .slick-next,
.slider_in_col::v-deep .slick-prev:hover,
.slider_in_col::v-deep .slick-next:hover,
.slider_in_col::v-deep .slick-prev:focus,
.slider_in_col::v-deep .slick-next:focus {
  width: 42px;
  height: 42px;
  border-radius: 64px;
  background: var(--warmgrey_20)
    url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxLjcwNjggMTIuNzA3MkwxNC43MDY4IDE5LjcwNzJDMTQuNTExOCAxOS45MDIyIDE0LjI1NTkgMjAuMDAwMiAxMy45OTk5IDIwLjAwMDJDMTMuNzQzOSAyMC4wMDAyIDEzLjQ4NzkgMTkuOTAyMiAxMy4yOTI5IDE5LjcwNzJDMTIuOTAxOSAxOS4zMTYyIDEyLjkwMTkgMTguNjg0MSAxMy4yOTI5IDE4LjI5MzFMMTguNTg1OSAxMy4wMDAySDIuOTk5ODhDMi40NDY4OCAxMy4wMDAyIDEuOTk5ODggMTIuNTUzMiAxLjk5OTg4IDEyLjAwMDJDMS45OTk4OCAxMS40NDcyIDIuNDQ2ODggMTEuMDAwMiAyLjk5OTg4IDExLjAwMDJIMTguNTg1OUwxMy4yOTI5IDUuNzA3MTlDMTIuOTAxOSA1LjMxNjE5IDEyLjkwMTkgNC42ODQxMyAxMy4yOTI5IDQuMjkzMTNDMTMuNjgzOSAzLjkwMjEzIDE0LjMxNTggMy45MDIxMyAxNC43MDY4IDQuMjkzMTNMMjEuNzA2OCAxMS4yOTMxQzIyLjA5NzggMTEuNjg0MSAyMi4wOTc4IDEyLjMxNjIgMjEuNzA2OCAxMi43MDcyWiIgZmlsbD0iIzI5MjkyOSIvPgo8L3N2Zz4K)
    50% 50% no-repeat;
  z-index: 1;
  box-shadow: none;
}
</style>
