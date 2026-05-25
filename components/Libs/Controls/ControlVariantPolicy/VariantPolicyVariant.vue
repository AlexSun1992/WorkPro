<template>
  <div
    class="variant-policy"
    :class="{ active: isCardSelected, 'box-flag': card.BDEFAULT }"
    @click="setActiveCard"
    :id="card.ID"
  >
    <div>
      <div class="box-title">{{ card.SNAME }}</div>

      <div
        class="frn"
        :style="{ height: cellsHeight[0] ? cellsHeight[0] : null }"
      >
        <VariantPolicyFranchise
          :options="options"
          v-model="selectedFranchise"
          @input="updateFranchise"
          :defaultValue="defaultFranchiseValue"
        />
      </div>

      <div class="variant-policy-column">
        <template v-for="(item, index) in variantsList">
          <div
            :style="{ height: cellsHeight[index] ? cellsHeight[index] : null }"
            v-if="index"
            :key="item.field"
            :class="getFeatureIcon(item.text)"
          />
        </template>
      </div>

      <div class="variant-cost">{{ formattedNum(card.NPRICE) }} &#8381;</div>
    </div>
  </div>
</template>

<script lang="js">
import { formattedNumber } from "../ControlInsuredBox/formattedNumber";
import VariantPolicyFranchise from "./VariantPolicyFranchise.vue";
import { variantPolicyUtils } from "@/utils/variant_policy/variantPolicyUtils";
import constants from "./constants"

const featureIcons = { Y: "attr_no", N: "attr_yes" };

export default {
  name: 'VariantPolicyVariant',
  components: { VariantPolicyFranchise },
  // TODO: Vue3 migration — удалить prop "value" и event "input" после полного перехода на Vue 3 (оставлено для обратной совместимости c v-model Vue 2)
  props: {
    value: {
      type: Object,
      default: () => ({
        [constants.idFranchise]: null,
        [constants.idVariant]: null
      })
    },
    modelValue: {
      type: Object,
      default: undefined
    },
    variants: {
      type: Array,
      default: null,
    },
    card: {
      type: Object,
      default: null
    },
    featuresOrder: {
      type: Array,
      default: null
    },
    cellsHeight: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedFranchise: null
    }
  },

  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    },
    selectedVariantId() {
      return this.currentValue[constants.idVariant];
    },
    isCardSelected() {
      return this.selectedVariantId === this.card.ID;
    },
    variantsList() {
      return variantPolicyUtils.getFeaturesList(this.featuresOrder, this.card, null);
    },
    options() {
      const franchise = this.card.SFRANCHISE;
      const isFranchiseArray = Array.isArray(franchise);

      return {
        list: isFranchiseArray ? franchise : null,
        value: !isFranchiseArray ? franchise : null
      }
    },
    defaultFranchiseValue() {
      return this.card.ID_DEFAULT_FRAN;
    }
  },

  watch: {
    isCardSelected(val) {
      if (!val) {
        this.selectedFranchise = this.defaultFranchiseValue;
      }
    }
  },

  mounted() {
    this.selectedFranchise = this.currentValue[constants.idFranchise];
  },

  methods: {
    formattedNum(obj) {
      return Number.isInteger(obj) ? formattedNumber(obj) : obj;
    },
    setActiveCard() {
      this.updateVariant(this.card.value);
    },
    updateVariant(val) {
      const payload = {
        [constants.idFranchise]: this.card[constants.defaultFran] ?? null,
        [constants.idVariant]: val
      };
      // TODO: Vue3 migration — удалить emit "input" после перехода на Vue 3
      this.$emit("input", payload);
      this.$emit("update:modelValue", payload);
    },
    updateFranchise(val) {
      const payload = { [constants.idVariant]: this.card.ID, [constants.idFranchise]: val };
      // TODO: Vue3 migration — удалить emit "input" после перехода на Vue 3
      this.$emit("input", payload);
      this.$emit("update:modelValue", payload);
    },
    getFeatureIcon(value) {
      return featureIcons[value] ?? '-';
    },
  },
}
</script>

<style scoped>
.variant-policy-column > * {
  height: 50px;
  display: flex;
  align-items: center;
  color: transparent;
  pointer-events: none;
}

.frn {
  height: 50px;
  color: #43b02a;
  font-weight: 600;
  text-align: center;
  display: grid;
  align-items: center;
}

header {
  background-image: url("data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAICAYAAAAm06XyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACjSURBVHgBjZExEoIwEEX/lzPQ69jlFBm0VyvHjpsYjuAJbKVCL8DgDaxSygFyiLgwUDiQ6G+S3eRt/maZVSoncfWEqXe2wA9tH+rsPQzIfDEmKYlMDv4CByVt6V7rY0oQmoBenVK0N/eMgbIW9d5eki54l66JFZiAB9vvk/FCqEAI7Fud2KuUkc8bemcjiJ4Dv16ecyDhMgRG1TnY3JWXUQahDzHqXVUY+QEHAAAAAElFTkSuQmCC");
}

.box-title {
  font-weight: 600;
  text-align: center;
  height: 57px;
  padding-top: 1rem;
  align-items: end;
  width: 80%;
  margin: 0 auto;
  display: grid;
}

.variant-policy-feature-wrapper .variant-policy-column {
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
  background: #eff1f3;
  color: #292929;
  border-radius: 15px;
  text-align: center;
  width: 100%;
  height: 42px;
  font-weight: 700;
  line-height: 42px;
}

.box-description {
  text-align: center;
}

.box-title {
  text-align: center;
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

.variant-policy {
  border: 1px solid #bec7cb;
  padding: 1px;
  border-radius: 30px;
  box-sizing: border-box;
}
.variant-policy.active {
  border: 3px solid #43b02a;
  padding: 0;
}

.variant-policy > div {
  padding: 0 13px 13px 13px;
}

@media (max-width: 992px) {
  .variant-policy-column > * {
    height: auto;
    pointer-events: none;
    padding: 12px 10px 12px 0;
    height: auto;
    color: transparent;
    min-height: 50px;
  }
}
</style>
