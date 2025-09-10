<template>
  <div>
    <RegNumberAutoNumber
      @update="updateValue($event)"
      :value="dataRegNumberValueComputed"
      :clientCars="carsShortData"
      :data="data"
    />
  </div>
</template>

<script>
import RegNumberAutoNumber from "./RegNumberAutoNumber";

export default {
  name: "ControlRegNumberAuto",
  components: { RegNumberAutoNumber },
  data() {
    return {
      carNumber: null,
      carRegion: null,
      isNotFound: null,
      isWithoutCarNumber: false,
      findNumberControllers: [],
      isNextButtonDisabled: false,
      selectedCar: null,
      cache: {},
    };
  },
  props: {
    data: {
      default: null,
    },
  },
  computed: {
    dataRegNumberValueComputed() {
      return this.data?.value;
    },
    carsShortData() {
      return this.data?.options ?? [];
    },
  },
  methods: {
    updateValue(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value,
      });
    },
  },
};
</script>
