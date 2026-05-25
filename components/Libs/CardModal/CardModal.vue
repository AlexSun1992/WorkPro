<template>
  <VModal
    v-model="visibleProxy"
    :title="title"
    :size="size"
    :ok-title="okTitle"
    :cancel-title="cancelTitle"
    :ok-variant="okVariant"
    :cancel-variant="cancelVariant"
    :button-size="buttonSize"
    :footer-class="footerClass"
    :modal-class="modalClass"
    :centered="centered"
    :close-on-esc="!innerPersistent"
    :close-on-backdrop="!innerPersistent"
    :persistent="innerPersistent"
    @ok="onOk"
    @cancel="$emit('cancel')"
    @hidden="onHidden"
    @shown="$emit('shown')"
  >
    <div
      v-if="loading"
      class="p-4 text-center"
    >
      <span class="spinner-border spinner-border-sm" /> Загрузка карточки…
    </div>

    <FormBlockModal
      v-else-if="formId"
      :form-id="formId"
      :item-id="itemId"
      :params="settings"
      :edit="!readonly"
      @update="updateValue"
      @clear="$emit('clear', $event)"
      @open-card="openNestedCard"
    />

    <div
      v-else
      class="p-4 text-danger"
    >
      Не удалось подготовить форму
    </div>
  </VModal>
</template>

<script>
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useContext } from "@nuxtjs/composition-api";
import VModal from "@/components/Libs/VModal/VModal";
import FormBlockModal from "@/components/Libs/Form/FormBlockModal";
import * as dataCardMod from "@/store/data_card";

