<template>
  <div>
    <div v-for="(f, i) in filters" :key="i">
      <b-button
        class="mr-2"
        variant="success"
        @click="update(f, i)"
        :class="{ active: selectedIndex === i }"
      >
        {{ f.text }}
      </b-button>
    </div>
    <button :disabled="disabled" @click="update" class="ml-3">
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
    update(f, i) {
      if (!f.name) {
        this.activeFilter = null;
        this.selectedIndex = null;
      } else {
        this.activeFilter = f;
        this.selectedIndex = i;
      }
      this.$emit("update", f);
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
