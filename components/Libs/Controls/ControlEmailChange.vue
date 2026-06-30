<template>
  <div>
    <div class="change-email">
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
            v-model="newEmail"
            :placeholder="placeholder"
            :state="validateState('newEmail')"
            autocomplete="off"
            df
            :disabled="isShowCodeEnter"
            type="email"
            data-testid="getCodeInput"
            @blur="update"
            @input="changeField('newEmail')"
          ></b-form-input>

          <div
            v-if="!v$.newEmail.$model"
            class="invalid-feedback"
          >
            Пожалуйста, заполните это поле
          </div>
          <div
            v-if="v$.newEmail.email.$invalid && !v$.newEmail.forbiddenRussianSign.$invalid"
            class="invalid-feedback"
          >
            Пожалуйста, введите корректную электронную почту
          </div>

          <div
            v-if="v$.newEmail.$model && v$.newEmail.forbiddenPlusSign.$invalid"
            class="invalid-feedback"
          >
            Пожалуйста, введите корректную электронную почту
          </div>

          <div
            v-if="v$.newEmail.$model && v$.newEmail.forbiddenRussianSign.$invalid"
            class="invalid-feedback"
          >
            Русские символы запрещены
          </div>
        </form-group>
        <div class="col-auto">
          <button
            :id="data.fieldId"
            type="submit"
            class="btn btn-success mt-btn-form-3"
            :disabled="v$.newEmail.$invalid || loading || isSendCode"
            data-testid="getCodeButton"
            @click="verifyUser"
          >
            Получить код
          </button>
        </div>
        <div
          v-if="isShowCodeEnter"
          class="col-auto"
        >
          <label class="d-none d-md-block">&nbsp;</label>
          <a
            href="#"
            class="link-button d-block l-b-m-t"
            @click="changeEmail"
          >
            Изменить электронную почту
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
          Проверочный код выслан на указанную электронную почту.<br />Повторно код можно запросить через
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
import { computed, ref, onMounted, onUnmounted, watch, getCurrentInstance } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { BFormInput } from "bootstrap-vue";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

const forbiddenRussianSign = helpers.regex(/^[^а-яА-ЯёЁ]*$/i);
const forbiddenPlusSign = helpers.regex(/^[^+]*$/i);

const PLACEHOLDER = "Электронная почта";
const DURATION = 60;

export default {
  name: "ControlEmailChange",
  components: { VerifyTimer, FormGroup, BFormInput },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    params: {
      type: Object,
      required: true,
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const store = instance.proxy.$store;
    const route = computed(() => instance.proxy.$route);

    const userInput = ref(null);
    const newEmail = ref("");
    const isSendCode = ref(false);
    const disabledResend = ref(true);
    const loading = ref(false);

    const rules = {
      newEmail: { required, email, forbiddenRussianSign, forbiddenPlusSign },
    };
    const v$ = useVuelidate(rules, { newEmail });

    const ns = computed(() => props.params.ns);
    const getSMSCodeComponent = computed(() =>
      store.getters[`${ns.value}/getCopyForm`]?.find((el) => el.name === "SCODEFIELD")
    );
    const isShowCodeEnter = computed(() => !v$.value.newEmail.$invalid && isSendCode.value);

    const update = () => {
      v$.value.newEmail.$touch();
    };
    const validateState = (name) => {
      const { $dirty, $error } = v$.value[name];

      return $dirty ? !$error : null;
    };
    const changeField = (name) => {
      v$.value.newEmail.$touch();
      validateState(name);
    };
    const getCode = async () => {
      if (getSMSCodeComponent.value) {
        store.commit(`${ns.value}/clearFormField`, {
          fieldId: getSMSCodeComponent.value?.fieldId,
        });
      }

      if (!newEmail.value) return;

      const actionParams = {
        name: "SNEWEMAIL",
        value: newEmail.value,
      };

      try {
        loading.value = true;
        disabledResend.value = true;
        const response = await store.dispatch(`${ns.value}/executeAction`, {
          actionId: props.params.actions[0].id,
          relActionId: props.params.actions[0].relaction,
          relId: props.params.idRel ?? route.value.params.idRel,
          rowId: props.params.idCard ?? route.value.params.idCard,
          body: [actionParams],
        });

        if (response?.status === 500 || response?.status === 520) {
          loading.value = false;
          store.commit(`${ns.value}/setSavedError`, true);
          store.commit(`${ns.value}/setErrorMessage`, response.data);
          store.commit(`${ns.value}/setFormField`, response.data);
          store.commit(`${ns.value}/setFormField`, {
            fieldId: 35622,
            value: null,
          });
        }
        if (response?.status === 200) {
          loading.value = false;
          store.commit(`${ns.value}/setSavedError`, false);
          store.commit(`${ns.value}/setErrorMessage`, null);
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
      getCode();
      if (newEmail.value !== "") {
        emit("update", {
          fieldId: props.data.fieldId,
          name: props.data.name,
          value: newEmail.value,
        });
      }
    };
    const changeEmail = () => {
      userInput.value.$el.disabled = false;
      userInput.value.$el.focus();
      isSendCode.value = false;
    };
    const stopTimer = () => {
      isSendCode.value = false;
      disabledResend.value = false;
    };

    store.commit("data_card/saveButtonClicked", false);

    watch(
      () => store.getters[`${ns.value}/saveButtonClicked`],
      (val) => {
        if (val) {
          v$.value.newEmail.$touch();
        }
      }
    );

    onMounted(() => {
      newEmail.value = props.data.value;
    });

    onUnmounted(() => {
      isSendCode.value = false;
    });

    return {
      userInput,
      newEmail,
      isSendCode,
      disabledResend,
      duration: DURATION,
      placeholder: PLACEHOLDER,
      loading,
      v$,
      isShowCodeEnter,
      update,
      validateState,
      changeField,
      verifyUser,
      changeEmail,
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
