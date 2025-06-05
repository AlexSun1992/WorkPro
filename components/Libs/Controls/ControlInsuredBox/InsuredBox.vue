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
        <VueSlickCarousel v-bind="settings">
          <div
            v-for="(card, indx) in getData"
            :key="data.options[indx + 1].ID"
          >
            <InsuredBoxCard
              @update="updateField"
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
  computed: {
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
      if (this.options) {
        return this.options?.data ? this.options?.data.items : [];
      }
      return [];
    },
  },
  methods: {
    updateField(updateData) {
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
</style>
