<template>
  <div>
    <button
      type="button"
      class="btn btn-secondary"
      @click="saveFile"
    >
      Тест
    </button>
    <v-runtime-template
      v-if="templateData"
      :template="templateData"
    ></v-runtime-template>
    <div
      v-else
      class="p-4 bg-six block border-block-one"
    >
      <button
        v-b-popover.hover.top="'Назад'"
        type="submit"
        class="btn btn-success"
        @click="destroyForm"
      >
        <i class="fa fa-chevron-left"></i>
      </button>
      <Form
        :data="editDataForm"
        :edit="isEdit"
      ></Form>
      <p class="mb-10 mt-3"></p>
      <button
        v-if="isEdit"
        type="button"
        class="btn btn-success"
        @click="saveForm"
      >
        Сохранить
      </button>
      <button
        v-if="isEdit"
        type="button"
        class="btn btn-outline-success"
        @click="cancelForm"
      >
        Отменить
      </button>
    </div>
  </div>
</template>

<script>
import VRuntimeTemplate from "@/components/Libs/RuntimeTemplate/RuntimeTemplate";
import Form from "~/components/Libs/Form/Form";

export default {
  name: "PortalCard",
  components: { Form, VRuntimeTemplate },
  props: {
    params: {
      type: Object,
      default: () => {},
    },
    templateData: {
      type: String,
      default: null,
    },
    formData: {
      type: Array,
      default: () => [],
    },
    moduleId: {
      type: String,
      default: null,
    },
    itemId: {
      type: String,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: null,
      card: null,
      editDataForm: this.formData,
    };
  },
  methods: {
    destroyForm() {
      this.$store.dispatch("blocks/destroyForm");
    },
    isFieldExists(name, data = undefined) {
      return Boolean(this.getField(name, data));
    },
    getField(name, data = this.editDataForm) {
      return data.find((item) => item.name === name);
    },
    getFieldValue(name, data = undefined) {
      return this.getField(name, data).value;
    },
  },
};
</script>
