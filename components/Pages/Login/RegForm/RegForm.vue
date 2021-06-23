<template>
  <div>
    <ConfirmModal
      :conformation="conformation"
      @agree="isRegConfirmed = $event"
    />
    <!-- Алерт ошибки кода регистрации Андрея (на восстановлении у Жени) -->
    <b-alert :show="errorMessage" variant="danger">{{ errorMessage }}</b-alert>
    <!--  -->
    <!-- Алерт ошибки кода регистрации (удалить после восстановления) -->
    <b-alert :show="!!errorMessage" variant="danger">{{
      errorMessage
    }}</b-alert>
   
    <b-form
      @submit.stop.prevent
      @keydown.enter.prevent="onSubmit"
      inline
      class="align-items-start"
      autocomplete="off"
    >
      <b-form-group label="Телефон" label-cols="12" class="col-12">
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
        />
      </b-form-group>

      <b-form-group label="E-mail" label-cols="12" class="col-12 col-md-6">
        <b-form-input
          :id="Math.random().toString()"
          v-model.lazy="$v.form.email.$model"
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

      <b-form-group
        label="Дата рождения"
        label-cols="12"
        class="col-12 col-md-6"
      >
        <birthday-picker
          v-model="$v.form.birthdate.$model"
          :state="validateState('birthdate')"
          :tabindex="30"
          :disabled="registrationInProcess"
        />
      </b-form-group>

      <div class="d-flex w-100">
        <b-form-group label="Фамилия" label-cols="12" class="col-12 col-md-6">
          <b-form-input
            :id="Math.random().toString()"
            v-model="$v.form.family.$model"
            :state="validateState('family')"
            @blur="$v.form.family.$touch()"
            placeholder="Фамилия"
            :disabled="registrationInProcess"
            tabindex="40"
            autocomplete="new-password"
          ></b-form-input> 

          <b-form-invalid-feedback v-if="this.$v.form.family.$model === ''">Пожалуйста, заполните это поле</b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="this.$v.form.family.alpha === false">Просьба указать ФИО в русской транскрипции</b-form-invalid-feedback>

           <input-autocomplete 
           ref="family"
          v-if="this.$v.form.family.$model !== '' &&  this.$v.form.family.alpha !== false"
          :items="persons" 
          filterby="surname" 
          :stringValue="this.$v.form.family.$model"
          @setSurname="setSurname"
       /> 

        </b-form-group>
      </div>

      <b-form-group label="Имя" label-cols="12" class="col-12 col-md-6">
        <b-form-input
          :id="Math.random().toString()"
          v-model="$v.form.name.$model"
          :state="validateState('name')"
          @blur="$v.form.name.$touch()"
          placeholder="Имя"
          :disabled="registrationInProcess"
          tabindex="50"
          autocomplete="new-password"
        ></b-form-input>

        <b-form-invalid-feedback v-if="this.$v.form.name.$model === ''">Пожалуйста, заполните это поле</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="this.$v.form.name.alpha === false">Просьба указать ФИО в русской транскрипции</b-form-invalid-feedback>
      
       <input-autocomplete 
       v-if="this.$v.form.name.$model !== '' &&  this.$v.form.name.alpha !== false"
       :items="persons" 
       filterby="name" 
       :stringValue="this.$v.form.name.$model"
       ref="name"
       @setName="setName"
       /> 


      </b-form-group>

      <b-form-group label="Отчество" label-cols="12" class="col-12 col-md-6">
        <b-form-input
          :id="Math.random().toString()"
          v-model="$v.form.patronymic.$model"
          :state="validateState('patronymic')"
          @blur="$v.form.patronymic.$touch()"
          placeholder="Отчество"
          :disabled="registrationInProcess"
          tabindex="60"
          autocomplete="new-password"
        ></b-form-input>
        <b-form-invalid-feedback v-if="this.$v.form.patronymic.$model === ''">Пожалуйста, заполните это поле</b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="this.$v.form.patronymic.alpha === false">Просьба указать ФИО в русской транскрипции</b-form-invalid-feedback>

       <input-autocomplete 
       ref="patronymic"
       v-if="this.$v.form.patronymic.$model !== '' &&  this.$v.form.patronymic.alpha !== false"
       :items="persons" 
       filterby="patronymic" 
       :stringValue="this.$v.form.patronymic.$model"
       @setValue="setValue"
      />
      
      </b-form-group>

      <b-form-group label="Номер полиса" label-cols="12" class="col-12">
        <b-form-input
          :id="Math.random().toString()"
          v-model="form.policyNumber"
          placeholder="Номер полиса"
          :disabled="registrationInProcess"
          tabindex="70"
          autocomplete="new-password"
        ></b-form-input>
      </b-form-group>

      <verify-password
        :v="$v.form"
        :validateState="validateState"
        :disabled="registrationInProcess"
        :tab-index="[80, 90]"
      />
      <div class="col-12 m-auto pt-3">
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
    <!--    <recaptcha @error="onError" @success="onSuccess" @expired="onExpired" />-->
  </div>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, email, minLength, sameAs, helpers } from "vuelidate/lib/validators";

