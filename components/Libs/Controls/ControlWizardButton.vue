<template>
  <button
    :id="elementId"
    type="button"
    :disabled="isLoading"
    :class="classStyle"
    @click="action"
  >
    {{ buttonName }}
  </button>
</template>

<script>
import { computed, getCurrentInstance } from "vue";
import menuSettings from "@/converters/menuSettings";

export default {
  name: "ControlWizardButton",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["goBack", "saveCard", "goNext"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const store = instance.proxy.$store;
    const route = computed(() => instance.proxy.$route);

    // Признак, что контрол отрисован внутри формы модалки (CardModal),
    const isFormContext = computed(
      () => typeof props.params?.ns === "string" && props.params.ns.startsWith("data_card/forms/")
    );
    const nameSpace = computed(() => (isFormContext.value ? props.params.ns : "data_card"));
    const context = computed(() => {
      if (isFormContext.value) {
        return {
          idWizard: props.params.idWizard,
          idItem: props.params.idItem,
          idCard: props.params.idCard,
          idRel: props.params.idRel,
        };
      }
      const params = route.value?.params || {};

      return {
        idWizard: params.idWizard,
        idItem: params.idItem,
        idCard: params.idCard,
        idRel: params.idRel,
      };
    });

    const elementId = computed(() => props.data.webId || props.data.fieldId);
    const buttonName = computed(() => {
      if (props.data.name === "Continue") {
        return props.data.label ?? "Продолжить";
      }
      if (props.data.name === "Back") {
        return props.data.label ?? "Назад";
      }
      if (props.data.name === "Save") {
        return props.data.label ?? "Сохранить";
      }

      return props.data.label ?? "";
    });
    const classStyle = computed(() => {
      if (props.data.name === "Back") {
        return "btn btn-secondary";
      }
      if (props.data.name === "Continue") {
        return "btn btn-success";
      }
      if (props.data.name === "Save") {
        return `btn btn-success ${props.data.cssClass ?? ""}`;
      }

      return "";
    });
    const isLoading = computed(() => store.getters[`${nameSpace.value}/getLoading`]);
    const settings = computed(() =>
      menuSettings
        .getData(store.getters["menu/menu"], {
          idModule: 55,
          idParent: 0,
          idItem: context.value.idWizard ?? null,
        })
        .slice(-1)
        .pop()
    );
    const pages = computed(() => store.getters["wizard/getWizardPages"]);
    const tabs = computed(() => {
      const wizard = settings.value?.wizard;
      const arr = [];

      if (pages.value && wizard) {
        const p_arr = pages.value?.split(";");

        for (let i = 0; i < wizard.length; i++) {
          const p_item = p_arr.find((v) => parseInt(v) === wizard[i].idItem);

          if (p_item) {
            arr.push(wizard[i]);
          }
        }
      }

      return arr;
    });
    const currentTab = computed(() => tabs.value.find((item) => item.idItem == context.value.idItem));

    const getCurrentIndex = () => tabs.value.findIndex((item) => item.idItem == currentTab.value.idItem);

    const goBack = () => {
      if (route.value) {
        store.commit(`${nameSpace.value}/setLoading`, true);
        store.commit("wizard/setWizardIsErrorActionExecute", false);

        const tab = tabs.value[getCurrentIndex() - 1];

        emit("goBack", tab);
      } else {
        emit("goBack", "Back");
      }
    };
    const saveCard = () => {
      if (route.value) {
        store.commit(`${nameSpace.value}/setLoading`, true);
        store.dispatch("wizard/isWizardButtonsLoading", true);
      }

      emit("saveCard", "Save");
    };
    const goNext = async () => {
      if (route.value) {
        store.commit(`${nameSpace.value}/setLoading`, true);
        store.dispatch("wizard/isWizardButtonsLoading", true);
        store.commit("wizard/setWizardIsErrorActionExecute", false);

        const menu = store.getters["menu/flatmenu"].find((item) => item.IDITEM == currentTab.value.idItem);
        const action = menu.ACTIONSCUR.find((item) => item.NTYPE == 35);

        if (action) {
          const response = await store.dispatch(`${nameSpace.value}/executeAction`, {
            actionId: action.ID,
            relActionId: action.REL,
            relId: context.value.idRel,
            rowId: context.value.idCard,
          });
          if (response.status !== 200) {
            store.commit("wizard/setWizardIsErrorActionExecute", true);
            store.commit("wizard/setWizardErrorActionExecuteMessage", response.data);
            store.dispatch("wizard/isWizardButtonsLoading", false);

            return;
          }
        }

        const tab = tabs.value[getCurrentIndex() + 1];

        emit("goNext", tab);
      } else {
        emit("goNext", "Next");
      }
    };
    const action = () => {
      // При возникновении ошибки валидации для components-vue2 CardEditor если фронт не пропускает далее
      // на запрос форму появляется лоудер и не пропадает. Перенёс признак установку статуса загрузки в методы
      // this.$store.commit("data_card/setLoading", true);
      if (props.data.name === "Continue") {
        goNext();
      }
      if (props.data.name === "Back") {
        goBack();
      }
      if (props.data.name === "Save") {
        saveCard();
      }
    };

    return { classStyle, elementId, buttonName, isLoading, action };
  },
};
</script>
