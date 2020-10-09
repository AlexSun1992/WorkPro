<template>
  <div class="main_page">
    <MainHeader />
    <main>
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="block-container block-container-big mt-1_25">
              <div class="block-title">Автострахование</div>
              <div class="block-description">
                <strong>Полис — это уверенность и спокойствие.</strong>
                Уверенность в том, что мы всегда отремонтируем ваш автомобиль
                или выплатим страховую компенсацию.
              </div>
              <div class="block-img">
                <img src="/img/slide-1.svg" />
              </div>
              <div class="block-button">
                <a href="" class="btn-icon-right icon-arrow-right">Каско</a>
                <a href="" class="btn-icon-right icon-arrow-right">ОСАГО</a>
                <a href="" class="btn-icon-right icon-arrow-right"
                  >Зеленая карта</a
                >
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            class="buy-block d-flex mt-1_25 justify-content-md-center align-items-center"
          >
            <div class="col-auto pr-0 fsz24 color-white">
              Я хочу купить полис
            </div>
            <div class="col-auto pl-0">
              <b-dropdown class="m-md-2 dpd-link" right>
                <template v-slot:button-content>
                  <span v-text="textSelected ? textSelected : 'ОСАГО'"></span>
                </template>
                <b-dropdown-item
                  @click="
                    textSelected = 'ОСАГО';
                    valueSelected = 'osago';
                  "
                  value="osago"
                  >ОСАГО
                </b-dropdown-item>
                <b-dropdown-item
                  @click="
                    textSelected = 'КАСКО';
                    valueSelected = 'casco';
                  "
                  value="casco"
                  >КАСКО
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <div class="col-auto">
              <b-button
                type="button"
                :to="valueSelected ? valueSelected : 'OSAGO'"
                class="btn-large btn-arrow-right position-relative uppercase d-block"
                >Расчитать
              </b-button>
            </div>
          </div>
        </div>
        <div class="row flex-wrap">
          <div class="col-6 d-flex">
            <div class="block-container mt-1_25">
              <div class="block-title">Страхование туристов</div>
              <div class="block-description">
                Путешествуйте по России и за рубежом с надежной защитой своего
                здоровья. Только до конца мая скидка 25% по промокоду CORONA
              </div>
              <div class="block-img">
                <img src="/img/slide-2.svg" />
              </div>
              <div class="block-button">
                <a href="" class="btn-icon-right icon-arrow-right"
                  >Узнать больше</a
                >
                <a href="" class="btn-icon-right icon-arrow-right"
                  >Купить полис</a
                >
              </div>
            </div>
          </div>
          <div class="col-6 d-flex">
            <div class="block-container mt-1_25">
              <div class="block-title">
                Добровольное медицинское страхование
              </div>
              <div class="block-description">
                Полис для взрослых «Доктор РЕСО» и самых маленьких «Доктор
                РЕСО.Престиж» - позволят получать медицинскую помощь у лучших
                специалистов
              </div>
              <div class="block-img">
                <img src="/img/slide-3.svg" />
              </div>
              <div class="block-button">
                <a href="" class="btn-icon-right icon-arrow-right"
                  >Узнать больше</a
                >
                <a href="" class="btn-icon-right icon-arrow-right">Купить</a>
              </div>
            </div>
          </div>
          <div class="col-6 d-flex">
            <div class="block-container mt-1_25">
              <div class="block-title">Страхование дач</div>
              <div class="block-description">
                Все, что может сгореть; все, что могут украсть, испортить,
                разрушить, залить водой, можно застраховать по полису
                «РЕСО-Дом».
              </div>
              <div class="block-img">
                <img src="/img/slide-4.svg" />
              </div>
              <div class="block-button">
                <a href="" class="btn-icon-right icon-arrow-right"
                  >Узнать больше</a
                >
                <a href="" class="btn-icon-right icon-arrow-right">Купить</a>
              </div>
            </div>
          </div>
          <div class="col-6 d-flex">
            <div class="block-container mt-1_25 block-container-center">
              <div class="block-title">Все страховые продукты</div>
              <div class="block-description">
                У нас широкая линейка продуктов, поэтому мы легко подберем для
                вас оптимальную страховую программу. Узнайте что мы можем вам
                предложить.
              </div>
              <div class="block-img">
                <img src="/img/slide-5.svg" />
              </div>
              <div class="block-button">
                <a href="" class="btn-icon-right icon-arrow-right"
                  >Весь список продуктов</a
                >
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center py-5">
          <div class="col-12">
            <div class="fsz40 fw500 text-center mb-4">
              <span class="color-green">Страхование</span><br />на все случаи
              жизни
            </div>
          </div>
          <div class="col-3 text-center">
            <div class="diagramm-block">
              <div class="diagramm-img"><span>11</span>млн.</div>
              <div class="diagramm-discription">Клиентов во всем мире</div>
            </div>
          </div>
          <div class="col-3 text-center">
            <div class="diagramm-block">
              <div class="diagramm-img"><span>1200</span></div>
              <div class="diagramm-discription">Офисов в России</div>
            </div>
          </div>
          <div class="col-3 text-center">
            <div class="diagramm-block">
              <div class="diagramm-img"><span>3</span></div>
              <div class="diagramm-discription">Место на рынке</div>
            </div>
          </div>
          <div class="col-3 text-center">
            <div class="diagramm-block">
              <div class="diagramm-img">№<span>1</span></div>
              <div class="diagramm-discription">Народная марка в России</div>
            </div>
          </div>
          <div class="col-12">
            <div class="diagramm-line pt-4 mb-2"></div>
          </div>
          <div class="col-7 mt-2 text-center text-shadow fw-light">
            Мы обеспечиваем качество и скорость работы с нашими клиентами и
            тратим много усилий, чтобы каждый год улучшать этот показатель.
            <br /><br />
          </div>
          <div class="col-12 text-center">
            <div class="block-button">
              <a href="" class="btn-icon-right icon-arrow-right">О компании</a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <nuxt />
    <div class="container py-5">
      <div class="row">
        <div class="col-6 d-flex">
          <div class="block-container block-container-four">
            <div class="block-title">Школа обучения страхованию</div>
            <div class="block-description">
              Лучшая школа страхования в Россииприглашает всех желающих стать
              профессионалом страхового бизнеса
              <div class="block-h-line mt-4"></div>
              <div class="row py-3">
                <div class="col-5 block-v-line">
                  <span>Москва</span> с 20 апреля (онлайн)
                </div>
                <div class="col-7">
                  <span>Санкт-Петербург</span> c 6 апреля (онлайн)
                </div>
              </div>
            </div>
            <div class="block-img">
              <img src="/img/main/znak.svg" />
            </div>
            <div class="block-button">
              <a href="" class="btn-icon-right icon-arrow-right link-btn"
                >Записаться на обучение</a
              >
            </div>
          </div>
        </div>
        <div class="col-6 d-flex">
          <div class="block-container block-container-four">
            <div class="block-title">Найдите своего страхового агента</div>
            <div class="block-description">
              <span>У нас работают свыше 27 тысяч агентов и брокеров. </span> Вы
              можете проконсультироваться со страховым агентом, который
              находиться рядом с вами. Выбрать того, кто вам понятнее и ближе по
              духу.
            </div>
            <div class="block-img">
              <img src="/img/main/portfel.svg" />
            </div>
            <div class="block-button">
              <a href="" class="btn-icon-right icon-arrow-right link-btn"
                >Узнать больше</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <div class="row">
        <div class="col-4 d-flex">
          <div class="block-container block-container-help">
            <div class="block-title">Полезные опции</div>
            <div class="block-img">
              <img src="/img/main/lamp.svg" />
            </div>
            <div class="block-button">
              <a href="" class="btn-icon-right icon-arrow-right">Подробнее</a>
            </div>
          </div>
        </div>
        <div class="col-4 d-flex">
          <div class="block-container block-container-help">
            <div class="block-title">Есть жалобы или предложения?</div>
            <div class="block-img">
              <img src="/img/main/chat.svg" />
            </div>
            <div class="block-button">
              <a href="" class="btn-icon-right icon-arrow-right"
                >Напишите нам</a
              >
            </div>
          </div>
        </div>
        <div class="col-4 d-flex">
          <div class="block-container block-container-help">
            <div class="block-title">+7(495) 730-30-00</div>
            <div class="block-img">
              <img src="/img/main/trubka.svg" />
            </div>
            <div class="block-button">
              <a href="" class="btn-icon-right icon-arrow-right"
                >Перезвоните мне</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div class="container">
        <div class="row">
          <div class="col-8">
            <div class="row">
              <div class="products_all">
                <a href="">Купить полис</a>
                <div
                  class="product menu-auto menu_link_separator mb-4 pb-4 position-relative"
                >
                  <a href="">Авто</a>
                  <div class="priduct_link">
                    <a href="">Осаго</a>
                    <a href="">КАСКО</a>
                    <a href="">Зелень</a>
                  </div>
                </div>
                <div class="product menu-im">
                  <a href="">Имущество</a>
                  <div class="priduct_link">
                    <a href="">КВАРТИРА</a>
                    <a href="">ДОМ</a>
                    <a href="">ИПОТЕКА</a>
                  </div>
                </div>
                <div class="product menu-med">
                  <a href="">Медицина</a>
                  <div class="priduct_link">
                    <a href="">ДМС</a>
                    <a href="">ОМС</a>
                    <a href="">НЕСЧАСТНЫЙ СЛУЧАЙ</a>
                    <a href="">ТУРИЗМ</a>
                    <a href=""
                      >Накопительное инвестиционное страхование жизни</a
                    >
                  </div>
                </div>
              </div>
              <div class="info_all block-v-line active">
                <a href="">РЕсо Гарантия</a>
                <div class="product">
                  <a href="">РЕсо Гарантия</a>
                  <div class="priduct_link">
                    <a href="">О компании</a>
                    <a href="">Новости</a>
                    <a href="">Раскрытие сведений</a>
                    <a href="">Карьера в РЕСО</a>
                    <a href="">Закупки</a>
                    <a href="">Правила и тарифы</a>
                    <a href="">Информация для получателей страховых услуг</a>
                    <a href="">Карта сайта</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-5 menu-link d-none">
            <div class="row">
              <div class="col-5">
                <div class="title">Авто</div>
                <a href="">ОСАГО</a>
                <a href="">КАСКО</a>
                <a href="">ЗЕЛЕНАЯ КАРТА</a>
                <div class="block-h-line w-25 my-4"></div>
                <div class="title">Имущество</div>
                <a href="">КВАРТИРА</a>
                <a href="">ДОМ</a>
                <a href="">ИПОТЕКА</a>
              </div>
              <div class="col-7">
                <div class="title">Жизнь и здоровье</div>
                <a href="">ДМС</a>
                <a href="">ОМС</a>
                <a href="">НЕСЧАСТНЫЙ СЛУЧАЙ</a>
                <a href="">ТУРИЗМ</a>
                <a href="">Накопительное инвестиционное страхование жизни</a>
              </div>
            </div>
          </div>
          <div class="col-3 d-none block-v-line menu-link">
            <div class="title">РЕСО-Гарантия</div>
            <a href="">О компании</a>
            <a href="">Новости</a>
            <a href="">Раскрытие сведений</a>
            <a href="">Карьера в РЕСО</a>
            <a href="">Закупки</a>
            <a href="">Правила и тарифы</a>
            <a href="">Информация для получателей страховых услуг</a>
            <a href="">Карта сайта</a>
          </div>
          <div class="col-4 pl-4">
            <div class="title mb-3">Наши приложения</div>
            <a href="" class="footer-apple"></a>
            <a href="" class="footer-google"></a>
            <div class="title mt-5 mb-3">Мы в социальных сетях</div>
            <div class="social">
              <a href="" class="footer-fb"></a>
              <a href="" class="footer-vk"></a>
              <a href="" class="footer-ok"></a>
              <a href="" class="footer-in"></a>
              <a href="" class="footer-tw"></a>
            </div>
          </div>
          <div class="col-12">
            <div class="block-h-line my-4"></div>
          </div>
          <div class="col-12">
            <div class="info mb-2">
              СПАО «РЕСО-Гарантия» раскрывает информацию на странице в сети
              Интернет информационного агентства, аккредитованного ЦБ РФ на
              раскрытие информации, по адресу:
              <a href="http://www.disclosure.ru/issuer/7710045520/"
                >http://www.disclosure.ru/issuer/7710045520/</a
              >
            </div>
            <div class="info_ppl mb-2">
              Информация об акционерах и лицах, под контролем или значительным
              влиянием которых находится страховщик на 17.12.2018 год
            </div>
            <div class="copyright">
              © 2020, «РЕСО-Гарантия»&nbsp;&nbsp;&nbsp;&nbsp;<a href=""
                >Конфиденциальность</a
              >
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import MainHeader from "~/components/Pages/Main/Header/MainHeader";
import Footer from "~/components/Footer";

