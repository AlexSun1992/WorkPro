<template>
  <div class="app">
    <Header/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <div class="container-fluid">
          <nuxt />
        </div>
      </main>
    </div>
    <Footer/>
  </div>
</template>
<script>
  import ruMessages from 'devextreme/localization/messages/ru.json';
  import { locale, loadMessages, formatMessage } from "devextreme/localization";
  import nav from './menu'
  import Header from '~/components/Header/Header';
  import Footer from '~/components/Footer';
  import Sidebar from '~/components/Sidebar/Sidebar';
  export default {
    name: 'full',
    head: {
      title: 'РЕСО-Гарантия'
    },
    components: {
      Header,
      Sidebar,
      Footer
    },
    data () {
      return {
        nav: nav.items
      }
    },
    created () {
      loadMessages(ruMessages);
      locale('ru');
    }
  }
</script>

