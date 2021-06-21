<template>
  <div>
    <p class="my-2">{{ errorMessage }}</p>
    <b-form @submit.prevent="onSubmit">

      <b-form-group label="Телефон" label-cols="12">
        
        <b-form-input
          ref="phoneInput"
          v-model="$v.user.username.$model"
          v-mask="usernameMask"
          :placeholder="placeholder"
          autofocus
          type="tel"
          :state="validateInput('username', isUsernameBlured)"
          @blur="debouncedUpdate('username', isUsernameBlured)"
          @input="isUsernameBlured = false"
          @click="loginTouchesCount = 2"
          :disabled="authInProcess"
          class="form-control">
        </b-form-input>
        <b-form-invalid-feedback
          >Пожалуйста, введите корректный номер
          телефона</b-form-invalid-feedback>

      <!-- <login-autocomplete
      :placeholder="placeholder"
      v-mask="usernameMask"
      :autofocus="true"
      :type="tel"
      ></login-autocomplete> -->

            </b-form-group>

      <b-form-group label="Пароль" label-cols="12"> 

        <!-- <b-form-input
          v-model="$v.user.password.$model"
          placeholder="Пароль"
          type="password"
          :state="validateInput('password', isPasswordBlured)"
          @blur="blurField('password', isPasswordBlured)"
          @input="isPasswordBlured = false"
          class="form-control"
          :disabled="authInProcess"
        ></b-form-input>
        <b-form-invalid-feedback
          >Пожалуйста, введите пароль
          </b-form-invalid-feedback>  -->

          <login-autocomplete
          placeholder="Пароль"
          type="password"
          ></login-autocomplete>

          </b-form-group>



      <b-button
        variant="success"
        type="submit"
        :disabled="authInProcess"
        class="w-100 mt-3"
      >
        Авторизоваться
        <b-spinner
          v-if="authInProcess"
          style="width: 1.2rem; height: 1.2rem"
          variant="light"
        ></b-spinner>
      </b-button>
    </b-form>
    <div class="mt-3 text-center">
      <span class="forgot-password">Забыли пароль?</span>
      <nuxt-link to="/recovery">Восстановить</nuxt-link>
    </div>
  </div>
</template>



<script>
import { required, minLength } from "vuelidate/lib/validators";
import _ from "lodash";
import LoginAutocomplete from '../LoginAutocomplete/LoginAutocomplete.vue';





export default {
 
components:{LoginAutocomplete},

  data() {
    return {
      user: {
      username: "",
        password: ""
      },
      isUsernameBlured: true,
      isPasswordBlured: true,
      autofocus:true,
      usernameMask: "+7(###)-###-##-##",
      placeholder: "+7(___)-___-__-__",
      errorMessage: null,
      authInProcess: false,
      captchaToken: null,
      loginTouchesCount: 0,
    };
  },

  created() {
    this.debouncedUpdate = _.debounce(this.blurField, 100);
    this.initialCount = this.count;
    this.resendCount = this.count;
  },

  methods: {
    async login(context) {
  
      try {
        this.authInProcess = true;
        // this.captchaToken = await this.$getCaptcha();
        await context.$auth.loginWith("local", {
          // headers: {
          //   RECAPTCHA: context.captchaToken
          // },
          data: {
            username: context.$v.user.username.$model,
            password: context.$v.user.password.$model,
            mode: 2,
          },
        });
        let url = "/cabinet/55/0/701";
        if (this.$cookiz.get("url") && this.$cookiz.get("url") !== "/") {
          url = this.$cookiz.get("url");
        }
        if (url) {
          this.$cookiz.remove("url");
          this.$router.push(url);
        } else {
          context.authInProcess = false;
        }
      } catch (e) {
        context.errorMessage = "Неверный телефон или пароль";
        context.authInProcess = false;
      }
    },

    validateInput(field, bluredField) {
      if (this.errorMessage) {
        return false;
      }
      if (
        field === "username" &&
        this.loginTouchesCount <= 2 &&
        this.isUsernameBlured &&
        !this.$v.user[field].$model
      )
        return;
      if (
        (this.$v.user[field].$model &&
          this.$v.user[field].$params.minLength &&
          this.$v.user[field].$model.length ===
            this.$v.user[field].$params.minLength.min) ||
        bluredField
      ) {
        return this.validateState(field);
      }
    },

    blurField(field, bluredField) {
      
      if (field === "username") {
        this.loginTouchesCount++;
        this.isUsernameBlured = true;
      } else if (field === "password") {
        this.isPasswordBlured = true;
      }
      this.$v.user[field].$touch();
    },

    validateState(name) {
      const { $dirty, $error } = this.$v.user[name];
      return $dirty ? !$error : null;
    },

    onSubmit() {
      this.errorMessage = null;
      this.loginTouchesCount = 3;
      this.$v.user.$touch();
      if (this.$v.user.$anyError) {
        
        return;
      }
      this.login(this);
    },
  },

  validations: {
    user: {
      username: {
        required,
        minLength: minLength(17),
      },
      password: {
        required,
      },
    },
  },
};
</script>

<style scoped lang="scss">
.forgot-password {
  color: #536c79; /**Заменить на глобальные цвета */
}
@import "~/assets/scss/reg.scss";
</style>