export default {
  name: "DemoMainPageLayout",
  data() {
    return {
      counter: 0,
      textSelected: null,
      valueSelected: null,
    };
  },
  components: {
    MainHeader,
    Footer,
  },
};
</script>

<style lang="scss">
/* .main_page {
  @import "~/assets/scss/main.scss";
}

.main_page {
  background-color: #fff;
}

.info_all > a,
.products_all > a {
  display: none;
}

.products_all > a {
  grid-area: title;
}

.menu-med {
  grid-area: med;
}

.menu-auto {
  grid-area: auto;
}

.menu_link_separator:after {
  height: 1px;
  width: 20%;
  background-color: #dee5e0;
  content: "";
  bottom: 0;
  left: 0;
  position: absolute;
}

.menu-im {
  grid-area: im;
}

.products_all {
  columns: 2;
  flex: 0 0 60%;
  max-width: 60%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-areas: "auto med" "im med";
}

.info_all {
  flex: 0 0 40%;
  max-width: 40%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.product > a {
  font-size: 1.125rem;
  line-height: 1.5rem;
  color: #474747;
  font-weight: 500;
  padding-bottom: 0.5rem;
}

.priduct_link a {
  text-transform: uppercase;
  text-decoration: none;
  color: #474747;
  padding: 6px 0;
  display: table;
}
@media (max-width: 767px) {
  .products_all {
    columns: 1;
    flex: 0 0 100%;
    max-width: 100%;
    grid-template-columns: 100%;
    grid-template-areas: "auto" "im" "med";
  }
  .info_all {
    flex: 0 0 100%;
    max-width: 100%;
    position: relative;
    width: 100%;
  }
  .info_all,
  .products_all {
    padding: 20px 0;
    border-bottom: 1px solid red;
    display: block;
  }
  .menu_link_separator:after {
    display: none;
  }
  footer {
    padding: 15px;
  }
  footer .title {
    font-size: 0.825rem;
  }
  .info_all > a,
  .products_all > a {
    display: block;
    font-size: 16px;
    line-height: 20px;
    color: #242424;
  }
  .info_all > a:before,
  .products_all > a:before,
  .info_all > a:after,
  .products_all > a:after {
    content: "";
    background-color: #36ab4d;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    height: 2px;
    width: 10px;
  }
  .info_all > a:before,
  .products_all > a:before {
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    height: 10px;
    width: 2px;
  }

  .info_all:not(.active) .product,
  .products_all:not(.active) .product {
    display: none;
  }
  .priduct_link a {
    display: inline-block;
    margin-right: 9px;
  }
}
*/
</style>
