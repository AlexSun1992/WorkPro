<template>
  <form
    id="auth-form"
    @submit.prevent="onSubmit"
  >
    <div class="login-header">
      <img src="/img/login_header.png" />
      <div class="login-header-title">
        Войдите или создайте профиль<br />
        <span>Чтобы купить и управлять своими страховыми продуктами</span>
      </div>
    </div>
    <div
      class="mb-4"
      v-if="options.informerText && options.statusObject"
    >
      <ControlInformer :data="{ value: options.informerText, name: options.statusObject }"></ControlInformer>
    </div>

    <div class="login-input-phone">
      <PhoneField
        :userData="userData"
        :state="validClass"
        :options="options"
        :errorInputText="errorInputText"
        @blur="onBlur"
        @updatePhone="updatePhone"
      />
    </div>

    <SubmitButton></SubmitButton>
    <EsiaButton />

    <div class="login_more text-center">
      <div class="login_more-title">Либо войти с помощью</div>
      <button
        @click="goALFA"
        id="alfa-login"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="/img/login.svg#alfa_new"></use>
        </svg>
      </button>

      <button
        @click="goSberID"
        id="sberid-login"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="/img/login.svg#sber_new"></use>
        </svg>
      </button>
    </div>
    <div class="login-footer">
      Или воспользоваться старым входом<br />по <a href="/login">e-mail/номеру телефона и паролю</a>
    </div>
  </form>
</template>

<script>
import { ref, computed } from "vue";
import ControlInformer from "@/components/Libs/Controls/ControlInformer/ControlInformer";
import { redirectWithRef } from "./redirect";
import SubmitButton from "./SubmitButton";
import EsiaButton from "./EsiaButton";
import PhoneField from "./PhoneField";

export default {
  name: "AuthorizationPhone",
  components: { ControlInformer, SubmitButton, EsiaButton, PhoneField },
  props: {
    userData: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["submit", "componentStep"],

  setup(props, { emit }) {
    const user = ref(props.userData.username || "");
    const dirty = ref(false);

    const validClass = computed(() => {
      if (!dirty.value && !props.options.errorInput?.length) return null;
      return !(
        props.options.errorInput?.length ||
        props.options.statusObject === "SERROR_INFO" ||
        (dirty.value && !user.value)
      );
    });

    const errorInputText = computed(() => {
      if (!validClass.value && !user.value && dirty.value) return "Пожалуйста, заполните это поле";
      return props.options.errorInput;
    });

    const showUsernameError = computed(() => props.options.errorInput?.length);
    const isMainFormDisabled = computed(() => props.options.isMainFormDisabled || false);
    const isDisabled = computed(() => isMainFormDisabled.value || !user.value || user.value.length < 12);
    const updatePhone = (event) => {
      dirty.value = true;
      user.value = event;
    };

    const goALFA = () => {
      redirectWithRef("/sso?auth&type=alfa");
    };

    const goSberID = () => {
      redirectWithRef("/sso?auth&type=sberid");
    };

    const onSubmit = () => {
      emit("submit", user.value);
    };

    const onBlur = () => {
      emit("blur", user.value);
    };

    return {
      user,
      isMainFormDisabled,
      validClass,
      isDisabled,
      errorInputText,
      updatePhone,
      onBlur,
      goALFA,

      goSberID,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.login-footer {
  text-align: center;
  color: #868686;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-top: 32px;
}
.login_more {
  border: 1px solid rgba(242, 244, 245, 1);
  border-radius: 16px;
  padding: 16px 24px;
  margin-top: 32px;
}

.login_more-title {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: center;
}
.login-header {
  display: grid;
  grid-template-columns: 64px auto 40px;
  margin-bottom: 32px;
}
.login-header img {
  min-height: 80.5px;
  min-height: 40px;
}
.login-header-title {
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 2rem;
  color: #292929;
}
.login-header-title span {
  display: block;
  margin-top: 8px;
  color: #686868;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5rem;
}
.btn-sberid {
  display: none;
}

.login-form-content {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  border-radius: 32px;
  padding: 42px;
}
.block-registration {
  background: #f2f4f5;
  padding: 2px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 50% 50%;
}

.block-registration button {
  border: 0;
  background: transparent;
  height: 32px;
  font-weight: 600;
  color: #686868;
}
.block-registration button.active {
  background: #fff;
  border-radius: 6px;
  color: #43b02a;
}

.login_gos {
  text-align: center;
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSIzIiB2aWV3Qm94PSIwIDAgOCAzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPHBhdGggZD0iTTEgMS41SDIzNSIgc3Ryb2tlPSIjRjBGMEYwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWRhc2hhcnJheT0iNCA0Ii8+DQo8L3N2Zz4NCg==)
    50% 50%;
  background-repeat: repeat-x;
  font-weight: 700;
  font-size: 1rem;
  font-family: "Raleway";
  text-align: center;
  color: #5d737e;
}

.login_gos span {
  text-align: center;
  padding: 0 10px;
  background: #fff;
}
.login_more button {
  background: transparent;
  border: 0;
  margin-top: 1rem;
}
.login_more button + button {
  margin-left: 1.5rem;
}
.login-footer a {
  color: #237ecf;
  text-decoration: underline;
}
</style>
./SubmitButton.vue./EsiaButton.vue./PhoneField.vue
