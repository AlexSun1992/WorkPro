<template>
  <div>
    <div class="mb-4">
      <b-nav tabs justified>
        <b-nav-item
          v-for="(item, index) in settings.wizard"
          :key="item.id"
          :to="
            item.list
              ? '/cabinet/wizard/' +
                $route.params.idWizard +
                '/list/55/0/' +
                item.idItem +
                '/' +
                $route.params.idCard +
                '/' +
                rels.split('|')[index]
              : '/cabinet/wizard/' +
                $route.params.idWizard +
                '/55/0/' +
                item.idItem +
                '/' +
                $route.params.idCard +
                '/' +
                rels.split('|')[index]
          "
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
      if (this.$route.params.idCard) {
        return this.$store.getters["wizard/getItemOfListById"](
          `${this.$route.params.idCard}`
        ).REL;
      } else {
        return null;
      }
    },
  },
};
</script>

<style scoped></style>
