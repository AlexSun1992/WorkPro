<template>
  <div>
    <div v-for="driver in driverList" :key="driver.id">
      <b-form-row @submit.prevent>
        <b-form-group class="col-md-3" label="Возраст">
          <b-form-input type="number" :value="driver.age"></b-form-input>
        </b-form-group>

        <b-form-group class="col-md-3" label="Стаж">
          <b-form-input type="number" :value="driver.experience"></b-form-input>
        </b-form-group>

        <b-form-group class="col-md-3" label="КБМ, сколько лет без аварий?">
          <b-form-input :value="driver.kbm"></b-form-input>
        </b-form-group>

        <b-form-select v-model="selectKbm.selected">
          <b-form-select-option
            v-for="item in selectKbm.optionsKbm"
            :key="item.id"
            :value="item.text"
            >{{ item.text }}</b-form-select-option
          >
        </b-form-select>
      </b-form-row>
      <a href="#"><span @click="removeDriver">+ удалить водителя</span></a>
      <hr />
    </div>
    <hr />

    <div>
      <b-form-row>
        <b-form-group class="col-md-3" label="Возраст">
          <b-form-input v-model="driver.age" type="number"></b-form-input>
        </b-form-group>

        <b-form-group class="col-md-3" label="Стаж">
          <b-form-input
            v-model="driver.experience"
            type="number"
          ></b-form-input>
        </b-form-group>

        <b-form-group class="col-md-3" label="КБМ, сколько лет без аварий?">
          <b-form-select v-model="selectKbm.selected">
            <b-form-select-option
              v-for="item in selectKbm.optionsKbm"
              :key="item.id"
              :value="item.text"
              >{{ item.text }}</b-form-select-option
            >
          </b-form-select>
        </b-form-group>
      </b-form-row>

      <a href="#"
        ><span @click="addDriver">+ Добавить еще одного водителя</span></a
      >
    </div>
    <hr color="black" />
    <div>
      {{ driverList }}
    </div>
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
        id: "",
        age: "",
        experience: "",
        kbm: null,
      },
      driverList: [],
      selectKbm: {
        selected: null,
        optionsKbm: [
          { id: 1, text: "Страхуюсь впервые" },
          { id: 2, text: "1 год" },
          { id: 3, text: "2 года" },
          { id: 4, text: "3 года" },
          { id: 5, text: "4 года" },
          { id: 6, text: "5 лет" },
          { id: 7, text: "6 лет" },
          { id: 8, text: "7 лет" },
          { id: 9, text: "8 лет" },
          { id: 10, text: "9 лет" },
          { id: 11, text: "10 лет и более" },
          { id: 12, text: "был в ДТП менее года назад" },
        ],
      },
    };
  },
  methods: {
    addDriver() {
      const newDriver = {
        id: Date.now(),
        age: this.driver.age,
        experience: this.driver.experience,
        kbm: this.selectKbm.selected,
      };
      this.driverList.push(newDriver);
      this.driver.age = "";
      this.driver.experience = "";
      this.selectKbm.selected = null;
    },
    removeDriver() {
      // this.driverList.find((e) => e.driver.id);
    },
  },
  // computed: {},
  // created() {},
};
</script>

<style lang="scss" scoped></style>
