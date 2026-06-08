<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <form-group
          :label="showLabel"
          label-cols="12"
        >
          <b-form-input
            @input="delayTouch($v.password)"
            :id="Math.random().toString()"
            type="password"
            v-model="passwordModel"
            :state="validateState('password')"
            placeholder="Пароль"
            @blur="v.password.$touch()"
            autocomplete="new-password"
            :disabled="disabled"
            :tabindex="tabIndex[0]"
          ></b-form-input>
          <div
            class="invalid-feedback"
            v-if="validateState('password') === false"
          >
            Введите пароль.
          </div>
        </form-group>
      </div>
      <div
        class="col-sm-12 col-md-6"
        v-if="recovery"
      ></div>
      <div
        class="col-sm-12 col-md-6 password-repeat"
        :class="{ 'mt-0': recovery }"
      >
        <form-group
          label="Повторите пароль"
          label-cols="12"
        >
          <b-form-input
            @input="delayTouch($v.password)"
            :id="Math.random().toString()"
            type="password"
            autocomplete="off"
            v-model="passwordModel2"
            :state="validateState('password2')"
            placeholder="Повторите пароль"
            @blur="v.password2.$touch()"
            :disabled="disabled"
            :tabindex="tabIndex[1]"
          ></b-form-input>
          <div
            class="invalid-feedback"
            v-if="validateState('password2') === false"
          >
            Повторите пароль
          </div>
        </form-group>
      </div>
      <div
        class="col-sm-12"
        v-if="recovery"
      ></div>
    </div>
  </div>
</template>

<script>
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "VerifyPassword",
  components: { FormGroup },
  props: {
    v: {
      type: Object,
      required: true,
    },
    validateState: {
      type: Function,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    recovery: {
      type: Boolean,
      default: false,
    },
    tabIndex: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    passwordModel: {
      get() {
        return this.v.password.$model;
      },
      set(value) {
        // eslint-disable-next-line vue/no-mutating-props
        this.v.password.$model = value;
      },
    },
    passwordModel2: {
      get() {
        return this.v.password2.$model;
      },
      set(value) {
        // eslint-disable-next-line vue/no-mutating-props
        this.v.password2.$model = value;
      },
    },
    showLabel() {
      return this.recovery ? "Придумайте новый пароль" : "Пароль";
    },
  },
};
</script>

<style scoped></style>
