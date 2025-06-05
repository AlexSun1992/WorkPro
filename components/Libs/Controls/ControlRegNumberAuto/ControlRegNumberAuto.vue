<template>
  <div>
    <RegNumberAutoNumber
      @update="
        $emit('update', {
          fieldId: data.fieldId,
          name: data.name,
          value: $event,
        })
      "
      :value="dataRegNumberValueComputed"
      :clientCars="carsShortData"
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
  methods: {},
  mounted() {},
};
</script>
