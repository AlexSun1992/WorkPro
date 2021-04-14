<template>
  <div v-if="wizardIsError === false">
    <div
      v-if="cardCaption"
      class="block-title pt-0 position-relative mt-2 mb-4"
    >
      <i class="icon-my-profile"></i>{{ cardCaption }}
    </div>
    <b-nav v-if="pages" tabs justified class="mb-2 sticky-top">
      <b-nav-item
        v-for="(item, index) in tabs"
        :key="item.id"
        :to="getURL(item, index)"
        exact
        exact-active-class="active"
        >{{ item.name }}</b-nav-item
      >
    </b-nav>
    <nuxt-child
      ref="child"
      :key="$route.fullPath"
      :wizard-tabs="settings.wizard"
    />
    <wizard-buttons
      :currentTab="currentTab"
      :tabs="tabs"
      :qty="settings.wizard.length"
      :loading="loading"
      @goNext="goNext($event)"
      @goBack="goBack($event)"
    ></wizard-buttons>
  </div>
  <div v-else>{{ wizardErrorMessage }}</div>
</template>

<script>
import breadcrumbs from "~/converters/breadcrumbs";
import wizardButtons from "~/components/Pages/Cabinet/Wizard/WizardButtons";
export default {
  name: "Wizard",
  async fetch({ store, route }) {
    await store.dispatch("wizard/fetchWizard", route.params);
  },
  data() {
    return {
      loading: false,
    };
  },
  components: {
    wizardButtons,
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
          this.rels.split("|")[item.order - 1]
        }`;
      }
    },
    async goNext(e) {
      this.loading = true;
      if (!this.currentTab.list) {
        if (this.$store.getters["data_card/getBtnSave"]) {
          if (this.$refs["child"].$refs["cardEditor"] !== undefined) {
            await this.$refs["child"].$refs["cardEditor"].saveDataCard();
            if (this.isError()) {
              this.loading = false;
              return;
            }
          } else {
            let itemId = this.$route.params.idItem;
            let moduleId = this.$route.params.idModule;
            let cardId = this.$route.params.idCard;
            let relId = this.$route.params.idRel;
            let resp = await this.$store.dispatch("data_card/saveDataCard", {
              moduleId,
              itemId,
              cardId,
              relId,
              form: this.$store.getters["data_card/getForm"]?.data,
            });
            if (this.isError()) {
              this.loading = false;
              return;
            }
          }
        }
      }
      this.$router.push(this.getURL(e));
    },
    async goBack(e) {
      this.$router.push(this.getURL(e));
    },
    isError() {
      return this.$store.getters["data_card/getError"];
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
    currentTab() {
      return this.tabs.find((item) => item.idItem == this.$route.params.idItem);
    },
    cardCaption() {
      return this.$store.getters["wizard/getWizardCaption"];
    },
    wizardIsError() {
      return this.$store.getters["wizard/getWizardIsError"];
    },
    isCardError() {
      return this.$store.getters["data_card/getError"];
    },
    wizardErrorMessage() {
      return (
        this.$store.getters["wizard/getWizardErrorMessage"] ||
        this.$store.getters["data_card/getErrorMessage"]
      );
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

.wizard-buttons {
  display: flex;
  justify-content: space-between;
}
</style>
