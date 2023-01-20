<template>
  <div>
    <span v-if="data.helpText" class="tooltipster">
      (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
        <span v-html="data.helpText"></span></vue-easy-tooltip
    ></span>
    <div>
      <b-form-group>
        <b-form-input
          id="password1"
          :type="pswVisible ? 'text' : 'password'"
          placeholder="Пароль"
          v-model="$v.form.password1.$model"
          @blur="$v.form.password1.$touch()"
          :state="validateState('password1')"
          class="form-control"
          data-testid="password1"
        >
        </b-form-input>

        <button
          id="btn_password_visible"
          type="button"
          class="btn-psw-visible"
          @click="visiblePSW()"
        ></button>
        <!-- <p>execute:{{ executeValidation }}</p> -->
        <b-form-invalid-feedback
          v-for="(errMess, index) in executeValidation"
          :key="index"
        >
          {{ errMess.errorText }}
        </b-form-invalid-feedback>
        <!-- <b-form-invalid-feedback
          v-if="this.$v.form.password1.englishOnly === false"
        >
          Русские символы запрещены
        </b-form-invalid-feedback>

        <b-form-invalid-feedback
          v-if="
            (this.$v.form.password1.$model.length <= 6 ||
              this.$v.form.password1.$model.length >= 20) &&
            this.$v.form.password1.englishOnly === true
          "
        >
          Пароль должен содержать от 6 до 20 символов
        </b-form-invalid-feedback>

        <b-form-invalid-feedback
          v-if="
            this.$v.form.password1.$model.length >= 6 &&
            this.$v.form.password1.$model.length <= 20 &&
            this.$v.form.password1.englishOnly === true &&
            this.$v.form.password1.test === false
          "
        >
          Пароль должен содержать хотя бы одну латинскую букву
        </b-form-invalid-feedback>

        <b-form-invalid-feedback
          v-if="
            this.$v.form.password1.$model.length >= 6 &&
            this.$v.form.password1.$model.length <= 20 &&
            this.$v.form.password1.englishOnly === true &&
            this.$v.form.password1.test === true &&
            this.$v.form.password1.sign === false
          "
        >
          Пароль должен содержать хотя бы одну цифру
        </b-form-invalid-feedback> -->
      </b-form-group>
    </div>
    <div>
      <b-form-group>
        <b-form-input
          id="password2"
          :type="pswVisible2 ? 'text' : 'password'"
          placeholder="Повторите пароль"
          v-model="$v.form.password2.$model"
          @blur="$v.form.password2.$touch()"
          :state="validateState('password2')"
          class="form-control"
          data-testid="password2"
        ></b-form-input>
        <button
          id="btn_password_visible2"
          type="button"
          class="btn-psw-visible"
          @click="visiblePSW2()"
        ></button>
        <b-form-invalid-feedback> пароли не совпадают </b-form-invalid-feedback>
      </b-form-group>
    </div>
  </div>
</template>
<script>
import { BFormGroup, BFormInput, BFormInvalidFeedback } from "bootstrap-vue";
import {
  required,
  sameAs,
  minLength,
  maxLength,
  helpers,
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import {
  minLengthPassword,
  maxLengthPassword,
} from "./regform.helper.fixtures";
import { passwordValidation } from "../../../../components-vue2/src/components/Login/RegForm/regform.helper";

const englishOnly = helpers.regex("englishOnly", /^[a-zA-Z!?@#$%^&*()0-9 ]*$/);
const test = helpers.regex("test", /[a-zA-Z]/);
const sign = helpers.regex("sign", /[0-9]/);

export default {
  name: "PasswordConfirm",
  components: { BFormGroup, BFormInput, BFormInvalidFeedback },
  mixins: [validationMixin],
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      pswVisible2: false,
      pswVisible: false,
      form: {
        password1: "",
        password2: "",
      },
    };
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    visiblePSW() {
      if (this.pswVisible === false) {
        this.pswVisible = true;
      } else {
        this.pswVisible = false;
      }
    },
    visiblePSW2() {
      if (this.pswVisible2 === false) {
        this.pswVisible2 = true;
      } else {
        this.pswVisible2 = false;
      }
    },
  },

  computed: {
    executeValidation() {
      return passwordValidation(this.$v.form.password1);
    },
    disabled() {
      if (
        this.$v.form.password1.$anyError === false &&
        this.$v.form.password1.$model !== "" &&
        this.$v.form.password2.$anyError === false &&
        this.$v.form.password2.$model !== ""
      ) {
        return false;
      }
      return true;
    },
  },

  validations: {
    form: {
      password1: {
        required,
        englishOnly,
        minLength: minLength(minLengthPassword),
        maxLength: maxLength(maxLengthPassword),
        test,
        sign,
      },
      password2: {
        required,
        minLength: minLength(minLengthPassword),
        maxLength: maxLength(maxLengthPassword),
        sameAsPassword: sameAs("password1"),
      },
    },
  },
};
</script>

<style scoped></style>
