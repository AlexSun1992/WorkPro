<template>
  <div class="row">
    <div class="col-12 col-lg-6">
      <b-form-group>
        <legend>
          Новый пароль
          <span class="tooltipster">
            (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
              <span>{{ tooltipValidation }}</span></vue-easy-tooltip
            ></span
          >
        </legend>
        <b-form-input
          id="password1"
          :type="pswVisible ? 'text' : 'password'"
          placeholder="Пароль"
          v-model="$v.form.password1.$model"
          @blur="$v.form.password1.$touch()"
          :state="validateState('password1')"
          class="form-control"
          data-testid="password1"
          @input="updateValue($event)"
        >
        </b-form-input>
        <button
          id="btn_password_visible"
          type="button"
          class="btn-psw-visible"
          @click="visiblePSW()"
        ></button>
        <div class="invalid-feedback">
          <b-form-invalid-feedback
            class="d-block"
            v-for="errMess in executeValidation"
            :key="errMess.errorText"
          >
            {{ errMess.errorText }}
          </b-form-invalid-feedback>
        </div>
      </b-form-group>
    </div>
    <div class="col-12 col-lg-6 mt-3 mt-lg-0">
      <b-form-group>
        <legend>Повторите пароль</legend>
        <b-form-input
          id="password2"
          :type="pswVisible2 ? 'text' : 'password'"
          placeholder="Повторите пароль"
          v-model="$v.form.password2.$model"
          @blur="$v.form.password2.$touch()"
          :state="validateState('password2')"
          class="form-control"
          data-testid="password2"
          @input="updateValue($event)"
          @focus="checkSamePassword"
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
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import {
  minLengthPassword,
  maxLengthPassword,
} from "./regform.helper.fixtures";
import {
  passwordValidation,
  tooltipText,
} from "../../../../components-vue2/src/components/Login/RegForm/regform.helper";

export default {
  name: "ControlPasswordConfirm",
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
    checkSamePassword() {
      if (
        this.$v.form.password2.sameAsPassword === false &&
        this.$v.form.password1.$model !== ""
      ) {
        this.$v.form.password2.$touch();
      }
    },
    updateValue(val) {
      if (passwordValidation(val).length === 0) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: val,
          errorMessageValidate: () =>
            this.executeValidation.map((text) => text.errorText),
        });
      }
      if (passwordValidation(val).length !== 0) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: "",
          errorMessageValidate: () =>
            this.executeValidation.map((text) => text.errorText),
        });
      }
    },

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
      return passwordValidation(this.$v.form.password1.$model);
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
    tooltipValidation() {
      return tooltipText;
    },
  },

  validations: {
    form: {
      password1: {
        required,
        isPasswordValid: (value) => passwordValidation(value).length === 0,
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
