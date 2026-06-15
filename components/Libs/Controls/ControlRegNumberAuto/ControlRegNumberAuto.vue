<template>
  <div>
    <RegNumberAutoNumber
      :value="dataRegNumberValueComputed"
      :client-cars="carsShortData"
      :data="data"
      @update="updateValue($event)"
    />
  </div>
</template>

<script>
import RegNumberAutoNumber from "./RegNumberAutoNumber";

export default {
  name: "ControlRegNumberAuto",
  components: { RegNumberAutoNumber },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
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
