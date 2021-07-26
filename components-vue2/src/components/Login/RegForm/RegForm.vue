<template>
  <div class="login-form">
    <div class="row justify-content-center">
      <div class="mb-5 col-md-10 col-lg-6">
        <div class="block-registration px-2 px-md-4 pb-3 mt-3">
          <ConfirmModal
            :conformation="conformation"
            @agree="isRegConfirmed = $event"
          />
          <!-- Алерт ошибки кода регистрации Андрея (на восстановлении у Жени) -->
          <!-- <b-alert :show="errorMessage" variant="danger">{{ errorMessage }}</b-alert> -->
          <!--  -->
          <!-- Алерт ошибки кода регистрации (удалить после восстановления) -->
          <b-alert :show="!!errorMessage" variant="danger">{{
            errorMessage
          }}</b-alert>

          <b-nav card-header tabs>
            <b-nav-item href="/login">Вход</b-nav-item>
            <b-nav-item active>Регистрация</b-nav-item>
          </b-nav>

          <b-form
            @submit.stop.prevent
            @keydown.enter.prevent="onSubmit"
            inline
            class="align-items-start"
            autocomplete="off"
          >
            <b-form-group label="Телефон" class="mt-3 w-100">
              <verify-user
                ref="verifyUser"
                @error="showError"
                :v="$v.form"
                :count="60"
                :context="'registration'"
                :loginType="'phone'"
                :mode-type="'REG'"
                :validateState="validateState"
                :disabled="registrationInProcess"
                :text-message="textMessage"
                :tab-index="[10, 15]"
                :error="errorMessage"
              />
            </b-form-group>
            <!-- Фамилия -->
            <div class="row">
              <div class="col-12 col-md-6 mt-3">
                <b-form-group label="Фамилия" label-cols="12">
                  <b-form-input
                    list="my-list-id"
                    :id="Math.random().toString()"
                    v-model="$v.form.family.$model"
                    :state="validateState('family')"
                    @blur="$v.form.family.$touch(), clearArray()"
                    placeholder="Фамилия"
                    :disabled="registrationInProcess"
                    tabindex="40"
                    autocomplete="new-password"
                    @input="askSuggestions('surname')"
                  ></b-form-input>

                  <b-form-invalid-feedback
                    v-if="this.$v.form.family.$model === ''"
                    >Пожалуйста, заполните это поле</b-form-invalid-feedback
                  >
                  <b-form-invalid-feedback
                    v-if="this.$v.form.family.alpha === false"
                    >Просьба указать ФИО в русской
                    транскрипции</b-form-invalid-feedback
                  >

                  <datalist id="my-list-id">
                    <option v-for="(item, index) in array" :key="index">
                      {{ item }}
                    </option>
                  </datalist>
                </b-form-group>
              </div>
              <!-- ///// -->
              <div class="col-12 col-md-6 mt-2 mt-md-3">
                <!-- Имя -->
                <b-form-group label="Имя" label-cols="12">
                  <b-form-input
                    list="my-list-id"
                    :id="Math.random().toString()"
                    v-model="$v.form.name.$model"
                    :state="validateState('name')"
                    @blur="$v.form.name.$touch(), clearArray()"
                    placeholder="Имя"
                    :disabled="registrationInProcess"
                    tabindex="50"
                    autocomplete="new-password"
                    @input="askSuggestions('name')"
                  ></b-form-input>

                  <b-form-invalid-feedback
                    v-if="this.$v.form.name.$model === ''"
                    >Пожалуйста, заполните это поле</b-form-invalid-feedback
                  >
                  <b-form-invalid-feedback
                    v-if="this.$v.form.name.alpha === false"
                    >Просьба указать ФИО в русской
                    транскрипции</b-form-invalid-feedback
                  >
                  <datalist id="my-list-id">
                    <option v-for="(item, index) in array" :key="index">
                      {{ item }}
                    </option>
                  </datalist>
                </b-form-group>
                <!-- /////// -->
              </div>

              <div class="col-12 col-md-6 mt-2 mt-md-3">
                <!-- Отчество -->
                <b-form-group label="Отчество" label-cols="12">
                  <b-form-input
                    list="my-list-id"
                    :id="Math.random().toString()"
                    v-model="$v.form.patronymic.$model"
                    :state="validateState('patronymic')"
                    @blur="$v.form.patronymic.$touch(), clearArray()"
                    placeholder="Отчество"
                    :disabled="registrationInProcess"
                    tabindex="60"
                    autocomplete="new-password"
                    @input="askSuggestions('patronymic')"
                  ></b-form-input>

                  <b-form-invalid-feedback
                    v-if="this.$v.form.patronymic.$model === ''"
                    >Пожалуйста, заполните это поле</b-form-invalid-feedback
                  >
                  <b-form-invalid-feedback
                    v-if="this.$v.form.patronymic.alpha === false"
                    >Просьба указать ФИО в русской
                    транскрипции</b-form-invalid-feedback
                  >
                  <datalist id="my-list-id">
                    <option v-for="(item, index) in array" :key="index">
                      {{ item }}
                    </option>
                  </datalist>
                </b-form-group>
              </div>
              <!-- ////// -->
            </div>
            <div class="col-12 col-md-6 mt-2 mt-md-3">
              <b-form-group label="Дата рождения" label-cols="12">
                <birthday-picker
                  v-model="$v.form.birthdate.$model"
                  :state="validateState('birthdate')"
                  :tabindex="30"
                  :disabled="registrationInProcess"
                />
              </b-form-group>
            </div>
            <div class="col-12 col-md-6 mt-3">
              <b-form-group label="E-mail" label-cols="12">
                <b-form-input
                  :id="Math.random().toString()"
                  v-model="$v.form.email.$model"
                  :state="validateState('email')"
                  @blur="$v.form.email.$touch()"
                  placeholder="E-mail"
                  :disabled="registrationInProcess"
                  tabindex="20"
                  autocomplete="new-password"
                ></b-form-input>
                <b-form-invalid-feedback>
                  Пожалуйста, заполните это поле
                </b-form-invalid-feedback>
              </b-form-group>
            </div>

            <div class="col-12 col-md-6"></div>
            <div class="col-12 col-md-6 mt-3">
              <b-form-group label="Номер полиса" label-cols="12">
                <b-form-input
                  :id="Math.random().toString()"
                  v-model="form.policyNumber"
                  placeholder="Номер полиса"
                  :disabled="registrationInProcess"
                  tabindex="70"
                  autocomplete="new-password"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-6"></div>
            <div class="col-12 mt-3">
              <verify-password
                :v="$v.form"
                :validateState="validateState"
                :disabled="registrationInProcess"
                :tab-index="[80, 90]"
              />
            </div>
            <div class="col-12 pt-3">
              <b-button
                @click.stop.prevent="onSubmit"
                class="w-100"
                type="submit"
                variant="success"
                :disabled="registrationInProcess"
                tabindex="100"
              >
                Зарегистрироваться
                <b-spinner
                  v-if="registrationInProcess"
                  style="width: 1.2rem; height: 1.2rem"
                  variant="light"
                ></b-spinner>
              </b-button>
            </div>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  sameAs,
  helpers,
} from "vuelidate/lib/validators";
import birthdayPicker from "../Libs/BirthdatePicker/BirthdatePicker.vue";
import VerifyUser from "../Libs/VerifyUser/VerifyUser.vue";
import VerifyPassword from "../Libs/VerifyPassword/VerifyPassword.vue";
import ConfirmModal from "./ConfirmModal.vue";
import {
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BAlert,
  BButton,
  BSpinner,
  BNav,
  BNavItem,
} from "bootstrap-vue";

