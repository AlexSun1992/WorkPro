<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="block bg-six block-border-one mb-5 col-md-10 col-lg-6">
        <h4 class="mb-3 text-center mt-2">Восстановление доступа</h4>
        <b-alert
          :show="errorMessage || !!$store.getters.getRegistrationError"
          variant="danger"
          >{{
            errorMessage ? errorMessage : $store.getters.getRegistrationError
          }}</b-alert
        >
        <b-tabs ref="tabs" content-class="mt-2">
          <b-tab title="Телефон" active>
            <verify-user
              :label="phoneLabel"
              :loginType="'phone'"
              :v="$v.form"
              :count="60"
              :validateState="validateState"
            />
          </b-tab>
          <b-tab title="Email">
            <verify-user
              :label="emailLabel"
              :loginType="'email'"
              :v="$v.form"
              :count="60"
              :validateState="validateState"
            />
          </b-tab>
        </b-tabs>
        <UserRecoveryForm
          v-if="greater180"
          :v="$v.form"
          :validateState="validateState"
        />
        <b-row>
          <b-form-group class="col-md-6 col-12">
            <b-form-input
              type="password"
              v-model="$v.form.password.$model"
              placeholder="Пароль"
            ></b-form-input>
            <b-form-invalid-feedback>Введите пароль</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group class="col-md-6 col-12">
            <b-form-input
              type="password"
              v-model="$v.form.password2.$model"
              placeholder="Повторите пароль"
            ></b-form-input>
            <b-form-invalid-feedback>Повторите пароль</b-form-invalid-feedback>
          </b-form-group>
        </b-row>
        <div class="mt-2 mb-3 d-flex justify-content-between">
          <router-link to="/login">
            <b-button variant="outline-secondary">Отмена</b-button>
          </router-link>
          <b-button
            variant="success"
            @click="resetPassword"
            :disabled="disabledReset"
            >Сбросить пароль</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VerifyUser from "~/components/Libs/VerifyUser/VerifyUser";
import UserRecoveryForm from "~/components/Pages/Login/PasswordRecovery/UserRecoveryForm";
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";

export default {
  layout: "MainLayout",
  components: {
    VerifyUser,
    UserRecoveryForm,
  },
  data() {
    return {
      form: {
        phone: "",
        code: "",
        email: "",
        surname: "",
        name: "",
        patronymic: "",
        birthdate: "",
        password: "",
        password2: "",
      },
      phoneLabel: "Введите номер телефона указанный при регистрации",
      emailLabel: "Введите email указанный при регистрации",
      isEmailValid: false,
      errorMessage: null,
      greater180: null,
    };
  },

  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    async resetPassword() {
      let params;
      if (this.$refs.tabs.currentTab == 0) {
        params = {
          TYPE: 1,
          PHONE: this.$v.form.phone.$model,
          SMSCODE: this.$v.form.code.$model,
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
        };
      }
      if (this.$refs.tabs.currentTab == 1) {
        params = {
          TYPE: 2,
          EMAIL: this.$v.form.email.$model,
          EMAILCODE: this.$v.form.code.$model,
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
        };
      }
      let response;
      if (!this.greater180) {
        const response = await this.$store.dispatch("resetPassword", params);
        if (response.data[0].MESSAGE_CODE === "200") {
          this.$router.push("/login");
        } else if (response.data[0].MESSAGE_CODE === "501") {
          this.errorMessage = "Необходимо ввести дополнительные данные";
          this.greater180 = true;
        }
      } else {
        const birthdate = this.$v.form.birthdate.$model;
        const year = birthdate.getFullYear();
        let date = birthdate.getDate();
        let month = birthdate.getMonth() + 1;
        date = String(date).length === 1 ? `0${date}` : date;
        month = String(month).length === 1 ? `0${month}` : month;
        this.$v.form.birthdate.$model = `${year}-${month}-${date}`;

        const additionalParams = {
          SECONDNAME: this.$v.form.surname.$model,
          FIRSTNAME: this.$v.form.name.$model,
          THIRDNAME: this.$v.form.patronymic.$model,
          BIRTHDATE: this.$v.form.birthdate.$model,
        };
        params = {
          ...params,
          ...additionalParams,
        };
        response = await this.$store.dispatch("resetPassword", params);
        if (response.data[0].MESSAGE_CODE === "200") {
          this.$router.push("/login");
        } else if (response.data[0].MESSAGE_CODE === "502") {
          this.errorMessage =
            "Введённые дополнительные данные некорректны. Повторите попытку";
        }
      }
    },
  },

  computed: {
    disabledReset() {
      if (!this.greater180) {
        return this.$v.form.password2.$invalid;
      } else {
        return (
          this.$v.form.name.$invalid ||
          this.$v.form.surname.$invalid ||
          this.$v.form.patronymic.$invalid ||
          this.$v.form.birthdate.$invalid
        );
      }
    },
  },

  validations: {
    form: {
      phone: {
        required,
        minLength: minLength(17),
      },
      email: {
        required,
        email,
      },
      name: {
        required,
      },
      surname: {
        required,
      },
      patronymic: {
        required,
      },
      code: {
        required,
        minLength: minLength(5),
      },
      password: {
        required,
      },
      password2: {
        required,
        sameAsPassword: sameAs("password"),
      },
      birthdate: {
        required,
      },
    },
  },
};
</script>

<style scoped>
.tab-content .tab-pane {
  padding: 1rem 0 0 0;
}
</style>
