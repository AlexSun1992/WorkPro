<template>
  <div>
    <VerifyPhone :count="20" @onCode="code = $event"/>
    <div v-if="code">
       <b-form-input
          class="mb-2 mt-4"
          v-model="newPassword"
          placeholder="Новый пароль"
        ></b-form-input>
        <b-form-input id="input-1" v-model="repeatPassword" placeholder="Повторите пароль"></b-form-input>
        <b-button class="mt-2" type="submit" :disabled="isPasswordIdentical" variant="success">Продолжить</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VerifyPhone from '../VerifyPhone/VerifyPhone.vue';

@Component({
  name: "PasswordReset",
  components: {
      VerifyPhone
  }
})
export default class PasswordReset extends Vue {
  code: string = '';
  newPassword: string = '';
  repeatPassword: string = '';

  get isPasswordIdentical() {
    if (this.newPassword.length == 0 || (this.newPassword != this.repeatPassword)) {
      return true;
    }
  }
}
</script>

<style scoped>
</style>