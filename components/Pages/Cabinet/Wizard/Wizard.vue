<template>
  <div>
    <div class="mb-4">
      <b-nav tabs justified>
        <b-nav-item
          v-for="(item, index) in settings.wizard"
          :key="item.id"
          :to="getURL(item, index)"
          exact
          exact-active-class="active"
          >{{ item.name }}</b-nav-item
        >
      </b-nav>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import breadcrumbs from "~/converters/breadcrumbs";
export default {
  name: "Wizard",
  async fetch({ store, route }) {
    await store.dispatch("wizard/fetchList", route.params);
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
      if (this.$route.params.idCard !== "0") {
        return this.$store.getters["wizard/getItemOfListById"](
          `${this.$route.params.idCard}`
        )?.REL;
      } else {
        return "|";
      }
    },
  },
};
</script>

<style scoped></style>
