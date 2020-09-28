<template>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-5  menu-link">
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
        <div class="col-3 block-v-line menu-link">
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
          <div class="info mb-2">СПАО «РЕСО-Гарантия» раскрывает информацию на странице в сети Интернет информационного агентства, аккредитованного ЦБ РФ на раскрытие информации, по адресу: <a href="http://www.disclosure.ru/issuer/7710045520/">http://www.disclosure.ru/issuer/7710045520/</a></div>
          <div class="info_ppl mb-2">Информация об акционерах и лицах, под контролем или значительным влиянием которых находится страховщик на 17.12.2018 год</div>
          <div class="copyright">© 2020, «РЕСО-Гарантия»&nbsp;&nbsp;&nbsp;&nbsp;<a href="">Конфиденциальность</a></div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'c-footer',
  computed: {
    footer() {
      return this.$store.getters["pages/getFooterMenu"];
    }
  }
}
</script>

<style scoped lang="scss">

</style>
