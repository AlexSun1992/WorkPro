<template>
  <div>
    <!-- отрисовка списка водителей-->
    <div
      v-for="(driver, index) in driverList"
      :key="driver.id"
    >
      <b-form-row>
        <b-form-group
          class="col-md-3"
          label="Возраст"
        >
          <b-form-input
            type="number"
            :value="driver.age"
          />
        </b-form-group>

        <b-form-group
          class="col-md-3"
          label="Стаж"
        >
          <b-form-input
            type="number"
            :value="driver.experience"
          />
        </b-form-group>

        <b-form-group
          class="col-md-3"
          label="КБМ, сколько лет без аварий?"
        >
          <b-form-select v-model="driver.selectKbm.selected">
            <b-form-select-option
              v-for="item in driver.selectKbm.optionsKbm"
              :key="item.id"
              :value="item.text"
              >{{ item.text }}</b-form-select-option
            >
          </b-form-select>
        </b-form-group>
      </b-form-row>
      <a href="#"><span @click="removeDriver(index)">Удалить водителя</span></a>
    </div>
    <div>
      <!-- форма списка водителей -->
      <b-form-row>
        <b-form-group
          class="col-md-3"
          label="Возраст"
        >
          <b-form-input
            v-model="driver.age"
            type="number"
          />
        </b-form-group>

        <b-form-group
          class="col-md-3"
          label="Стаж"
        >
          <b-form-input
            v-model="driver.experience"
            type="number"
          />
        </b-form-group>

        <b-form-group
          class="col-md-3"
          label="КБМ, сколько лет без аварий?"
        >
          <b-form-select v-model="driver.selectKbm.selected">
            <b-form-select-option
              v-for="item in driver.selectKbm.optionsKbm"
              :key="item.id"
              :value="item.text"
              >{{ item.text }}</b-form-select-option
            >
          </b-form-select>
        </b-form-group>
      </b-form-row>

      <a href="#"><span @click="addAge">+ Добавить еще одного водителя</span></a>
    </div>
    <div>
      {{ driverList }}
    </div>
  </div>
</template>

<script>
import { BFormInput, BFormSelect, BFormSelectOption, BFormRow, BFormGroup } from "bootstrap-vue";

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
    // моделька водителя
    return {
      driver: {
        id: "",
        age: "",
        experience: "",
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
      },
      driverList: [],
    };
  },
  methods: {
    // добавление водителя в список
    addAge() {
      const newDriver = {
        id: Date.now(),
        age: this.driver.age,
        experience: this.driver.experience,
        selectKbm: { ...this.driver.selectKbm },
      };
      if (
        newDriver.id !== "" &&
        newDriver.age !== "" &&
        newDriver.experience !== "" &&
        newDriver.selectKbm.selected !== null
      ) {
        this.driverList.push(newDriver);
        this.driver.age = "";
        this.driver.experience = "";
        this.driver.selectKbm.selected = null;
      } else {
        console.log("ошибка: добавленны пустые значения!");
      }
    },
    // уделение водителя из списка
    removeDriver(index) {
      this.driverList.splice(index, 1);
    },
  },
  // computed: {},components-vue2/src/components/FormCalculator/DriverList.vue
  // created() {},
};
</script>
