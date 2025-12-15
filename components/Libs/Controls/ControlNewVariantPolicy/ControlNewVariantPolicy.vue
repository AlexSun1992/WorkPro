<template>
  <div>
    <div
      v-html="isLabel"
      class="mb-3"
    />
    <div class="variant-policy">
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
          :choosenFranchise="getChoosenFranshise"
          :isAnyCardChoosenByClick="anyValueChoosenByClick"
          :choosenPoliceByDefault="defaultPoliceFromComponentValue"
          :police="police"
          :class="selectClass(police.ID)"
        >
        </NewVariantPolicy>
      </div>
    </div>
  </div>
</template>

<script>
import NewVariantPolicy from "./NewVariantPolicy";
import { hasValidValue } from "./ControlNewVariantPolicy.helpers";

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
      choosenFranshise: null,
      anyValueChoosenByClick: false,
      defaultPoliceFromComponentValue: null,
    };
  },

  computed: {
    getChoosenFranshise() {
      return this.choosenFranshise;
    },

    selectClass() {
      return (el) => (el === this.selectedPolice || el === this.optionalId ? "active" : "");
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
    const isValueInPolicy = hasValidValue(this.data);
    if (isValueInPolicy && typeof this.data.value === "string") {
      try {
        const choosenValue = JSON.parse(this.data.value);
        const { IDVARIANT: choosenId, IDFRNANCHISE: choosenFranshise = null } = choosenValue;

        if (choosenId !== null) {
          this.optionalId = choosenId;
          this.selectedFranchise = choosenFranshise;
          this.choosenFranshise = choosenFranshise;
          this.defaultPoliceFromComponentValue = choosenId;
          this.emitUpdate(choosenId, choosenFranshise);
          return;
        }
      } catch (error) {
        console.warn("Failed to parse policy value:", error.message);
      }
    }

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
      this.anyValueChoosenByClick = true;

      if (el?.ID !== this.defaultPoliceFromComponentValue) {
        this.defaultPoliceFromComponentValue = null;
      }

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
      if (this.choosenFranshise && typeof this.defaultPoliceFromComponentValue === "number") {
        return this.choosenFranshise;
      }
      if (typeof tab.SFRANCHISE === "string" && tab.SFRANCHISE.startsWith("[") && this.choosenFranshise) {
        return JSON.parse(tab.SFRANCHISE)[0] || null;
      }
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
.variant-policy {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
@media (max-width: 1224px) {
  .variant-policy {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  .variant-policy {
    grid-template-columns: 1fr;
  }
}
</style>
