<template>
  <div class="container">
    <div v-for="(filter, index) in filters" :key="index">
      <b-button
        class="mr-2"
        variant="success"
        :class="{ active: selectedIndex === index }"
        @click="update(filter, index)"
      >
        {{ filter.text }}
      </b-button>
    </div>
    <button :disabled="disabled" class="ml-3" @click="update('')">
      Сбросить фильтры
    </button>
  </div>
</template>

<script>
import { BButton } from "bootstrap-vue";
export default {
  name: "FilterComponent",
  components: {
    BButton,
  },
  data() {
    return {
      activeFilter: null,
      selectedIndex: null,
    };
  },
  props: {
    filters: {
      type: Array,
    },
  },
  methods: {
    update(filter, index) {
      this.selectedIndex = index;
      this.activeFilter = filter;
      this.$emit("update", filter);
    },
  },
  computed: {
    disabled() {
      return !this.activeFilter;
    },
    region() {
      return this.$store.getters["map/getSelectedRegion"];
    },
  },
  watch: {
    region: function (val) {
      this.activeFilter = null;
      this.selectedIndex = null;
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
}

button {
  padding: 10px 30px;
  cursor: pointer;
}
.active {
  background-color: #3d5443 !important;
}
</style>
