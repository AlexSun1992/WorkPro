<template>
  <div>
    <div>
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
        >
        </b-form-input>

        <button
          id="btn_password_visible"
          type="button"
          class="btn-psw-visible"
          @click="visiblePSW()"
        ></button>
        <b-form-invalid-feedback
          v-for="errMess in executeValidation"
          :key="errMess.errorText"
        >
          {{ errMess.errorText }}
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <div>
      <b-form-group>
        <b-form-input
          id="password2"
          :type="pswVisible2 ? 'text' : 'password'"
          placeholder="Повторите пароль"
          v-model="$v.form.password2.$model"
          @blur="updateField($event)"
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
    updateField(e) {
      this.$v.form.password2.$touch();
      console.log("e:", e);
      if (this.$v.form.$anyError === false) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: this.form.password2,
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
