<template>
  <div>
    <div class="animated fadeIn">
      <button
        v-if="isAddNewRecord"
        type="submit"
        class="btn btn-primary mb-2"
        @click="addNewRecord"
      >
        Добавить новую запись
      </button>
      <button
        v-if="isList"
        type="submit"
        class="mb-2 btn btn-primary"
        @click="refreshCardList"
      >
        Обновить
      </button>
      <card-list
        v-if="isList"
        :load="isListLoading"
        :data="listData"
        @action-clicked="openCardForm"
        @delete-item="deleteRecord"
      />
    </div>
  </div>
</template>

<script>
import CardList from "./CardList";

export default {
  name: "Card",
  components: { CardList },
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      myclass: ["cabinet"],
    };
  },
  computed: {
    listData: {
      get() {
        return this.$store.getters["card/list"];
      },
    },
    isList: {
      get() {
        return this.$store.getters["card/isList"];
      },
    },
    isListLoading: {
      get() {
        return this.$store.getters["card/isListLoading"];
      },
    },
    isAddNewRecord: {
      get() {
        return this.params.settings.add;
      },
    },
    wizardRel() {
      return this.$store.getters["wizard/getWizard"]?.REL.split("|")[0];
    },
  },
  async created() {
    await this.$store.dispatch("card/fetchList", {
      ...this.$route.params,
      query: { ...this.$route.query },
    });
  },
  methods: {
    async openCardForm(data) {
      if (!this.params.settings.wizard.length) {
        if (data.data.item.REL && this.params.page.idWizard) {
          this.$router.push({
            path: `/cabinet/${this.params.page.idModule}/0/${this.params.page.idItem}/${data.data.item.ID}/${data.data.item.REL}`,
            query: { ref: this.$route.path },
          });
        } else if (data.data.item.REL) {
          this.$router.push(
            `/cabinet/${this.params.page.idModule}/0/${this.params.page.idItem}/${data.data.item.ID}/${data.data.item.REL}`
          );
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
      } else if (this.params.page.idWizard) {
        this.$router.push({
          path: `/cabinet/${this.params.page.idModule}/0/${this.params.page.idItem}/${this.params.page.idCard}/0/0`,
          query: { ref: this.$route.path },
        });
      } else {
        this.$router.push(`/cabinet/${this.params.page.idModule}/0/${this.params.page.idItem}/0`);
      }
    },
    async deleteRecord(data) {
      const params = {
        moduleId: this.$route.params.idModule,
        menuId: this.$route.params.idItem,
        itemId: data.data.item.ID,
        relId: data.data.item.REL,
      };
      try {
        this.$bvModal
          .msgBoxConfirm("Вы действительно хотите удалить запись?", {
            title: "Удаление записи",
            size: "sm",
            buttonSize: "sm",
            okVariant: "primary",
            okTitle: "Удалить",
            cancelTitle: "Отмена",
            footerClass: "p-2",
            modalClass: this.myclass,
            hideHeaderClose: false,
            centered: true,
          })
          .then(async (value) => {
            if (value) {
              await this.$store.dispatch("card/deleteRecord", params);
              await this.$store.dispatch("card/fetchList", this.$route.params);
              this.$bvToast.toast("Успешно  удалено", {
                title: "",
                variant: "success",
                solid: true,
              });
            }
          })
          .catch((err) => {});
      } catch (err) {}
    },
    async refreshCardList() {
      try {
        await this.$store.dispatch("card/fetchList", {
          ...this.$route.params,
          query: { ...this.$route.query },
        });
        this.$bvToast.toast("Успешно обновлено", {
          title: "",
          variant: "success",
          solid: true,
        });
      } catch (err) {
        this.$modal.alert({
          title: "Извините, произошла ошибка",
          msg: err.response.data.MESSAGE,
          icon: "error",
          btnOk: false,
        });
      }
    },
  },
};
</script>