import birthdayPicker from "../../../Libs/BirthdatePicker/BirthdatePicker";
import VerifyUser from "../../../Libs/VerifyUser/VerifyUser";
import VerifyPassword from "../../../Libs/VerifyPassword/VerifyPassword";
import ConfirmModal from "./ConfirmModal"; 
import InputAutocomplete from '../InputAutocomplete.vue';

const alpha = helpers.regex('alpha', /^[а-яА-Я]*$/)

export default {
  components: { birthdayPicker, VerifyUser, VerifyPassword, 
  ConfirmModal, InputAutocomplete },

  mixins: [validationMixin],

  data() {
    return {
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

      persons:[

    {id:1, name:'Степан', surname:'Петров', patronymic:'Владимирович', email:'korston@mail.ru'},

    {id:1, name:'Дмитрий', surname:'Васин', patronymic:'Васильевич', email:'aurora@mail.ru'},

    {id:1, name:'Василий', surname:'Гаврилов', patronymic:'Всеолодович', email:'automobile@mail.ru'},

    {id:1, name:'Александр', surname:'Бочаров', patronymic:'Владиленович', email:'petya@mail.ru'}

      ],

    
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
        alpha
      },
      family: {
        required,
        alpha
      },
      patronymic: {
        required,
        alpha
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

  methods: {

    setValue(index){
     this.$v.form.patronymic.$model=this.persons[index][this.$refs.patronymic.filterby]
    },

    setName(index){
      this.$v.form.name.$model=this.persons[index][this.$refs.name.filterby]
    },

    setSurname(index){
      
      this.$v.form.family.$model=this.persons[index][this.$refs.family.filterby]
    },


    onError(error) {
      console.log("Error:", error);
    },
    onSuccess(token) {
      this.token = token;
      console.log("Succeeded:", token);
    },
    onExpired() {
      console.log("Expired");
    },
    async getCaptcha() {
      try {
        const token = await this.$recaptcha.getResponse();
        await this.$recaptcha.reset();
      } catch (error) {
        console.log("Login error:", error);
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null
    },

    async setToken(context) {
      try {
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

      

        // await this.getCaptcha();
        // if (!this.token) return;
        params = { ...params, token: this.token };
        const response = await this.$store.dispatch("registerUser", params);
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
              this.$router.push("/login");
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (response?.status !== 200) {
          this.isErrorMessage = true;
          this.errorMessage = response.data.INFO;
        }
      } catch (e) {
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
        this.setToken(this);
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
@import "~/assets/scss/reg.scss";

.alert{
  border:1px solid orange;
}

.ok{
  border:1px solid red;
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


</style>
