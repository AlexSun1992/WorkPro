<template>
  <div>
    <div class="animated fadeIn">
      <b-button
        class="mb-2"
        v-if="isList"
        v-on:click="refreshCardList"
        type="submit"
        variant="primary"
        v-b-popover.hover.top="'Обновить список'"
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
import CardForm from "./CardForm";
import CardFilter from "./CardFilter";

export default {
  name: "Card",
  components: { CardList, CardForm, CardFilter },
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  methods: {
    openCardForm(data) {
      console.log(data);
      $nuxt._router.push(
        `/cabinet/${this.params.page.idModule}/0/${this.params.page.idItem}/${data.data.item.ID}/${data.data.item.REL}`
      );
    },
    async refreshCardList() {
      try {
        await this.$store.dispatch("card/fetchList");
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
  },
};
</script>
