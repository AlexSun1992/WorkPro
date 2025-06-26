<template>
  <div>
    <div
      v-html="data && data.label ? data.label : ''"
      class="mb-3"
    />
    <div class="variant-policy-feature-wrapper">
      <div>
        <VariantPolicyFeatures
          :featuresData="featuresData"
          :featuresOrder="featuresOrder"
          :featuresHint="featuresHint"
          @updateCellsHeight="updateFeaturesHeight"
        />
      </div>
      <div>
        <div class="variant-policy-features">
          <VueSlickCarousel
            ref="carousel"
            v-bind="settings"
          >
            <div
              v-for="card in variants"
              :key="card.ID"
            >
              <VariantPolicyVariant
                v-model="selectedVariant"
                :cellsHeight="featuresCellsHeight"
                :card="card"
                :data="data"
                :featuresOrder="featuresOrder"
                :variants="variants"
              />
            </div>
          </VueSlickCarousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import VariantPolicyVariant from "./VariantPolicyVariant.vue";
import VariantPolicyFeatures from "./VariantPolicyFeatures.vue";

const defaultSettings = {
  arrows: true,
  centerPadding: "16px",
  focusOnSelect: true,
  slidesToShow: 3,
  speed: 500,
  infinite: false,
  initialSlide: null,
  centerMode: false,
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
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 0,
      settings: {
        dots: true,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
      },
    },
  ],
};

export default {
  name: "ControlVariantPolicy",
  components: { VueSlickCarousel, VariantPolicyVariant, VariantPolicyFeatures },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({
        options: [],
      }),
    },
    edit: {
      type: Boolean,
      required: false,
      default: () => true,
    },
  },
  data() {
    return {
      previousVariant: null,
      selectedVariant: null,
      featuresCellsHeight: [],
    };
  },
  computed: {
    settings() {
      return defaultSettings;
    },
    options() {
      return this.data?.options ?? [];
    },
    variants() {
      return this.options.filter((item) => item.SDESCRIPTION === "false");
    },
    featuresOrder() {
      const order = this.options.find((item) => item.SDESCRIPTION === "true")?.S_ORDER ?? [];

      return order.map((item) => item.toUpperCase());
    },
    featuresHint() {
      const hintArr = this.options.find((item) => item.SDESCRIPTION === "true")?.S_INFO ?? [];

      return hintArr.map((item, index) => ({
        [this.featuresOrder[index]]: item,
      }));
    },
    dataValue() {
      const { value } = this.data;
      const result = { IDVARIANT: null, IDFRNANCHISE: null };

      Array.isArray(value) && Object.assign(result, value[0]);
      typeof value === "string" && Object.assign(result, JSON.parse(value));

      return result;
    },
    featuresData() {
      return this.options.find((item) => item.SNAME === "scaption");
    },
  },

  watch: {
    dataValue: {
      immediate: true,
      handler(val) {
        this.selectedVariant = val;
      },
    },
    selectedVariant: {
      immediate: true,
      handler() {
        const currentVal = this.selectedVariant;

        const str = JSON.stringify(currentVal) ?? null;

        if (this.previousVariant === str) {
          return;
        }

        this.previousVariant = str;

        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          type: this.data.type,
          value: str,
        });
      },
    },
  },

  mounted() {
    this.scrollToActiveVariant();
  },

  methods: {
    updateFeaturesHeight(ev) {
      this.featuresCellsHeight = ev;
    },
    scrollToActiveVariant() {
      const selectedVariantId = this.data?.value?.IDVARIANT;
      const index = this.variants.findIndex((item) => item.ID === selectedVariantId) ?? 0;

      this.$refs.carousel?.goTo(index);
    },
  },
};
</script>

<style scoped>
.variant-policy-feature-wrapper {
  border-radius: 30px;
  background: #fff;
  background: var(--white, #fff);
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.08);
  position: relative;
  cursor: default;
  height: 100%;
  display: grid;
  grid-template-columns: 30% 70%;
}

.variant-policy-features {
  --green-color: #43b02a;
}

.row.nowrap .col-3 {
  padding-right: 0;
}

.row.nowrap .col-9 {
  padding-left: 0;
}
@media (max-width: 992px) {
  .variant-policy-feature-wrapper {
    grid-template-columns: 50% 50%;
  }
}
</style>
