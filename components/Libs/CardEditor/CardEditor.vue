<template>
  <div>
    <b-button
      v-on:click="$router.go(-1)"
      type="submit"
      variant="success"
      class="btn-back"
      >Назад</b-button
    >
    <Form
      v-if="data.length"
      :currentField="currentField"
      :data="data"
      @update="updateValue($event)"
      @clear="clearRelation($event)"
      @open-card="openCard($event)"
      :edit="edit"
      class="mt-4"
    ></Form>
    <SkeletonBox v-else class="mt-5"></SkeletonBox>
    <div class="mt-3 row button-container">
      <div class="col-12" v-if="edit">
        <b-button
          pill
          v-on:click="saveDataCard"
          type="button"
          variant="success"
          class="col-12 col-md-auto mr-4"
          >Сохранить</b-button
        >
        <b-button
          pill
          v-on:click="cancelDataCard"
          type="button"
          variant="outline-success"
          class="col-12 col-md-auto mt-2 mt-md-0"
          >Отменить</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Form from "~/components/Libs/Form/Form";
import ActionButton from "~/components/Pages/Cabinet/Block/ActionButton";
import SkeletonBox from "~/components/Libs/SkeletonBox";
export default {
  name: "CardEditor",
  components: { Form, ActionButton, SkeletonBox },
  data() {
    return {
      invalidFields: [],
      body: null,
      currentField: null
    };
  },
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {}
    },
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    edit: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  methods: {
    updateValue(e) {
      this.currentField = { fieldId: e.fieldId, value: e.value };
      this.$store.commit("data_card/setFormField", {
        fieldId: e.fieldId,
        value: e.value
      });
    },
    clearRelation(e) {
      this.$store.commit("data_card/clearFormRelationField", {
        fieldName: e.fieldName
      });
    },
    openCard(e) {
      let flatmenu = this.$store.getters["menu/flatmenu"];
      let menuItem = flatmenu.find(item => {
        return item.SNAME == e.label;
      });
      $nuxt._router.push(
        `/cabinet/${this.params.page.idModule}/0/${menuItem.IDITEM}/0`
      );
    },
    validateData(data) {
      this.invalidFields.length = 0;
      let valid = true;
      for (let i = 0; i < data.length; i++) {
        let value =
          data[i].type === "enum" ? data[i].value.value : data[i].value;
        data[i].checked = true;
        if (data[i].required && !value && data[i].type !== "boolean") {
          data[i].state = false;
          valid = false;
          this.invalidFields.push(data[i]);
        }
      }
      return valid;
    },
    async saveDataCard() {
      let fields = JSON.parse(
        JSON.stringify(this.$store.getters["data_card/getForm"])
      );
      fields = fields.filter(item => !item.name.match(/^ID/));
      if (this.validateData(fields)) {
        try {
          let itemId;
          let moduleId;
          let cardId;
          if (!this.params.page) {
            itemId = this.$route.params.idItem;
            moduleId = this.$route.params.idModule;
            cardId = this.$route.params.idCard;
          } else {
            itemId = this.params.page.idItem;
            moduleId = this.params.page.idModule;
            cardId = this.$store.getters["data_card/getCardId"];
          }
          await this.$store.dispatch("data_card/saveDataCard", {
            moduleId,
            itemId,
            cardId,
            form: fields
          });
          if (this.$route.params.idItem == "710") {
            await this.$store.dispatch("updateUser");
          }
          this.$bvToast.toast("Успешно сохранено", {
            title: ``,
            variant: "success",
            solid: true
          });
        } catch (err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: `Ошибка`,
            variant: "danger",
            noAutoHide: true,
            solid: true
          });
        }
      }
    },
    cancelDataCard() {
      this.$store.commit(
        "data_card/setForm",
        JSON.parse(JSON.stringify(this.$store.getters["data_card/getCopyForm"]))
      );
    }
  }
};
</script>

<style scoped>
.modal-content {
  min-height: 500px;
}
.action-button {
  position: absolute;
  right: 220px;
  bottom: 65px;
}
</style>
