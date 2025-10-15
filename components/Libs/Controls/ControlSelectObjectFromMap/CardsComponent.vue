<template>
  <div class="cards-component">
    <CardFavourite
      v-for="item in processedItems"
      :key="item.cachedKey"
      :itemId="itemId"
      :data="item"
      :hasShowOnMapButton="true"
      :hasChooseButton="false"
      :actionId="actionId"
      @click="handleClick"
      :selectedId="selectedId"
      :selectable="selectable"
      :relationKey="relationKey"
      :filter-icons="filterIcons"
    ></CardFavourite>
  </div>
</template>

<script>
import CardFavourite from "./CardFavourite";

export default {
  name: "CardsComponent",
  components: {
    CardFavourite,
  },
  props: {
    dataContent: {
      type: Array,
      default: () => [],
    },
    actionId: {
      type: String,
      default: "",
    },
    relationKey: {
      type: String,
      default: "",
    },
    itemId: {
      type: String,
      default: "",
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    filterIcons: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      activeTab: "list",
      searchString: "",
      placeholder: "Поиск по клинике, метро или адресу",
      favorite: false,
      isLoad: false,
      selectedId: null,
      processedItems: [],
    };
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

  computed: {
    getData() {
      return this.dataContent;
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
