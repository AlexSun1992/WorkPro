<template>
  <div
    class="variant-policy"
    :class="{ active: isCardSelected, 'box-flag': card.BDEFAULT }"
    @click="setActiveCard"
  >
    <div>
      <div class="box-title">{{ card.SNAME }}</div>

      <div class="frn">
        <VariantPolicyFranchise
          :options="card.SFRANCHISE"
          v-model="selectedFranchise"
          @input="setFranchise"
          :customStore="customStore"
        />
      </div>

      <div class="variant-policy-column">
        <template v-for="(item, index) in featuresListComputed">
          <div v-if="index" :key="item" :class="getFeatureIcon(card[item])">
            {{ featuresDataComputed && featuresDataComputed[item] || "" }}
          </div>
        </template>
      </div>

      <div class="variant-cost">{{ formattedNum(card.NPRICE) }} &#8381;</div>
    </div>
  </div>
</template>

<script lang="js">
import { formattedNumber } from "../ControlInsuredBox/formattedNumber";
import VariantPolicyFranchise from "./VariantPolicyFranchise.vue";

const featureIcons = { Y: "attr_no", N: "attr_yes" };

export default {
  name: 'VariantPolicyVariant',
  components: { VariantPolicyFranchise },
  props: {
    customStore: {
      default: () => ({})
    },
    variants: {
      default: null,
    },
    card: {
      default: null
    },
    featuresList: {
      default: null
    },
    featuresData: {
      default: null
    }
  },
  data() {
    return {
      selectedFranchise: null,
      selectedVariant: null
    }
  },
  computed: {
    isCardSelected() {
      return this.customStore.state.selectedVariant?.IDVARIANT === this.card.ID;
    },
    featuresListComputed() {
      return this.featuresList;
    },
    featuresDataComputed() {
      return this.featuresData;
    }
  },
  methods: {
    formattedNum(obj) {
      return Number.isInteger(obj) ? formattedNumber(obj) : obj;
    },

    setActiveCard() {
      this.setVariant(this.card.ID);
      this.updateVariant(this.card);
    },
    updateVariant() {
      this.$emit('updateVariant', this.customStore.state.selectedVariant);
    },

    getFeatureIcon(value) {
      return featureIcons[value] ?? '-';
    },

    setVariant(val) {
      this.customStore?.setVariant(val);
      this.customStore?.setFranchise(this.selectedFranchise);
    },

    setFranchise(val) {
      this.customStore?.setFranchise(val);
      this.setVariant(this.card?.ID)
    }
  },
}
</script>

<style lang="scss" scoped>
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

  &.active {
    border: 3px solid #43b02a;
    padding: 0;
  }
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
<style>
.cabinet .variant-policy-features .slick-slide {
  border: 0;
}

.cabinet .variant-policy-features .slick-slide {
  padding: 0 5px;
}

.cabinet .variant-policy-features .slick-slider {
  margin: 0 -5px;
}

.attr_no {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxNCAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42NzUyIDAuMzI0NzZDMTQuMTA4MyAwLjc1Nzc3MyAxNC4xMDgzIDEuNDU5ODMgMTMuNjc1MiAxLjg5Mjg0TDUuNTY2NDQgMTAuMDAxNkM1LjEzMzQzIDEwLjQzNDcgNC40MzEzNyAxMC40MzQ3IDMuOTk4MzYgMTAuMDAxNkwwLjMyNDc2IDYuMzI4MDRDLTAuMTA4MjUzIDUuODk1MDMgLTAuMTA4MjUzIDUuMTkyOTcgMC4zMjQ3NiA0Ljc1OTk2QzAuNzU3NzczIDQuMzI2OTUgMS40NTk4MyA0LjMyNjk1IDEuODkyODQgNC43NTk5Nkw0Ljc4MjQgNy42NDk1MkwxMi4xMDcyIDAuMzI0NzZDMTIuNTQwMiAtMC4xMDgyNTMgMTMuMjQyMiAtMC4xMDgyNTMgMTMuNjc1MiAwLjMyNDc2WiIgZmlsbD0iIzQzQjAyQSIvPgo8L3N2Zz4K")
    50% 50% no-repeat;
  min-width: 20px;
}

.attr_yes {
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyIDEyQzIyIDE3LjUxNCAxNy41MTQgMjIgMTIgMjJDNi40ODYgMjIgMiAxNy41MTQgMiAxMkMyIDYuNDg2IDYuNDg2IDIgMTIgMkMxNy41MTQgMiAyMiA2LjQ4NiAyMiAxMlpNMjAgMTJDMjAgNy41ODkgMTYuNDExIDQgMTIgNEM3LjU4OSA0IDQgNy41ODkgNCAxMkM0IDE2LjQxMSA3LjU4OSAyMCAxMiAyMEMxNi40MTEgMjAgMjAgMTYuNDExIDIwIDEyWiIgZmlsbD0iI0VCNTc1NyIvPgo8cGF0aCBkPSJNMTUuNzA3MiA5LjcwNzMxTDEzLjQxNDIgMTIuMDAwM0wxNS43MDcyIDE0LjI5MzNDMTYuMDk4MiAxNC42ODQyIDE2LjA5ODIgMTUuMzE2MyAxNS43MDcyIDE1LjcwNzNDMTUuNTEyMiAxNS45MDIzIDE1LjI1NjIgMTYuMDAwMyAxNS4wMDAyIDE2LjAwMDNDMTQuNzQ0MiAxNi4wMDAzIDE0LjQ4ODIgMTUuOTAyMyAxNC4yOTMzIDE1LjcwNzNMMTIuMDAwMiAxMy40MTQyTDkuNzA3MTkgMTUuNzA3M0M5LjUxMjE5IDE1LjkwMjMgOS4yNTYyMiAxNi4wMDAzIDkuMDAwMjIgMTYuMDAwM0M4Ljc0NDIyIDE2LjAwMDMgOC40ODgyNSAxNS45MDIzIDguMjkzMjUgMTUuNzA3M0M3LjkwMjI1IDE1LjMxNjMgNy45MDIyNSAxNC42ODQyIDguMjkzMjUgMTQuMjkzM0wxMC41ODYyIDEyLjAwMDNMOC4yOTMyNSA5LjcwNzMxQzcuOTAyMjUgOS4zMTYzMSA3LjkwMjI1IDguNjg0MjUgOC4yOTMyNSA4LjI5MzI1QzguNjg0MjUgNy45MDIyNSA5LjMxNjE5IDcuOTAyMjUgOS43MDcxOSA4LjI5MzI1TDEyLjAwMDIgMTAuNTg2M0wxNC4yOTMzIDguMjkzMjVDMTQuNjg0MiA3LjkwMjI1IDE1LjMxNjIgNy45MDIyNSAxNS43MDcyIDguMjkzMjVDMTYuMDk4MiA4LjY4NDI1IDE2LjA5ODIgOS4zMTYzMSAxNS43MDcyIDkuNzA3MzFaIiBmaWxsPSIjRUI1NzU3Ii8+Cjwvc3ZnPgo=")
    50% 50% no-repeat;
  min-width: 20px;
}

@media (max-width: 992px) {
  .cabinet .variant-policy-features .slick-slide {
    padding: 0;
  }

  .cabinet .variant-policy-features .slick-slider {
    margin: 0;
  }

  .cabinet .variant-policy-feature-wrapper .slick-list {
    padding: 0 !important;
  }
}
</style>
