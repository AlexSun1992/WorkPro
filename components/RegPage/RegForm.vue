<template>
  <div class="flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" lg="4">
          <b-form @submit="onSubmit" v-if="show">
            <b-form-group>
              <b-form-input
                v-model="form.phone"
                :disabled="isDisabledPhone"
                type="tel"
                required
                placeholder="Телефон"
              >
              </b-form-input>
              <div v-show="isPhoneCodeInputConfirm">
                <b-button v-on:click="changePhone" variant="link">Изменить номер</b-button>
                <div>Код подверждения отправлен на указанный номер</div>
              </div>
            </b-form-group>
            <b-form-group v-show="isPhoneCodeInputConfirm">
              <b-form-input
                type="number"
                v-model="form.code"
                required
                placeholder="Код подверждения"
              ></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-group v-show="isPhoneButtonConfirm">
                <b-button v-on:click="phoneConfirm" block type="submit" variant="primary">Подтвердить номер</b-button>
              </b-form-group>
              <b-form-group>
                <b-form-input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="E-mail"
                ></b-form-input>
              </b-form-group>
              <b-form-input
                v-model="form.family"
                required
                placeholder="Фамилия"
              ></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-input
                v-model="form.name"
                required
                placeholder="Имя"
              ></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-input
                v-model="form.patronymic"
                required
                placeholder="Отчество"
              ></b-form-input>
            </b-form-group>
            <b-form-group>
              <birthday-picker/>
            </b-form-group>
            <b-form-group>
              <b-form-input
                id="input-3"
                v-model="form.policy"
                placeholder="Номер полиса"
              ></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-input
                type="password"
                v-model="form.password"
                placeholder="Пароль"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group>
              <b-form-input
                type="password"
                v-model="form.repassword"
                placeholder="Повторите пароль"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-4">
              <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
                <b-form-checkbox required value="true" unchecked-value="false">Я согласен на обработку персональных
                  данных
                </b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
            <b-button :disabled="form.checked === 'true'" type="submit" variant="primary">Зарегистрироваться</b-button>
          </b-form>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

  import birthdayPicker from '../Libs/birthdayPicker.vue'

  export default {
    data () {
      return {
        form: {
          phone: '',
          email: '',
          family: '',
          name: '',
          patronymic: '',
          birthday: '',
          policyNumber: ''
        },
        show: true,
        isPhoneCodeInputConfirm: false
      }
    },
    components: {birthdayPicker},
    methods: {
      onSubmit (evt) {
        evt.preventDefault()
        alert(JSON.stringify((this as any).form))
      },
      phoneConfirm () {
        (this as any).isPhoneCodeInputConfirm = true
      },
      changePhone () {
        (this as any).isPhoneCodeInputConfirm = false;
        (this as any).form.phone = '';
        (this as any).form.code = '';
      }
    },
    computed: {
      isPhoneButtonConfirm: function () {
        return regex.test((this as any).form.phone) && !(this as any).isPhoneCodeInputConfirm
      },
      isDisabledPhone: function () {
        return (this as any).isPhoneCodeInputConfirm
      }
    }
  }
</script>
