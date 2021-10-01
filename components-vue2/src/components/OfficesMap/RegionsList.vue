<template>
  <div class="container">
    <div v-for="(region, index) in regions" :key="index">
      <div class="p-4">
        <span v-if="isTitle(region)"
          ><strong>{{ region.title }}</strong>
        </span>
        <div
          class="region"
          @click="openRegion(item)"
          v-for="(item, index) in region.data"
          :key="index"
        >
          {{ item.SNAME }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegionsList",
  async created() {
    await this.$store.dispatch("map/fetchRegionsList");
  },
  computed: {
    regions() {
      return this.$store.getters["map/getRegionsList"];
    },
  },
  methods: {
    isTitle(region) {
      return region.title[0] != "Г";
    },
    openRegion(region) {
      this.$store.dispatch("map/fetchRegion", region);
      this.$store.commit("map/setSelectedRegion", region.SNAME);
    },
  },
};
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}
.region {
  cursor: pointer;
}
</style>
