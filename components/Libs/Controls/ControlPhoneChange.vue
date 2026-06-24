<template>
  <div>
    <div class="change-number">
      <div class="row">
        <form-group
          :label="data.label"
          :class="[{ required: data.required }]"
          class="col-12 col-lg-4"
          :label-for="data.name"
        >
          <b-form-input
            :id="data.name"
            ref="userInput"
            v-model="newPhone"
            v-mask="changeMask"
            :placeholder="placeholder"
            :state="validateState('newPhone')"
            autocomplete="off"
            autofocus
            :disabled="isShowCodeEnter"
            type="tel"
            @blur="update"
          />
          <div
            v-if="validateState('newPhone') === false"
            class="invalid-feedback"
          >
            Пожалуйста, заполните это поле
          </div>
        </form-group>
        <div class="col-auto">
          <button
            type="submit"
            class="btn btn-success mt-btn-form-3"
            :disabled="v$.newPhone.$invalid || loading || isSendCode"
            @click="verifyUser"
          >
            Получить смс-код
          </button>
        </div>
        <div
          v-if="isShowCodeEnter"
          class="col-auto"
        >
          <label class="d-none d-md-block">&nbsp;</label>
          <a
            href="#"
            class="link-button l-b-m-t d-block"
            @click="changeNumber"
          >
            Изменить номер
          </a>
        </div>
      </div>
    </div>
    <div
      v-if="isShowCodeEnter"
      class="resend-block"
    >
      <p>
        <template v-if="disabledResend">
          На указанный номер мы направили смс-код, просим ввести его в поле ниже.<br />
          Повторный код можно запросить через
          <verify-timer
            :duration="duration"
            @onFinish="stopTimer"
          />
          сек.
        </template>
      </p>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, onBeforeMount, onBeforeUnmount, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

const PLACEHOLDER = "+7(___)-___-__-__";
const MASK = "+7(###)-###-##-##";
const DURATION = 60;

export default {
  name: "ControlPhoneChange",
  components: { VerifyTimer, FormGroup },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const store = instance.proxy.$store;
    const route = computed(() => instance.proxy.$route);

    const userInput = ref(null);
    const newPhone = ref("");
    const isSendCode = ref(false);
    const disabledResend = ref(true);
    const loading = ref(false);

    const rules = {
      newPhone: { required, minLength: minLength(17) },
    };
    const v$ = useVuelidate(rules, { newPhone });

    const isShowCodeEnter = computed(() => !v$.value.newPhone.$invalid && isSendCode.value);

    const validateState = (name) => {
      const { $dirty, $error } = v$.value[name];

      return $dirty ? !$error : null;
    };
    const update = () => {
      if (newPhone.value !== "") {
        emit("update", {
          fieldId: props.data.fieldId,
          name: props.data.name,
          value: newPhone.value,
        });
      }
    };
    const getCode = async () => {
      store.commit("data_card/clearFormField", { fieldId: 26713 });

      if (!newPhone.value) return;

      const actionParams = { name: "SNEWPHONE", value: newPhone.value };

      try {
        loading.value = true;
        disabledResend.value = true;
        const response = await store.dispatch("data_card/executeAction", {
          actionId: props.params.actions[0].id,
          relActionId: props.params.actions[0].relaction,
          relId: route.value.params.idRel,
          rowId: route.value.params.idCard,
          body: [actionParams],
        });

        if (response?.status === 500) {
          loading.value = false;
          store.commit("data_card/setSavedError", true);
          store.commit("data_card/setErrorMessage", response.data);
          store.commit("data_card/clearFormField", { fieldId: 26713 });
        }
        if (response?.status === 200) {
          loading.value = false;
          store.commit("data_card/setSavedError", false);
          store.commit("data_card/setErrorMessage", null);
          isSendCode.value = true;
          instance.proxy.$bvToast.toast("Успешно выполнено", {
            title: "",
            variant: "success",
            solid: true,
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
    const verifyUser = () => {
      store.commit("clearAxiosError");
      getCode();
    };
    const changeNumber = () => {
      v$.value.newPhone.$model = "";
      userInput.value.$el.disabled = false;
      userInput.value.$el.focus();
      isSendCode.value = false;
    };
    const stopTimer = () => {
      isSendCode.value = false;
      disabledResend.value = false;
    };

    watch(
      () => store.getters["data_card/saveButtonClicked"],
      (val) => {
        if (val) {
          v$.value.newPhone.$touch();
        }
      }
    );

    onBeforeMount(() => {
      store.commit("data_card/saveButtonClicked", false);
      if (process.client) {
        if (store.getters["data_card/getErrorMessage"] && localStorage.newPhone) {
          newPhone.value = localStorage.newPhone;
        }
      }
    });

    onBeforeUnmount(() => {
      isSendCode.value = false;
      localStorage.setItem("newPhone", newPhone.value);
    });

    return {
      userInput,
      newPhone,
      isSendCode,
      disabledResend,
      duration: DURATION,
      placeholder: PLACEHOLDER,
      changeMask: MASK,
      loading,
      v$,
      isShowCodeEnter,
      update,
      validateState,
      verifyUser,
      changeNumber,
      stopTimer,
    };
  },
};
</script>

<style scoped>
.resend {
  margin-top: 20px;
}

.resend-block {
  margin-bottom: 15px;
}

.help-text {
  font-size: 12px;
  margin-top: 10px;
}

.danger-text {
  color: red;
  font-size: 12px;
  margin-top: 10px;
}

.btn-sms {
  height: 37px !important;
  line-height: 37px;
}

.l-b-m-t {
  margin-top: 10px;
}
</style>
