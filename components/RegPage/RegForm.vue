<template>
  <div class="flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-form @submit="onSubmit" v-if="show">
            <b-form-group label="Номер телефона *"  description="Пример номера: +7 XXX XXX XX XX">
              <b-form-input
                v-model="form.phone"
                :disabled="isDisabledPhone"
                type="tel"
                required
                placeholder="Введите номер телефона"
              ></b-form-input>
            </b-form-group>
            <b-form-group v-show="isPhoneButtonConfirm">
              <b-button v-on:click="phoneConfirm" block type="submit" variant="primary">Подтвердить номер</b-button>
            </b-form-group>
            <b-form-group v-show="isPhoneCodeInputConfirm" label="Код подверждения*">
              <b-form-input
                v-model="form.code"
                required
                placeholder="Введите код подверждения"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Фамилия*"
            >
              <b-form-input
                v-model="form.family"
                required
                placeholder="Введите фамилию"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Имя*">
              <b-form-input
                v-model="form.name"
                required
                placeholder="Введите имя"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Отчество*">
              <b-form-input
                v-model="form.patronymic"
                required
                placeholder="Введите отчество"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Дата рождения*">
              <b-form-input
                type="date"
                v-model="form.birthday"
                required
                placeholder="Введите дату рождения"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Номер полиса">
              <b-form-input
                id="input-3"
                v-model="form.policy"
                required
                placeholder="Введите номер полиса"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="E-mail*">
              <b-form-input
                v-model="form.email"
                type="email"
                required
                placeholder="Введите Ваш электронный почтовый ящик"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-4">
              <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
                <b-form-checkbox value="me">Я согласен на обработку персональных данных</b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
            <b-button type="submit" variant="primary">Зарегистрироваться</b-button>
          </b-form>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
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
          policyNumber: '',
          email: ''
        },
        show: true,
        isPhoneCodeInputConfirm: false
      }
    },
    methods: {
      onSubmit (evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.form))
      },
      phoneConfirm () {
        this.isPhoneCodeInputConfirm = true
      }
    },
    computed: {
      isPhoneButtonConfirm: function () {
        return this.form.phone && !this.isPhoneCodeInputConfirm;
      },
      isDisabledPhone: function () {
        return this.isPhoneCodeInputConfirm;
      }
    }
  }
</script>
