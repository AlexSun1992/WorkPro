<template>
  <div>
    <div
      v-html="isLabel"
      class="mb-3"
    />
    <div class="variant-policy-feature-wrapper">
      <div class="variant-policy-features">
        <div
          v-for="police in data.options"
          :key="police.ID"
        >
          <NewVariantPolicy
            :data="data"
            @input="getChoosenValue"
            v-model="selectedFranchise"
            :firstValueFranchise="getFirstValueFranschise"
            :defaultValue="defaultValueFranschise"
            :police="police"
            :class="selectClass(police.ID)"
          >
          </NewVariantPolicy>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NewVariantPolicy from "./NewVariantPolicy";

export default {
  name: "ControlNewVariantPolicy",
  components: { NewVariantPolicy },
  props: {
    data: {
      type: Object,
      default: () => ({
        options: [],
      }),
    },
  },
  data() {
    return {
      selectedPolice: null,
      selectedFranchise: null,
      optionalId: false,
    };
  },

  computed: {
    selectClass() {
      return (el) =>
        el === this.selectedPolice || el === this.optionalId ? "default_border_choosen" : "default_border";
    },

    isLabel() {
      return this.data?.label || "";
    },

    getFirstValueFranschise() {
      const franchiseData = this.getOptionalItem?.SFRANCHISE;

      if (typeof franchiseData !== "string") return null;

      try {
        const franchiseArray = JSON.parse(franchiseData);
        return franchiseArray?.[0]?.id ?? null;
      } catch {
        return null;
      }
    },

    getOptionalItem() {
      return this.data.options?.find((item) => item.SOPTIMAL === "Y");
    },

    defaultValueFranschise() {
      const optionalItem = this.getOptionalItem;
      return optionalItem?.ID_DEFAULT_FRAN ?? false;
    },
  },
  watch: {
    selectedPolice(val) {
      if (val) {
        this.optionalId = false;
      }
    },
  },
  mounted() {
    const optionalItem = this.data.options?.find(({ SOPTIMAL }) => SOPTIMAL === "Y");

    if (!optionalItem) return;

    const { ID: optionalId, ID_DEFAULT_FRAN: defaultFranchise = null } = optionalItem;

    this.optionalId = optionalId;

    this.selectedFranchise = defaultFranchise;

    this.emitUpdate(optionalId, defaultFranchise);
  },
  methods: {
    isClass(el) {
      return el === this.selectedPolice;
    },
    getChoosenValue(el) {
      if (el?.ID) {
        // Клик по вкладке
        this.selectedPolice = el.ID;
        const franchiseId = this.getFranchiseId(el);
        this.emitUpdate(el.ID, franchiseId);
      } else if (el?.el?.ID) {
        // Клик по франшизе
        this.selectedPolice = el.el.ID;
        this.isClass(el.el.ID);
        this.emitUpdate(el.el.ID, el.value);
      }
    },
    getFranchiseId(tab) {
      if (!tab.SFRANCHISE) return null;
      if (tab.ID_DEFAULT_FRAN) return tab.ID_DEFAULT_FRAN;
      if (typeof tab.SFRANCHISE === "string" && tab.SFRANCHISE.startsWith("[")) {
        return JSON.parse(tab.SFRANCHISE)[0] || null;
      }
      return null;
    },
    emitUpdate(variantId, franchiseId) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        type: this.data.type,
        value: JSON.stringify({ IDVARIANT: variantId, IDFRNANCHISE: franchiseId }),
      });
    },
  },
};
</script>
<style scoped>
.default_border {
  border: 1px solid #d1d5db;
  border-radius: 12px;
}
.default_border_choosen {
  border: 3px solid green;
  border-radius: 12px;
}
</style>