export default {
  name: "CardModal",
  components: { VModal, FormBlockModal },
  // TODO: Vue3 migration — удалить prop "value" и event "input" после полного перехода на Vue 3 (оставлено для обратной совместимости c v-model Vue 2)
  props: {
    value: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    title: { type: String, default: "" },
    size: { type: String, default: "xl" },
    okTitle: { type: String, default: "Сохранить" },
    cancelTitle: { type: String, default: "Отмена" },
    okVariant: { type: String, default: "primary" },
    cancelVariant: { type: String, default: "secondary" },
    buttonSize: { type: String, default: "md" },
    footerClass: { type: [String, Array, Object], default: () => [] },
    modalClass: { type: [String, Array, Object], default: () => [] },
    centered: { type: Boolean, default: true },
    persistent: { type: Boolean, default: false },

    moduleId: { type: [Number, String], required: true },
    itemId: { type: [Number, String], required: true },
    wizardId: { type: [Number, String], default: 0 },
    relId: { type: [Number, String], default: 0 },
    listId: { type: [Number, String], default: 0 },
    cardId: { type: [Number, String], default: 0 },

    params: { type: Object, default: () => ({}) },
    initialValues: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: false },

    autoValidate: { type: Boolean, default: true },
    preventCloseOnInvalid: { type: Boolean, default: true },
  },
  // TODO: Vue3 migration — удалить event "input" после перехода на Vue 3 (оставлен для обратной совместимости c v-model Vue 2)
  emits: ["input", "update:modelValue", "shown", "hidden", "update", "clear", "cancel", "ok", "error", "loaded"],
  setup(props, { emit }) {
    const inst = getCurrentInstance();
    const { store } = useContext();
    const initialVisible = props.modelValue !== undefined ? props.modelValue : props.value;
    const visibleProxy = ref(initialVisible);
    const loading = ref(false);
    const formId = ref(null);

    const handlerFn = ref(null);
    const makeHandlerLoader = () => () => import(`@/components/EventHandler/${props.itemId}/eventHandler`);

    const loadScript = async (id) => {
      const loader = makeHandlerLoader(id);
      let mod;

      try {
        mod = await loader();
      } catch (e) {
        console.warn(`CardModal loadScript. ${e}`);
        return;
      }

      const fn = mod.eventHandler || (mod.default && mod.default.eventHandler);
      if (typeof fn !== "function") {
        throw new Error(`В модуле ${id}/eventHandler нет export function eventHandler(...)`);
      }
      return fn;
    };

    const runHandler = async (data, item, cb) => {
      if (handlerFn.value) {
        return await handlerFn.value(data, item, cb);
      }

      return structuredClone(data);
    };

    const init = async () => {
      handlerFn.value = await loadScript(props.itemId);
      await runHandler([], {});
      inst.proxy?.$root.$on("card-modal:close", onCloseByNs);
    };

    const onCloseByNs = (eventNs) => {
      if (formNs.value && eventNs === formNs.value) {
        visibleProxy.value = false;
      }
    };

    onMounted(() => {
      init();
    });

    onBeforeUnmount(() => {
      inst.proxy?.$root.$off("card-modal:close", onCloseByNs);
    });

    watch(() => props.itemId, init);

    watch(
      () => props.value,
      (v) => {
        if (props.modelValue === undefined) {
          visibleProxy.value = v;
        }
      }
    );

    watch(
      () => props.modelValue,
      (v) => {
        if (v !== undefined) {
          visibleProxy.value = v;
        }
      }
    );

    watch(
      visibleProxy,
      async (v) => {
        // TODO: Vue3 migration — удалить emit "input" после перехода на Vue 3
        emit("input", v);
        emit("update:modelValue", v);

        if (!v) return;
        try {
          await ensureRegistered();
          await fetchCard();
          emit("loaded", { formId: formId.value });
        } catch (e) {
          emit("error", e);
        }
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      unregister();
    });

    // namespace для конкретной формы
    function ns() {
      return `data_card/forms/${formId.value}`;
    }

    const formNs = computed(() => (formId.value ? `data_card/forms/${formId.value}` : ""));

    const settings = computed(() => ({
      idModule: Number(props.moduleId),
      idWizard: Number(props.wizardId || 0),
      idItem: Number(props.itemId),
      idCard: String(props.cardId || 0),
      idList: String(props.listId || 0),
      idRel: String(props.relId || 0),
      cache: false,
    }));

    // есть ли уже конкретный модуль формы
    function hasNs() {
      return Boolean(store._modulesNamespaceMap[`${ns()}/`]);
    }

    // есть ли контейнер 'data_card/forms/'
    function hasFormsContainer() {
      return Boolean(store._modulesNamespaceMap["data_card/forms/"]);
    }

    async function ensureRegistered() {
      // 1) Проверяем, что родительский модуль data_card существует
      if (!store._modulesNamespaceMap["data_card/"]) {
        throw new Error("Родительский модуль 'data_card' не зарегистрирован. Проверьте store/data_card.js");
      }

      // 2) Регистрируем контейнер forms, если его нет
      if (!hasFormsContainer()) {
        store.registerModule(["data_card", "forms"], {
          namespaced: true,
          // контейнер без state/mutations — только для вложенных модулей
        });
      }

      // 3) Регистрируем конкретную форму
      if (!formId.value || !hasNs()) {
        formId.value = formId.value || `f_${props.itemId}`;
        if (typeof dataCardMod.createFormModule !== "function") {
          throw new Error("Отсутствует createFormModule() в store/data_card");
        }
        store.registerModule(["data_card", "forms", formId.value], dataCardMod.createFormModule({ parentId: null }));
      }
    }

    function unregister() {
      if (formId.value && hasNs()) {
        store.unregisterModule(["data_card", "forms", formId.value]);
      }
      formId.value = null;
    }

    const innerPersistent = ref(props.persistent);

    async function fetchCard() {
      loading.value = true;
      try {
        await store.dispatch(`${ns()}/fetchForm`, settings.value);
        if (props.initialValues && Object.keys(props.initialValues).length) {
          await store.dispatch(`${ns()}/setValues`, { values: props.initialValues }).catch(() => {});
        }
      } finally {
        loading.value = false;
        const addFields = store.getters[`${ns()}/getAddFields`];
        innerPersistent.value = addFields?.BACKDROP === "Y" ? true : innerPersistent.value;
      }
    }

    async function updateValue(e) {
      await store.dispatch(`${ns()}/setActionFormField`, {
        fieldId: e.fieldId,
        name: e.name,
        value: e.value,
        action: e.action,
        zone: "token",
      });

      store.commit(
        `${ns()}/setForm`,
        await runHandler(
          store.getters[`${ns()}/getForm`].map((a) => ({ ...a })),
          e
        )
      );
    }

    async function onOk() {
      const { valid } = await store.dispatch(`${ns()}/validate`);
      const values = store.getters[`${ns()}/getForm`];

      if (!valid) {
        return; // модалка остаётся открытой
      }

      let saveRes = null;
      if (valid) {
        try {
          // saveRes = await store.dispatch(`${ns()}/saveForm`);
          saveRes = await store.dispatch(`${ns()}/saveDataCard`, {
            ...props,
            zone: "token",
          });
          if (saveRes.status !== 200) {
            return;
          }
        } catch (err) {
          emit("error", err);
          return; // оставляем открытой при ошибке сохранения
        }
      }

      visibleProxy.value = false;

      emit("ok", {
        valid: true,
        values,
        save: saveRes,
        formId: formId.value,
        moduleId: props.moduleId,
        menuId: props.itemId,
        cardId: props.cardId,
      });
    }

    async function onHidden() {
      unregister();
      emit("hidden");
    }

    function openNestedCard(e) {
      emit("update", e);
      inst.proxy.$emit("open-card", e);
    }

    return {
      visibleProxy,
      loading,
      formId,
      formNs,
      settings,
      runHandler,
      makeHandlerLoader,
      onOk,
      onHidden,
      openNestedCard,
      updateValue,
      innerPersistent,
    };
  },
};
</script>