const alpha = helpers.regex("alpha", /^[а-яА-Я- ]*$/);

export default {
  components: {
    birthdayPicker,
    VerifyUser,
    VerifyPassword,
    ConfirmModal,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BAlert,
    BButton,
    BSpinner,
    BNav,
    BNavItem,
  },

  mixins: [validationMixin],

  data() {
    return {
      array: [],
      form: {
        phone: "",
        email: "",
        family: "",
        name: "",
        patronymic: "",
        birthdate: "",
        policyNumber: "",
        code: "",
        password: "",
        password2: "",
      },

      conformation: false,
      show: true,
      password2: "",
      registrationInProcess: false,
      captchaToken: null,
      isRegConfirmed: null,
      token: 1,
      textMessage:
        "На Ваш номер телефона был отправлен код, который необходимо ввести.",
      errorMessage: null,
      isErrorMessage: false,
      myclass: ["cabinet"],
    };
  },

  validations: {
    form: {
      name: {
        required,
        alpha,
      },

      family: {
        required,
        alpha,
      },
      patronymic: {
        required,
        alpha,
      },
      birthdate: {
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
      phone: {
        required,
        minLength: minLength(17),
      },
      email: {
        required,
        email,
      },
    },
  },

  computed: {
    errorReset() {
      if (!this.$v.form.name.$model) {
        console.log(this.$v.form.name.$model);
      }
    },
  },

  methods: {
    clearArray() {
      this.array = [];
    },

    async fetchSuggestions(params) {
      const type = params.suggestionType;
      const key = params.key;
      delete params.suggestionType;
      delete params.key;
      const response = await fetch(
        `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/${type}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Token ${key}`,
          },
          body: JSON.stringify(params),
        }
      );
      const result = await response.json();
      return result.suggestions;
    },

    async askSuggestions(target) {
      const API_KEY = "7a6080c3383b4dc69e786e1cd5c88366ab58a14c";
      let suggestionType = "fio";
      let query;

      const params = {
        query: query,
        suggestionType,
        key: API_KEY,
      };

      if (target === "patronymic") {
        params.query = this.$v.form.patronymic.$model;
        params.parts = ["PATRONYMIC"];
      } else if (target === "surname") {
        params.query = this.$v.form.family.$model;
        params.parts = ["SURNAME"];
      } else if (target === "name") {
        params.query = this.$v.form.name.$model;
        params.parts = ["NAME"];
      }

      const result = await this.fetchSuggestions(params);

      if (target === "surname" && this.$v.form.family.alpha !== false) {
        this.array.length = 0;
        await result.forEach((item) => {
          this.array.push(item.data.surname);
        });
      } else if (target === "name" && this.$v.form.name.alpha !== false) {
        this.array.length = 0;
        await result.forEach((item) => {
          this.array.push(item.data.name);
        });
      } else if (
        target === "patronymic" &&
        this.$v.form.patronymic.alpha !== false
      ) {
        this.array.length = 0;
        await result.forEach((item) => {
          this.array.push(item.data.patronymic);
        });
      }
    },

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    async register(context) {
      try {
        this.isErrorMessage = false;
        this.errorMessage = null;
        this.registrationInProcess = true;
        let params = {
          SECONDNAME: this.$v.form.family.$model,
          FIRSTNAME: this.$v.form.name.$model,
          THIRDNAME: this.$v.form.patronymic.$model,
          BIRTHDATE: this.$v.form.birthdate.$model,
          PHONE: this.$v.form.phone.$model,
          EMAIL: this.$v.form.email.$model,
          CODE: this.$v.form.code.$model,
          POLICY_NUMBER: this.form.policyNumber,
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
          USER_CONFIRM: "Y",
        };

        const headers = {
          headers: { recaptcha: params.token },
        };
        const response = await axios.post(
          "/free/v2/registration",
          params,
          headers
        );

        this.registrationInProcess = false;
        if (response?.status === 200) {
          this.$bvModal
            .msgBoxOk("Вы успешно зарегистрированы в системе!", {
              title: "Подтверждение",
              size: "md",
              buttonSize: "md",
              okVariant: "success",
              okTitle: "Войти в систему",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
              modalClass: this.myclass,
              autoFocusButton: "ok",
            })
            .then((value) => {
              window.location.href = "/login";
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (response?.status !== 200) {
          this.isErrorMessage = true;
          this.errorMessage = response.data.INFO;
        }
      } catch (e) {
        this.isErrorMessage = true;
        this.errorMessage = e.response.data.INFO;
        this.registrationInProcess = false;
        console.log(e);
      }
    },

    async onSubmit(event) {
      try {
        this.$refs.verifyUser.loginTouchesCount = 3;
        this.$v.form.$touch();
        this.isErrorMessage = false;
        if (this.$v.form.$anyError) {
          if (this.$refs.verifyUser.isSendCode === false) {
            this.$refs.verifyUser.getCode();
            this.$refs.verifyUser.isPhoneChanged = true;
          }
          return;
        }
        this.register(this);
      } catch (e) {
        console.log(e);
      }
    },
    showError(msg) {
      if (msg) {
        this.isErrorMessage = true;
        this.errorMessage = msg;
      } else {
        this.isErrorMessage = false;
        this.errorMessage = null;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/scss/reg.scss";

.alert {
  border: 1px solid orange;
}

.ok {
  border: 1px solid red;
}

.autocomplete {
  position: relative;
}
.dropdown-menu {
  display: block;
  width: 100%;
}
.active {
  background-color: lightgrey;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.error {
  margin-top: 0.25rem;
  font-size: 80%;
  color: #f86c6b;
}
.help-text {
  font-size: 12px;
  margin-top: 10px;
}
.autocomplete ul.dropdown-menu {
  display: block;
  margin-top: -5px;
}
legend {
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
}
</style>
