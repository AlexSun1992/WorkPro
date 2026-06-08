<template>
  <div class="cards-component">
    <CardFavourite
      v-for="item in processedItems"
      :key="item.cachedKey"
      :item-id="itemId"
      :data="item"
      :has-show-on-map-button="true"
      :has-choose-button="false"
      @click="handleClick"
      :selected-id="selectedId"
      :selectable="selectable"
    ></CardFavourite>
  </div>
</template>

<script>
import CardFavourite from "./CardFavourite";

export default {
  name: "ObjectList",
  components: {
    CardFavourite,
  },
  props: {
    dataContent: {
      type: Array,
      default: () => [],
    },

    itemId: {
      type: Number,
      default: undefined,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      activeTab: "list",
      searchString: "",
      placeholder: "Поиск по названию, метро или адресу",
      favorite: false,
      isLoad: false,
      selectedId: null,
      processedItems: [],
    };
  },

  computed: {
    getData() {
      return this.dataContent;
    },
  },
  watch: {
    getData: {
      immediate: true,
      handler(newData) {
        const idCount = new Map();
        this.processedItems = newData.map((item) => {
          const count = idCount.get(item.ID) || 0;
          idCount.set(item.ID, count + 1);
          return {
            ...item,
            cachedKey: count === 0 ? item.ID : `${item.ID}-${count}`,
          };
        });
      },
    },
  },
  methods: {
    handleClick(id) {
      this.selectedId = id;
      this.$emit("select", id);
    },
  },
};
</script>

<style scoped>
.heart {
  background-color: greenyellow;
}
.heart.active {
  background-color: green;
}
</style>
