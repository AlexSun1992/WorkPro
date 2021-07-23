<template>
  <div>
    <div class="wrapper">
      <div class="item">
        <label for="">Возраст</label>
        <b-form-input v-model="number"></b-form-input>
      </div>

      <div class="item">
        <label for="">Стаж</label>
        <b-form-input v-model="number"></b-form-input>
      </div>

      <div class="item select">
        <label for="">КБМ, сколько лет без аварий?</label>
        <b-form-select v-model="selected" class="mb-3">
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
      </div>
    </div>
    <a href="#"><span>+ Добавить еще одного водителя</span></a>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
input,
select {
  border: none;
}
label {
  margin: 10px;
}
span {
  color: #0f4d21;
  border-bottom: 1px solid #0f4d21;
}
a {
  text-decoration: none;
}
.wrapper {
  display: flex;
  justify-content: space-around;
}
.item {
  border: 1px solid #858585;
  border-radius: 10px;
}
.select {
  display: flex;
  flex-direction: column;
}
</style>
