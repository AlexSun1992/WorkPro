<template>
  <div>
    <FormBlock
      :data="items"
      :tabs="[]"
      :params="settings"
      :edit="edit"
      :form-id="formId"
      @update="onUpdate"
      @clear="onClear"
      @open-card="onOpenCard"
      :current-tab="currentTab"
      :tabsWizard="tabsWizard"
      :qty="qty"
      :loading="loading"
      @goNext="onGoNext"
    />
    <div
      v-show="getErrorMessage"
      class="mt-3 mb-0 alert alert-danger"
      v-html="getErrorMessage"
    />
  </div>
</template>

<script>
import { defineComponent, computed, useContext } from "@nuxtjs/composition-api";
import FormBlock from "~/components/Libs/Form/FormBlock";

export default defineComponent({
  name: "FormBlockModal",
  components: { FormBlock },

  props: {
    formId: {
      type: String,
      required: true,
    },
    itemId: {
      type: Number,
      required: true,
    },
    edit: {
      type: Boolean,
      default: true,
    },
    params: {
      type: Object,
      default: null,
    },
    currentTab: {
      type: Object,
      default: null,
    },
    tabs: {
      type: Array,
      default: () => [],
    },
    qty: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: null,
    },
    wizardTabs: {
      type: Array,
      default: () => [],
    },
  },

  setup(props, { emit }) {
    const { store } = useContext();

    const items = computed(() => store.getters[`data_card/forms/${props.formId}/getForm`] || []);

    const settings = computed(() => ({
      ...store.getters[`menu/getSettingsByIdItem`](props.itemId || {}),
      ...props.params,
    }));

    const getErrorMessage = computed(() => store.getters[`data_card/forms/${props.formId}/getErrorMessage`]);

    // Проксируем события наверх
    const onUpdate = (e) => emit("update", e);
    const onClear = (e) => emit("clear", e);
    const onOpenCard = (e) => emit("open-card", e);
    const onGoNext = (e) => emit("goNext", e);

    return {
      items,
      settings,
      getErrorMessage,
      onUpdate,
      onClear,
      onOpenCard,
      onGoNext,
    };
  },
});
</script>
