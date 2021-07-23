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

        <b-form-input list="my-list-id"></b-form-input>

        <datalist id="my-list-id">
          <option>Страхуюсь впервые</option>
          <option>1 год</option>
          <option>2 года</option>
          <option>3 года</option>
          <option>4 года</option>
          <option>5 лет</option>
          <option>6 лет</option>
          <option>7 лет</option>
          <option>8 лет</option>
          <option>9 лет</option>
          <option>10 лет и более</option>
          <option>Был в ДТП менее года назад</option>
        </datalist>
      </div>
    </div>
    <b-button variant="light">+ добавить еще одного водителя</b-button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
input {
  border: none;
}
.wrapper {
  display: flex;
  justify-content: space-around;
}
.item {
  border: 1px solid black;
  border-radius: 5px;
}
.select {
  display: flex;
  flex-direction: column;
}
</style>
