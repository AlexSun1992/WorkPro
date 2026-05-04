<template>
  <div class="control-modal-card">
    <button
      :disabled="disabled"
      class="btn btn-secondary"
      @click="open"
    >
      {{ buttonText }}
    </button>
    <b-modal
      v-model="visible"
      :id="modalId + '-inner'"
      size="xl"
      centered
      title="Карточка"
      ok-title="Сохранить"
      cancel-title="Закрыть"
      @hidden="onHidden"
      lazy
      no-fade
      no-close-on-backdrop
    >
      <div>
        <FormBlockModal
          :form-id="formId"
          :params="params"
          :edit="true"
          @update="updateValue"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import { closeForm } from "@/store/forms.service.js";
import FormBlockModal from "~/components/Libs/Form/FormBlockModal";

export default {
  name: "ControlModalCard",
  components: { FormBlockModal },
  props: {
    data: { type: Array, required: true },
    params: { type: Object, required: true },
    buttonText: { type: String, default: "Открыть" },
    modalTitle: { type: String, default: "Карточка" },
    disabled: { type: Boolean, default: false },
    initialValues: { type: Object, default: () => ({}) },
    selectMode: { type: Boolean, default: false },
    zone: { type: String, default: "" },
  },
  data() {
    return {
      visible: false,
      loading: false,
      formId: null,
      innerVisible: false,
      innerLoading: false,
      childFormId: null,
      modalId: `modal-card-${Math.random().toString(36).slice(2)}`,
      childParams: {},
    };
  },
  methods: {
    async open() {
      const result = await this.$cardModal.open({ ...this.$route.params });
      console.log("result", result);
      // try {
      //   this.formId = await openForm(this.$store, { parentId: null });
      //   this.visible = true;
      //   await this.$store.dispatch(`data_card/forms/${this.formId}/fetchForm`, {
      //     ...this.$route.params,
      //     query: { ...this.$route },
      //   });
      // } catch (e) {
      // } finally {
      //   this.loading = false;
      // }
    },
    onHidden() {
      if (this.formId) {
        closeForm(this.$store, this.formId);
        this.formId = null;
      }
    },
    async updateValue(e) {
      console.log("update", e);
      await this.$store.dispatch(`data_card/forms/${this.formId}/setActionFormField`, {
        fieldId: e.fieldId,
        name: e.name,
        value: e.value,
        action: e.action,
        zone: this.zone,
      });
      console.log("result", result);
    },
  },
};
</script>

<style scoped>
.control-modal-card {
}
</style>
