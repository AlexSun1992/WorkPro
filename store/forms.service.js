import { createFormModule } from "@/store/data_card";

function ns(formId) {
  return `data_card/forms/${formId}/`;
}

function genId() {
  return `f_${Math.random().toString(36).slice(2)}`;
}
function ensureFormsContainer(store) {
  if (!store._modulesNamespaceMap["data_card/"]) {
    throw new Error(
      '[forms.service] Vuex module "data_card" не найден. Убедитесь, что файл store/data_card.js существует и экспортируется по умолчанию.'
    );
  }
  if (!store._modulesNamespaceMap["data_card/forms/"]) {
    store.registerModule(["data_card", "forms"], {
      namespaced: true,
      state: () => ({}),
      mutations: {},
      actions: {},
      getters: {},
    });
  }
}

export async function openForm(store, { parentId = null } = {}) {
  try {
    ensureFormsContainer(store);
    const formId = genId();
    store.registerModule(["data_card", "forms", formId], createFormModule({ parentId }));
    return formId;
  } catch (e) {
    console.log("error", e);
  }
}
export async function seedForm(store, formId, { items = [], values = {} } = {}) {
  const ns = `data_card/forms/${formId}`;
  if (items?.length) {
    await store.dispatch(`${ns}/setFormItems`, items).catch(() => {});
  }
  if (values && Object.keys(values).length) {
    await store.dispatch(`${ns}/setValues`, { values }).catch(() => {});
  }
}

export async function loadForm(store, formId, { idModule, idItem, idCard, idRel = 0, cache = false, zone = "free" }) {
  const ns = `data_card/forms/${formId}`;
  await store.dispatch(`${ns}/fetchForm`, { idModule, idItem, idCard: String(idCard ?? 0), idRel, cache, zone });
}

export function closeForm(store, formId) {
  if (store._modulesNamespaceMap[ns(formId)]) {
    store.unregisterModule(["data_card", "forms", formId]);
  }
}
