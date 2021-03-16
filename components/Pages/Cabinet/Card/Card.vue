<template>
  <div>
    <div class="animated fadeIn">
      <b-button
        class="mb-2"
        v-if="isAddNewRecord"
        v-on:click="addNewRecord"
        type="submit"
        variant="primary"
        >Добавить новую запись</b-button
      >
      <b-button
        class="mb-2"
        v-if="isList"
        v-on:click="refreshCardList"
        type="submit"
        variant="primary"
        >Обновить</b-button
      >
      <card-list
        v-if="isList"
        :load="isListLoading"
        :data="listData"
        @action-clicked="openCardForm"
      />
    </div>
  </div>
</template>

<script>
import CardList from "./CardList";

export default {
  name: "Card",
  async created() {
    await this.$store.dispatch("card/fetchList", this.$route.params);
  },
  components: { CardList },
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  methods: {
    async openCardForm(data) {
      if (!this.params.settings.wizard.length) {
        if (data.data.item.REL && this.params.page.idWizard) {
          this.$router.push({
            path: `/cabinet/${this.params.page.idModule}/0/${this.params.page.idItem}/${data.data.item.ID}/${data.data.item.REL}`,
            query: { ref: this.$route.path },
          });
        } else {
          if (data.data.item.REL) {
            this.$router.push(
              `/cabinet/${this.params.page.idModule}/0/${this.params.page.idItem}/${data.data.item.ID}/${data.data.item.REL}`
            );
          }
        }
        return;
      }
      if (this.params.settings.wizard.length) {
        await this.$store.dispatch("wizard/fetchWizard", {
          idModule: this.params.page.idModule,
          idWizard: this.params.page.idItem,
          idCard: data.data.item.ID,
        });
        this.$router.push(
          `/cabinet/wizard/${this.params.page.idItem}/${this.params.page.idModule}/0/${this.params.settings.wizard[0].idItem}/${data.data.item.ID}/${this.wizardRel}`
        );
      }
    },
    addNewRecord() {
      if (this.params.settings.wizard.length) {
        this.$router.push(
          `/cabinet/wizard/${this.params.page.idItem}/${this.params.page.idModule}/0/${this.params.settings.wizard[0].idItem}/0/0`
        );
      } else {
        if (this.params.page.idWizard) {
          this.$router.push({
            path: `/cabinet/${this.params.page.idModule}/0/${this.params.page.idItem}/${this.params.page.idCard}/0/0`,
            query: { ref: this.$route.path },
          });
        } else {
          this.$router.push(
            `/cabinet/${this.params.page.idModule}/0/${this.params.page.idItem}/0`
          );
        }
      }
    },
    async refreshCardList() {
      try {
        await this.$store.dispatch("card/fetchList", this.$route.params);
        this.$bvToast.toast("Успешно  обновлено", {
          title: "",
          variant: "success",
          solid: true,
        });
      } catch (err) {
        this.$bvToast.toast(err.response.data.MESSAGE, {
          title: "Ошибка",
          variant: "danger",
          noAutoHide: true,
          solid: true,
        });
      }
    },
  },
  computed: {
    listData: {
      get: function () {
        return this.$store.getters["card/list"];
      },
    },
    isList: {
      get: function () {
        return this.$store.getters["card/isList"];
      },
    },
    isListLoading: {
      get: function () {
        return this.$store.getters["card/isListLoading"];
      },
    },
    isAddNewRecord: {
      get: function () {
        return this.params.settings.add;
      },
    },
    wizardRel() {
      return this.$store.getters["wizard/getWizard"]?.REL.split("|")[0];
    },
  },
};
</script>
