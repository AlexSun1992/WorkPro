<template>
  <div>
    <b-form-row>
      <b-form-group class="col-md-3" label="Возраст">
        <b-form-input type="number"></b-form-input>
      </b-form-group>

      <b-form-group class="col-md-3" label="Стаж">
        <b-form-input type="number"></b-form-input>
      </b-form-group>

      <b-form-group class="col-md-3" label="КБМ, сколько лет без аварий?">
        <b-form-select class="mb-3">
          <b-form-select-option value="a"
            >Страхуюсь впервые</b-form-select-option
          >
          <b-form-select-option value="a">1 год</b-form-select-option>
          <b-form-select-option value="a">2 года</b-form-select-option>
          <b-form-select-option value="a">3 года</b-form-select-option>
          <b-form-select-option value="a">4 года</b-form-select-option>
          <b-form-select-option value="a">5 лет</b-form-select-option>
          <b-form-select-option value="a">6 лет</b-form-select-option>
          <b-form-select-option value="a">7 лет</b-form-select-option>
          <b-form-select-option value="a">8 лет</b-form-select-option>
          <b-form-select-option value="a">9 лет</b-form-select-option>
          <b-form-select-option value="a">10 лет и более</b-form-select-option>
          <b-form-select-option value="a"
            >Был в ДТП менее года назад</b-form-select-option
          >
        </b-form-select>
      </b-form-group>
    </b-form-row>
    <a href="#"><span>+ Добавить еще одного водителя</span></a>
  </div>
</template>

<script>
import {
  BFormInput,
  BFormSelect,
  BFormSelectOption,
  BFormRow,
  BFormGroup,
} from "bootstrap-vue";

export default {
  name: "LoginButton",
  components: {
    BFormInput,
    BFormSelect,
    BFormSelectOption,
    BFormRow,
    BFormGroup,
  },
  data() {
    return {};
  },

  methods: {},

  computed: {},
  created() {},
};
</script>

<style lang="scss" scoped></style>
