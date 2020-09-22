<template>
  <div class="main_page">
    <MainHeader/>
    <main>
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="block-container block-container-big mt-1_25">
              <div class="block-title">
                ваплывждп ывжадлп
              </div>
              <div class="block-description">
                <strong>dfklsad;lfk ;asdfk ;asdk</strong> f;askdf;askdf;lkas fkasdf;kas df;lk as;dfk
                ;askd f;ask df;kas f;k asf;k as;fkas ;dfkj as df;lk
              </div>
              <div class="block-img">
                <img src="">
              </div>
              <div class="block-button">
                <a href="" class="btn-icon-right icon-arrow-right">Каско</a>
                <a href="" class="btn-icon-right icon-arrow-right">ОСАГО</a>
                <a href="" class="btn-icon-right icon-arrow-right">Зеленая карта</a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="buy-block d-flex mt-1_25 justify-content-md-center align-items-center">
            <div class="col-auto pr-0 fsz24 color-white">Я хочу купить полис</div>
            <div class="col-auto pl-0">
              <b-dropdown  class="m-md-2 dpd-link" right>
                <template v-slot:button-content>
                  <span v-text="textSelected ? textSelected : 'ОСАГО'"></span>
                </template>
<b-dropdown-item @click="textSelected = 'ОСАГО';valueSelected = 'osago'" value="osago">ОСАГО
</b-dropdown-item>
<b-dropdown-item @click="textSelected = 'КАСКО';valueSelected = 'casco'" value="casco">КАСКО
</b-dropdown-item>
</b-dropdown>
</div>
<div class="col-auto">
    <b-button type="button" :to="valueSelected ? valueSelected : 'OSAGO'" class="btn-large btn-arrow-right position-relative uppercase d-block">Расчитать
    </b-button>
</div>
</div>
</div>
<div class="row flex-wrap">
    <div class="col-6 d-flex">
        <div class="block-container mt-1_25">
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
                <a href="" class="btn-icon-right icon-arrow-right">Каско</a>
                <a href="" class="btn-icon-right icon-arrow-right">ОСАГО</a>
            </div>
        </div>
    </div>
    <div class="col-6 d-flex">
        <div class="block-container mt-1_25">
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
    <div class="col-6 d-flex">
        <div class="block-container mt-1_25">
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
    <div class="col-6 d-flex">
        <div class="block-container mt-1_25">
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
</div>
<div class="row justify-content-center py-5">
    <div class="col-12">
        <div class="fsz40 fw500 text-center mb-4"><span class="color-green">Страхование</span><br>на все случаи жизни
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
    <div class="col-7 mt-2 text-center">
        Мы обеспечиваем качество и скорость работы с нашими клиентами и тратим много усилий, чтобы каждый год улучшать этот показатель.
        <br><br>
        <div class="block-button">
            <a href="" class="btn-icon-right icon-arrow-right">О компании</a>
        </div>
    </div>
</div>
</div>
</main>

<nuxt/>
<div class="container py-5">
    <div class="row">
        <div class="col-6 d-flex">
            <div class="block-container block-container-four">
                <div class="block-title">
                    Школа обучения страхованию
                </div>
                <div class="block-description">
                    Лучшая школа страхования в Россииприглашает всех желающих стать профессионалом страхового бизнеса

                    <div class="bcf-h-line"></div>

                </div>

                <div class="block-img">
                    <img src="/img/main/znak.svg">
                </div>
                <div class="block-button">
                    <a href="" class="btn-icon-right icon-arrow-right">Записаться на обучение</a>
                </div>
            </div>
        </div>
        <div class="col-6 d-flex">
            <div class="block-container block-container-four">
                <div class="block-title">
                    Найдите своего страхового агента
                </div>
                <div class="block-description">
                    <span>У нас работают свыше 27 тысяч агентов и брокеров. </span> Вы можете проконсультироваться со страховым агентом, который находиться рядом с вами. Выбрать того, кто вам понятнее и ближе по духу.

                </div>
                <div class="block-img">
                    <img src="/img/main/portfel.svg">
                </div>
                <div class="block-button">
                    <a href="" class="btn-icon-right icon-arrow-right">узнать больше</a>

                </div>
            </div>
        </div>
    </div>
</div>
</div>
</template>

<script>
    import MainHeader from '~/components/Pages/Main/Header/MainHeader'

    export default {
        name: 'DemoMainPageLayout',
        data() {
            return {
                counter: 0,
                textSelected: null,
                valueSelected: null,
            }
        },
        components: {
            MainHeader
        }
    }
</script>

<style lang="scss">
    .main_page {
        @import '~/assets/scss/main.scss'
    }
</style>