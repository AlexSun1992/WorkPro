<template>
  <div class="test">
    <ul v-if="this.dataItems.length !== 0" class="menu">
      <li propertyName v-for="(item, idx) in dataItems" :key="idx">
        <b-button v-on:click="revealItem(item, idx)">
          {{ item }}
        </b-button>
      </li>
    </ul>
    <ul v-else class="menu">
      <li propertyName v-for="(item, idx) in dataContent" :key="idx">
        <b-button v-on:click="revealItem(item[propertyName], idx)">
          {{ item[propertyName] }}
        </b-button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterBlock",

  props: {
    propertyName: {
      type: String,
      required: true,
      default: () => {},
    },

    checked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      dataItems: [],
      // checked: false,
      // items: [],
      // obj: {},
    };
  },

  methods: {
    revealItem(item, idx) {
      this.$store.commit("blocks/setFilters", {
        elementName: item,
        elementOrder: idx,
        checked: this.checked,
      });

      // this.items.push(item);
      // if (this.propertyName !== undefined) {
      //   this.$store.commit("blocks/setPropertyName", this.propertyName);
      // }
      // this.$store.commit("blocks/setFilters", {
      //   element: item,
      //   id: idx,
      // });
    },
  },

  computed: {
    dataContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](712);
        if (block) {
          const group = [];
          block.data.items.forEach((item) => {
            if (!group.includes(item[this.propertyName])) {
              group.unshift(item[this.propertyName]);
            }

            if (!this.dataItems.includes(item[this.propertyName])) {
              this.dataItems.unshift(item[this.propertyName]);
            }
          });
        } else {
          return {};
        }
      },
    },
  },
  created() {
    console.log(this.checked);
  },
};
</script>

<style scoped>
.menu {
  display: flex;
}

.red {
  background-color: red;
}

li {
  list-style: none;
  cursor: pointer;
}
</style>
