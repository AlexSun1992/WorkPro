<template>
  <div class="container-fluid">
    <b-row>
      <b-col sm="12" md="6">
        <b-form-group :label="showLabel" label-cols="12">
          <b-form-input
            @input="delayTouch($v.password)"
            :id="Math.random().toString()"
            type="password"
            v-model="v.password.$model"
            :state="validateState('password')"
            placeholder="Пароль"
            @blur="v.password.$touch()"
            autocomplete="new-password"
            :disabled="disabled"
            :tabindex="tabIndex[0]"
          ></b-form-input>
          <b-form-invalid-feedback>Введите пароль.</b-form-invalid-feedback>         
        </b-form-group>
      </b-col>
      <b-col sm="12" md="6" v-if="recovery"></b-col>
      <b-col
        class="password-repeat"
        :class="{ 'mt-0': recovery }"
        sm="12"
        md="6"
      >
        <b-form-group :label="'Повторите пароль'" label-cols="12">
          <b-form-input
            @input="delayTouch($v.password)"
            :id="Math.random().toString()"
            type="password"
            autocomplete="new-password"
            v-model="v.password2.$model"
            :state="validateState('password2')"
            placeholder="Повторите пароль"
            @blur="v.password2.$touch()"
            :disabled="disabled"
            :tabindex="tabIndex[1]"
          ></b-form-input>
          <b-form-invalid-feedback>Повторите пароль</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
      <b-col sm="12" v-if="recovery"></b-col>
    </b-row>
  </div>
</template>

<script>
// import { required, minLength, maxLength, helpers} from 'vuelidate/lib/validators';
// const alpha = helpers.regex(
//   "alpha",
//   /^[a-z]*$/i
// );
// const numeric = helpers.regex(
//   "numeric",
//   /^[1-9]*$/i
// );
// const forbiddeCharacters = helpers.regex(
//   "forbiddeCharacters",
//   /^[^!@#$%^&*]*$/i
// );
// const forbiddenRussianSign = helpers.regex(
//   "forbiddeCharacters",
//   /^[^а-яА-ЯёЁ]*$/i
// );

export default {
  props: ["v", "validateState", "disabled", "recovery", "tabIndex"],
  data() {
    return {
      password: "",
      password2: "",
    };
  },
  // validations: {
  //   password: {
  //     required,
  //     minLength: minLength(6),
  //     maxLength: maxLength(20),
  //     alpha,
  //     numeric,
  //     forbiddeCharacters,
  //     forbiddenRussianSign,
  //   },
    // password2: {
    //   required,
    //   minLength: minLength(6),
    //   maxLength: maxLength(20),
    //   alpha,
    //   numeric,
    //   forbiddeCharacters,
    //   forbiddenRussianSign,
    // }
  //},
  computed: {
    showLabel() {
      return this.recovery ? "Придумайте новый пароль" : "Пароль";
    },
    // validation(){
    //     return{
    //       password: {
    //         required,
    //         minLength: minLength(6),
    //         maxLength: maxLength(20),
    //         alpha,
    //         numeric,
    //         forbiddeCharacters,
    //         forbiddenRussianSign,
    // },
    //     }
    // },
  //   methods: {
  //   delayTouch($v) {
  //     $v.$reset()
  //   }
  // }
  },
};
</script>

<style scoped></style>
