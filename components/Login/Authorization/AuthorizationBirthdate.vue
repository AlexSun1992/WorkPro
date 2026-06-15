<template>
  <div>
    <div class="login-header">
      <img src="/img/login_header.png" />
      <div class="login-header-title">
        {{ options.title }}<br />
        <span>{{ options.modalTextRequest }}</span>
      </div>
    </div>
    <div
      v-if="options.informerText && options.statusObject"
      class="mb-4"
    >
      <ControlInformer :data="{ value: options.informerText, name: options.statusObject }"></ControlInformer>
    </div>
    <form
      id="sms-form"
      @submit.prevent="onSubmit"
    >
      <div>
        <BirthdateField
          :options="options"
          :state="validClass"
          :error-input-text="options.errorInput"
          @updateBirthdate="updateBirthdate"
        />
      </div>

      <SubmitButton> </SubmitButton>

      <button
        class="back"
        type="button"
        @click="nextStep"
      >
        <img
          class="mr-2"
          width="24"
          height="24"
          src="/img/login.svg#back"
        />
        Назад
      </button>
    </form>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import SubmitButton from "./SubmitButton";
import BirthdateField from "./BirthdateField";
import ControlInformer from "@/components/Libs/Controls/ControlInformer/ControlInformer";

export default {
  name: "AuthorizationBirthdate",
  components: {
    ControlInformer,
    SubmitButton,
    BirthdateField,
  },
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
    const user = ref(props.userData.birthdate || "");
    const dirty = ref(false);
    const isFormValid = computed(() => user.value.trim().length > 0);
    const validClass = computed(() => {
      if (!dirty.value && !props.options.errorInput?.length) {
        return null;
      }
      return !(
        props.options.errorInput?.length ||
        props.options.statusObject === "SERROR_INFO" ||
        (dirty.value && !user.value)
      );
    });

    const onSubmit = () => {
      if (!isFormValid.value || props.options.authInProcess) {
        return;
      }
      emit("submit", user.value);
    };

    const updateBirthdate = (event) => {
      dirty.value = true;
      user.value = event;
    };

    const isDisabled = computed(() => props.options.authInProcess || !user.value.length);

    const nextStep = () => {
      emit("componentStep", "phone");
    };

    return {
      user,
      validClass,
      isDisabled,
      updateBirthdate,
      onSubmit,
      nextStep,
    };
  },
};
</script>

<style scoped>
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
.back {
  text-align: center;
  padding: 0;
  border-radius: 15px;
  line-height: 50px;
  box-sizing: border-box;
  border: 2px solid transparent;
  font-weight: 700;
  white-space: nowrap;
  position: relative;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 54px;
  background-color: transparent;
  margin-top: 1rem;
  width: 100%;
  font-size: 1rem;
  color: #43b02a;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
