<template>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-8">
          <div class="row">
            <div v-for="item in footer" :key="item.title" :class="item.class">
              <div v-for="section in item.sections" :key="section.title" :class="section.class">
                <a href="">{{section.title}}</a>
                <div class="priduct_link">
                  <a v-for="link in section.links" :key="link.link.title" :href="link.link.url" :target="link.link.target">{{link.link.title}}</a>
                </div>
              </div>
            </div>
          </div>
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
</template>
<script>
  export default {
    name: 'c-footer',
    computed: {
      footer () {
        return this.$store.getters['pages/getFooterMenu']
      }
    }
  }
</script>

<style scoped lang="scss">
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
</style>
