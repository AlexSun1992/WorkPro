<template>
  <div class="slider-bg pt-4 pb-5">
  <div class="container">
    <div class="row">
      <div class="col-12 block-title">Наши предложения</div>
    </div>
    <div class="row d-block">
      <div class="col-12 p-0">
    <agile :slidesToShow="4" :dots="false">
      <div class="block-slider">
        <div class="block-container block-container-slider">
          <div class="block-title">
            Сезон Renault
          </div>
          <div class="block-description">
            Скидки для новых автомобилей при покупке полиса в офисах компании
          </div>
          <div class="block-img">
            <img src="/img/main/car.svg">
          </div>
          <div class="block-button">
            <a href="" class="btn-icon-right icon-arrow-right">Подробнее</a>
          </div>
        </div>
      </div>
      <div class="block-slider">
        <div class="block-container block-container-slider">
          <div class="block-title">
            Московский хит
          </div>
          <div class="block-description">
            Сэкономьте 35% на страховании автомобилей BMW, AUDI, MERCEDES и другие
          </div>
          <div class="block-img">
            <img src="/img/main/zont.svg">
          </div>
          <div class="block-button">
            <a href="" class="btn-icon-right icon-arrow-right">Подробнее</a>
          </div>
        </div>
      </div>
      <div class="block-slider">
        <div class="block-container block-container-slider">
          <div class="block-title">
            Домовой-Экспресс
          </div>
          <div class="block-description">
            <span>9 800 ₽/год</span>
            Страхование квартиры от всех рисков
          </div>
          <div class="block-img">
            <img src="/img/main/house.svg">
          </div>
          <div class="block-button">
            <a href="" class="btn-icon-right icon-arrow-right">Подробнее</a>
          </div>
        </div>
      </div>
      <div class="block-slider">
        <div class="block-container block-container-slider">
          <div class="block-title">
            ваплывждп ывжадлп
          </div>
          <div class="block-description">
            dfklsad;lfk ;asdfk ;asdk f;askdf;askdf;lkas fkasdf;kas df;lk as;dfk ;askd f;ask df;kas f;k asf;k as;fkas ;dfkj as df;lk
          </div>
          <div class="block-img">
            <img src="">
          </div>
          <div class="block-button">
            <a href="">1</a>
            <a href="">1</a>
          </div>
        </div>
      </div>
      <div class="block-slider">
        <div class="block-container block-container-slider">
          <div class="block-title">
            Доктор РЕСО
          </div>
          <div class="block-description">
            <span>от 11 700 ₽/год</span>
            Лечение у лучших врачей сети MedSwiss
          </div>
          <div class="block-img">
            <img src="/img/main/heart.svg">
          </div>
          <div class="block-button">
            <a href="" class="btn-icon-right icon-arrow-right">Подробнее</a>
          </div>
        </div>
      </div>
    </agile>
  </div>
    </div>
 </div>
 </div>
</template>

<script>
    export default {
        layout: 'DemoMainPageLayout',
        name: 'DemoPage',
        head: {
            title: 'Демонстрационная страница'
        }
    }
</script>

<style scoped>
    .block-slider {
        padding: 0 15px 40px;
    }
    
    .slider-bg {
        background-color: #F5F8F6;
    }
</style>