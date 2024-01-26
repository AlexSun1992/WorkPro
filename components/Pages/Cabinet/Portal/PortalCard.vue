<template>
  <div>
    <button type="button" class="btn btn-secondary" @click="saveFile()">
      Тест
    </button>
    <v-runtime-template
      v-if="templateData"
      :template="templateData"
    ></v-runtime-template>
    <b-card v-else class="p-4 bg-six block border-block-one">
      <button
        v-on:click="destroyForm"
        type="submit"
        class="btn btn-success"
        pill
        v-b-popover.hover.top="'Назад'"
      >
        <i class="fa fa-chevron-left"></i>
      </button>
      <Form :data="editDataForm" :edit="isEdit"></Form>
      <p class="mb-10 mt-3"></p>
      <button
        v-if="isEdit"
        v-on:click="saveForm"
        pill
        type="button"
        class="btn btn-success"
      >
        Сохранить
      </button>
      <button
        v-if="isEdit"
        pill
        type="button"
        class="btn btn-outline-success"
        @click="cancelForm()"
      >
        Отменить
      </button>
    </b-card>
  </div>
</template>
<script>
import Form from "~/components/Libs/Form/Form";
import VRuntimeTemplate from "v-runtime-template";
import { saveAs } from "file-saver";
export default {
  name: "WizardList",
  components: { Form, VRuntimeTemplate },
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {},
    },
    templateData: {
      type: String,
      required: false,
      default: () => null,
    },
    formData: {
      type: Array,
      required: true,
      default: () => [],
    },
    moduleId: {
      type: String,
      required: false,
      default: () => null,
    },
    itemId: {
      type: String,
      required: false,
      default: () => null,
    },
    isEdit: {
      type: Boolean,
      default: () => false,
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
    saveFile() {
      saveAs("https://httpbin.org/image", "image.jpg");
    },
  },
};
</script>

<style>
.form-row {
  align-items: baseline;
}
</style>
