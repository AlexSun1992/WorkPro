<template>
  <div class="slider-bg pt-4 pb-5">
    <div class="container-lg">
      <VueSlickCarousel v-bind="settings_one">
        <div class="text-center">
          <div class="diagramm-block">
            <div class="diagramm-img"><span>11</span>млн.</div>
            <div class="diagramm-discription">Клиентов во всем мире</div>
          </div>
        </div>
        <div class="text-center">
          <div class="diagramm-block">
            <div class="diagramm-img"><span>1200</span></div>
            <div class="diagramm-discription">Офисов в России</div>
          </div>
        </div>
        <div class="text-center">
          <div class="diagramm-block">
            <div class="diagramm-img"><span>3</span></div>
            <div class="diagramm-discription">Место на рынке</div>
          </div>
        </div>
        <div class="text-center">
          <div class="diagramm-block">
            <div class="diagramm-img">№<span>1</span></div>
            <div class="diagramm-discription">Народная марка в России</div>
          </div>
        </div>
      </VueSlickCarousel>
    </div>
    <div class="container">
      <div class="row slider-list">
        <div class="col-8 block-title">Наши предложения</div>
        <div class="col-4">
          <div class="row slider-list justify-content-end">
            <div class="col-auto">
              <a href="">Смотреть все</a>
            </div>
            <div class="col-auto">
              <div
                @click="$refs.wrapper.goToPrev()"
                class="slider-arrow-prev"
                v-bind:class="{ disabled: isButtonLeftDisabled }"
              ></div>
              <div
                @click="$refs.wrapper.goToNext()"
                class="slider-arrow-next"
                v-bind:class="{ disabled: isButtonRightDisabled }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row d-block">
        <div class="col-12 p-0">
          <carousel-wrapper ref="wrapper" :slides="4">
            <div class="block-slider">
              <div class="block-container block-container-slider">
                <div class="block-title">Сезон Renault123</div>
                <div class="block-description">
                  Скидки для новых автомобилей при покупке полиса в офисах
                  компании
                </div>
                <div class="block-img">
                  <img src="/img/main/car.svg" />
                </div>
                <div class="block-button">
                  <a href="" class="btn-icon-right icon-arrow-right"
                    >Подробнее</a
                  >
                </div>
              </div>
            </div>
            <div class="block-slider">
              <div class="block-container block-container-slider">
                <div class="block-title">Московский хит</div>
                <div class="block-description">
                  Сэкономьте 35% на страховании автомобилей BMW, AUDI, MERCEDES
                  и другие
                </div>
                <div class="block-img">
                  <img src="/img/main/zont.svg" />
                </div>
                <div class="block-button">
                  <a href="" class="btn-icon-right icon-arrow-right"
                    >Подробнее</a
                  >
                </div>
              </div>
            </div>
            <div class="block-slider">
              <div class="block-container block-container-slider">
                <div class="block-title">Домовой-Экспресс</div>
                <div class="block-description">
                  <span>9 800 ₽/год</span>
                  Страхование квартиры от всех рисков
                </div>
                <div class="block-img">
                  <img src="/img/main/house.svg" />
                </div>
                <div class="block-button">
                  <a href="" class="btn-icon-right icon-arrow-right"
                    >Подробнее</a
                  >
                </div>
              </div>
            </div>
            <div class="block-slider">
              <div class="block-container block-container-slider">
                <div class="block-title">Доктор РЕСО</div>
                <div class="block-description">
                  <span>от 11 700 ₽/год</span>
                  Лечение у лучших врачей сети MedSwiss
                </div>
                <div class="block-img">
                  <img src="/img/main/heart.svg" />
                </div>
                <div class="block-button">
                  <a href="" class="btn-icon-right icon-arrow-right"
                    >Подробнее</a
                  >
                </div>
              </div>
            </div>
          </carousel-wrapper>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  layout: "DemoMainPageLayout",
  name: "DemoPage",
  head: {
    title: "Демонстрационная страница",
  },
  computed: {
    ...mapGetters("slider", ["isButtonLeftDisabled", "isButtonRightDisabled"]),
  },
  data() {
    return {
      settings_one: {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        arrows: false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              dots: true,
              centerMode: true,
              centerPadding: "20px",
              infinite: true,
              variableWidth: true,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
              centerMode: true,
              centerPadding: "20px",
              infinite: true,
              variableWidth: true,
            },
          },
          {
            breakpoint: 370,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
              centerMode: true,
              centerPadding: "20px",
              infinite: true,
              variableWidth: true,
            },
          },
        ],
      },
    };
  },
};
</script>

<style scoped></style>
