<template>
  <div class="container">
    <div v-if="offices" class="offices">
      <div v-for="(office, index) in updatedOffices" :key="index">
        <OfficeCard :office="office" />
      </div>
    </div>
    <Paginator @update="updatedOffices = $event" :data="offices" :size="15" />
  </div>
</template>

<script>
import Paginator from "./Paginator.vue";
import OfficeCard from "./OfficeCard.vue";
export default {
  name: "OfficesList",
  components: {
    Paginator,
    OfficeCard,
  },
  data() {
    return {
      updatedOffices: null,
    };
  },
  computed: {
    offices() {
      return this.$store.getters["map/getRegionOffices"];
    },
    region() {
      return this.$store.getters["map/getSelectedRegion"];
    },
  },
};
</script>

<style scoped>
.offices {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2vw;
}
</style>
