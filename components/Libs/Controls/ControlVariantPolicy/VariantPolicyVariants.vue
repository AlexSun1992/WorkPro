<template>
  <div class="variant-policy-features">
    <VueSlickCarousel v-bind="settings">
      <div v-for="card in variantsComputed" :key="card.ID">
        <div
          class="variant-policy-feature-wrapper"
          :class="{'active': selectedCard && card.ID === selectedCard.ID, 'box-flag': card.BDEFAULT}"
          @click="setActiveCard(card)"
        >
          <div class="box-title">{{ card.SNAME }}</div>

          <div>
            <control-combobox :data="{options: ['10000р', '50000р', '75000р']}"
                              v-model="selectedItem"
                              :edit="true"/>
          </div>

          <div class="variant-policy-column">
            <div v-for="(val, index) in ['&check;', '&times;', '&check;', '&times;', '&check;', '&times;', '&check;' ]"
                 :key="`val-${index}`"
                 :style="{height: rowsSize[index + 1] ? rowsSize[index + 1] : ''}"
                 class="w-100 variant-value text-center mt-2">
              <span v-html="val"></span>
            </div>
          </div>

          <div class="variant-cost">
            {{ formattedNum(card.NCOST) }} &#8381;
          </div>
        </div>
      </div>
    </VueSlickCarousel>
  </div>
</template>

<script lang="js">
import VueSlickCarousel from "vue-slick-carousel";
import {formattedNumber} from "../ControlInsuredBox/formattedNumber";
import ControlCombobox from "../ControlCombobox.vue";

export default {
  name: 'VariantPolicyVariants',
  components: {ControlCombobox, VueSlickCarousel},
  props: {
    customStore: {
      default: () => ({})
    },
    data: {
      default: () => ({})
    },
    variants: {
      default: null,
      type: () => []
    }
  },
  data() {
    return {
      selectedCard: null,
      selectedItem: null,
    }
  },
  computed: {
    settings() {
      return this.customStore.state.settings;
    },
    variantsComputed() {
      return this.variants;
    },
    features() {
      return this.customStore.state.options?.features;
    },
    fieldValue() {
      return this.customStore.state.options?.variants[0];
      // return this.customStore.state.options?.variants?.find((item) => item.ID === Number(this.data.value)) ?? {};
    },
    rowsSize() {
      return this.customStore.state?.rowsSize.map(item => `${item}px`);
    }
  },
  methods: {
    formattedNum(obj) {
      return Number.isInteger(obj) ? formattedNumber(obj) : obj;
    },

    setActiveCard(card) {
      this.selectedCard = card;
      this.updateField(card);
    },
    updateField(card) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: Number(card.ID),
      });
    },

    mounted() {
      setInterval(() => {console.log(this.rowsSize)}, 1000);
    }
  },
}
</script>

<style lang="scss" scoped>
.variant-policy-features {
  --green-color: #43B02A;
}

.variant-policy-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.variant-policy-feature-wrapper {
  border-radius: 30px;
  border: 2px solid var(--warmgrey-30, #e1e1e1);
  background: #fff;
  background: var(--white, #fff);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
  padding: 30px 11px 28px;
  position: relative;
  cursor: pointer;
  height: 100%;
}

.variant-cost {
  margin: auto;
  margin-top: 20px;
  border-radius: 5px;
  padding: 4px;
  text-align: center;
  background-color: var(--green-color);
  width: 50%;
  color: white;
}

.variant-cost:hover {
  opacity: 0.8;
}

.box-description {
  text-align: center;
}

.box-title {
  text-align: center;
}

.variant-policy-feature-wrapper.active {
  outline: 3px solid var(--green-color);
  border: none;
}

.variant-policy-feature-wrapper.active .variant-cost {
  background-color: var(--green-color);
}

.variant-policy-feature-wrapper:nth-child(2n+1) .variant-value:nth-child(2n+1) {
  background-color: gainsboro;
}

.variant-policy-feature-wrapper:nth-child(2n+1) .variant-value:nth-child(2n) {
  background-color: white;
}

.variant-policy-feature-wrapper:nth-child(2n) .variant-value:nth-child(2n) {
  background-color: gainsboro;
}

.variant-policy-feature-wrapper:nth-child(2n) .variant-value:nth-child(2n+1) {
  background-color: white;
}

.box-flag::before {
  content: "Оптимальный";
  background-color: var(--green-color);
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 600;
  color: rgb(255, 255, 255);
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
