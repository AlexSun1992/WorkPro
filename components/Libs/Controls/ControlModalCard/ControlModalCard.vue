<template>
  <div class="control-modal-card">
    <button
      :disabled="disabled"
      class="btn btn-secondary"
      @click="open"
    >
      {{ buttonText }}
    </button>
    <ControlModal
      :is-open="visible"
      :data="{ label: modalTitle, value: '' }"
      :close-on-out-side-click="false"
      :close-on-esc="true"
      :show-close="true"
      :show-ok="true"
      :show-cancel="true"
      :has-header="true"
      :has-footer="true"
      props-class="control-select-object-from-map"
      @close="onHidden"
      @cancel="onHidden"
      @ok="onOk"
    >
      <template #default>
        <div v-if="visible">
          <FormBlockModal
            :form-id="formId"
            :params="params"
            :edit="true"
            @update="updateValue"
          />
        </div>
      </template>
      <template #footer>
        <button
          class="btn-secondary"
          type="button"
          @click="onHidden"
        >
          Закрыть
        </button>
        <button
          class="btn-primary"
          type="button"
          @click="onOk"
        >
          Сохранить
        </button>
      </template>
    </ControlModal>
  </div>
</template>
show

<script>
// eslint-disable-next-line import/extensions
import { closeForm } from "@/store/forms.service.js";
import FormBlockModal from "~/components/Libs/Form/FormBlockModal";
import ControlModal from "@/components/Libs/CardModal/CardModal";

export default {
  name: "ControlModalCard",
  components: { FormBlockModal, ControlModal },
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
      await this.$cardModal.open({ ...this.$route.params });
      this.visible = true;
    },
    onHidden() {
      this.visible = false;
      if (this.formId) {
        closeForm(this.$store, this.formId);
        this.formId = null;
      }
      this.$emit("hidden");
    },

    async onOk() {
      this.onHidden();
      this.$emit("saved");
    },

    async updateValue(e) {
      await this.$store.dispatch(`data_card/forms/${this.formId}/setActionFormField`, {
        fieldId: e.fieldId,
        name: e.name,
        value: e.value,
        action: e.action,
        zone: this.zone,
      });
    },
  },
};
</script>

<style scoped>
.control-modal-card {
}
</style>
