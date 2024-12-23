export function VariantPolicyStore() {
  const result = {
    state: {
      rowsSize: [],
      ref: null,
      selectedVariant: { IDVARIANT: null, IDFRNANCHISE: null },
      featuresList: []
    }
  };

  result.setRowsSize = (val) => {
    result.state.rowsSize = Array(val) ? val : [];
  }

  result.setFranchise = (val) => {
    result.state.selectedVariant.IDFRNANCHISE = val ?? null;
  }

  result.setVariant = (val) => {
    result.state.selectedVariant.IDVARIANT = val;
  }

  result.setSelectedVariant = (val) => {
    typeof(val) === "string" && Object.assign(result.state.selectedVariant, JSON.parse(val));
    typeof(val) === "object" && Object.assign(result.state.selectedVariant, val);
  }

  result.setFeaturesList = (val) => {
    result.state.featuresList = val;
  }

  return result;
}
