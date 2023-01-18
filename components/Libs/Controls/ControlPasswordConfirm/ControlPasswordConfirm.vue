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
          type="password"
          placeholder="Пароль"
          v-model="$v.form.password1.$model"
          @blur="$v.form.password1.$touch()"
          :state="validateState('password1')"
          class="form-control"
          data-testid="password1"
        >
        </b-form-input>
        <b-form-invalid-feedback>
          пароль должен содержать не менее 6 символов
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <div>
      <b-form-group>
        <b-form-input
          id="password2"
          type="password"
          placeholder="Повторите пароль"
          v-model="$v.form.password2.$model"
          @blur="$v.form.password2.$touch()"
          :state="validateState('password2')"
          class="form-control"
          data-testid="password2"
        ></b-form-input>
        <b-form-invalid-feedback> пароли не совпадают </b-form-invalid-feedback>
      </b-form-group>
    </div>
  </div>
</template>
<script>
import {
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
} from "bootstrap-vue";
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
  },

  computed: {
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
        minLength: minLength(minLengthPassword),
        maxLength: maxLength(maxLengthPassword),
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
