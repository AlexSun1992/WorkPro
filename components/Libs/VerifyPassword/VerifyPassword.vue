<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <form-group
          :label="showLabel"
          label-cols="12"
        >
          <input
            :id="Math.random().toString()"
            v-model="passwordModel"
            :class="validClass(validateState('password'))"
            type="password"
            placeholder="Пароль"
            autocomplete="new-password"
            :disabled="disabled"
            :tabindex="tabIndex[0]"
            @input="delayTouch($v.password)"
            @blur="v.password.$touch()"
          />

          <div
            v-if="validateState('password') === false"
            class="invalid-feedback"
          >
            Введите пароль.
          </div>
        </form-group>
      </div>
      <div
        v-if="recovery"
        class="col-sm-12 col-md-6"
      ></div>
      <div
        class="col-sm-12 col-md-6 password-repeat"
        :class="{ 'mt-0': recovery }"
      >
        <form-group
          label="Повторите пароль"
          label-cols="12"
        >
          <input
            :id="Math.random().toString()"
            v-model="passwordModel2"
            type="password"
            autocomplete="off"
            :class="validClass(validateState('password2'))"
            placeholder="Повторите пароль"
            :disabled="disabled"
            :tabindex="tabIndex[1]"
            @input="delayTouch($v.password)"
            @blur="v.password2.$touch()"
          />
          <div
            v-if="validateState('password2') === false"
            class="invalid-feedback"
          >
            Повторите пароль
          </div>
        </form-group>
      </div>
      <div
        v-if="recovery"
        class="col-sm-12"
      ></div>
    </div>
  </div>
</template>

<script>
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "VerifyPassword",
  components: { FormGroup },
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
  methods: {
    validClass(state) {
      if (state) {
        return "is-valid";
      }
      if (state === null) {
        return "";
      }
      return "is-invalid";
    },
  },
};
</script>

<style scoped></style>
