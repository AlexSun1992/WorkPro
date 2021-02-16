<template>
  <div>
    <div class="mb-4">
      <b-nav v-if="pages" tabs justified>
        <b-nav-item
          v-for="(item, index) in tabs"
          :key="item.id"
          :to="getURL(item, index)"
          exact
          exact-active-class="active"
          >{{ item.name }}</b-nav-item
        >
      </b-nav>
    </div>
    <nuxt-child :key="$route.fullPath" />
  </div>
</template>

<script>
import breadcrumbs from "~/converters/breadcrumbs";
export default {
  name: "Wizard",
  async fetch({ store, route }) {
    await store.dispatch("wizard/fetchWizard", route.params);
  },
  methods: {
    getURL(item, index) {
      if (this.$route.params.idCard === "0") {
        return `/cabinet/wizard/${this.$route.params.idWizard}${
          item.list ? `/list/55/0/` : `/55/0/`
        }${item.idItem}/0/0`;
      } else {
        return `/cabinet/wizard/${this.$route.params.idWizard}${
          item.list ? `/list/55/0/` : `/55/0/`
        }${item.idItem}/${this.$route.params.idCard}/${
          this.rels.split("|")[index]
        }`;
      }
    },
  },
  computed: {
    settings: {
      get: function () {
        return breadcrumbs
          .getData(this.$store.getters["menu/menu"], {
            idModule: 55,
            idParent: 0,
            idItem: this.$route.params.idWizard,
          })
          .slice(-1)
          .pop();
      },
    },
    rels() {
      const rel = this.$store.getters["wizard/getWizard"]?.REL;
      if (this.$route.params.idCard !== "0" && rel) {
        return rel;
      } else {
        return "|";
      }
    },
    pages() {
      return this.$store.getters["wizard/getWizardPages"];
    },
    tabs() {
      let t = this.settings.wizard;
      let arr = [];
      if (this.pages) {
        const p_arr = this.pages.split(";");
        for (let i = 0; i < t.length; i++) {
          const p_item = p_arr.find((v) => parseInt(v) === t[i].idItem);
          if (p_item) {
            arr.push(t[i]);
          }
        }
      }
      return arr;
    },
  },
};
</script>

<style>
.dropdown > ul {
  min-width: fit-content;
}
.dropdown-item:hover {
  background-color: #ccc !important;
}
.dropdown-item:hover > button {
  background-color: #ccc !important;
}

.dropdown-item > button {
  background-color: white !important;
  color: black !important;
  box-shadow: none !important;
}
</style>
