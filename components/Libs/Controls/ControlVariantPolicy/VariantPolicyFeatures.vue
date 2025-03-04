<template>
  <div>
    <div class="variant-policy-feature"></div>
    <div
      class="variant-policy-feature"
      v-for="item in columnData"
      :key="item.value"
    >
      <div class="d-flex justify-content-between align-items-center">
        <div>
          {{ item.text }}
          <span class="position-relative">
            <span class="tooltipster">
              <vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
                <div>{{ item.hint }}</div>
              </vue-easy-tooltip>
            </span>
          </span>
        </div>
      </div>
    </div>
    <div class="variant-policy-feature"></div>
  </div>
</template>

<script>
import { variantPolicyUtils } from "../../../../utils/variant_policy/variantPolicyUtils";

export default {
  name: "VariantPolicyFeatures",
  props: {
    customStore: {
      type: Object,
      default: () => ({}),
    },
    featuresData: {
      type: Object,
      default: null,
    },
    featuresOrder: {
      type: Array,
      default: null,
    },
    featuresHint: {
      type: Array,
      default: null,
    },
  },
  computed: {
    features() {
      return variantPolicyUtils.getFeaturesList(this.featuresOrder, this.featuresData, this.featuresHint);
    },
    columnData() {
      return [...this.features];
    },
  },
  data() {
    return {
      rows: [],
    };
  },
  methods: {
    calcRowsSize() {
      const selector =
        ".variant-policy-feature-wrapper .variant-policy-feature";
      const rows = document.querySelectorAll(selector);
      const sizes = [];

      if (rows.length && !this.calcRowsSize.inProgress) {
        this.calcRowsSize.inProgress = true;

        rows.forEach((item) => {
          sizes.push(item.clientHeight);
        });

        setTimeout(() => {
          this.calcRowsSize.inProgress = false;
        }, 50);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.variant-policy-feature {
  height: 50px;
  display: flex;
  padding: 0 12px;

  &:nth-child(even) {
    background-color: #ecf3fa;
  }

  &:first-child {
    height: 57px;
  }
}

@media (max-width: 992px) {
  .variant-policy-feature {
    height: auto;
    padding: 12px 24px 12px 12px;
    min-height: 50px;
  }
}
</style>
