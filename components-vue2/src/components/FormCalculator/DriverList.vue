<template>
  <div>
    <b-form-row>
      <b-form-group class="col-md-3" label="Возраст: ">
        <span>{{ driver.age }}</span>
      </b-form-group>

      <b-form-group class="col-md-3" label="Стаж: ">
        <span>{{ driver.standing }}</span>
      </b-form-group>

      <b-form-group class="col-md-3" label="КБМ, сколько лет без аварий?">
        <span>{{ driver.experiences }}</span>
      </b-form-group>
    </b-form-row>

    <b-form-row @submit.prevent>
      <b-form-group class="col-md-3" label="Возраст">
        <b-form-input
          v-model="driver.age"
          @input="$emit('update', driver.age)"
          type="number"
        ></b-form-input>
      </b-form-group>

      <b-form-group class="col-md-3" label="Стаж">
        <b-form-input
          v-model="driver.standing"
          @input="$emit('update', driver.standing)"
          type="number"
        ></b-form-input>
      </b-form-group>

      <b-form-group class="col-md-3" label="КБМ, сколько лет без аварий?">
        <b-form-select
          v-model="driver.experience"
          @input="$emit('update', driver.experience)"
          class="mb-3"
        >
          <b-form-select-option
            v-for="item in driver.experiences"
            :key="item.id"
            >{{ item.text }}</b-form-select-option
          >
        </b-form-select>
      </b-form-group>
    </b-form-row>
    <a href="#"
      ><span @click="addDriver">+ Добавить еще одного водителя</span></a
    >
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
    return {
      driver: {
        age: "",
        standing: "",
        experiences: [
          { id: 1, text: "" },
          { id: 2, text: "Страхуюсь впервые" },
          { id: 3, text: "1 год" },
          { id: 4, text: "2 года" },
          { id: 5, text: "3 года" },
          { id: 6, text: "4 года" },
          { id: 7, text: "5 лет" },
          { id: 8, text: "6 лет" },
          { id: 9, text: "7 лет" },
          { id: 10, text: "8 лет" },
          { id: 11, text: "9 лет" },
          { id: 12, text: "10 лет" },
          { id: 13, text: "Был в ДТП менее года назад" },
        ],
      },
      drivers: [],
    };
  },

  methods: {
    addDriver() {
      // const newDriver = {
      //   age: this.age,
      //   standing: this.standing,
      //   experience: this.driver.experiences.text,
      // };
      // console.log(newDriver);
      // this.drivers.push(newDriver);
    },
  },

  computed: {},
  created() {
    console.log(this.driver.experiences);
  },
};
</script>

<style lang="scss" scoped></style>
