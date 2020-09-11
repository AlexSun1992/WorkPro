<template>

  <div class="app cabinet">
    <Header @mini-sidebar="changeMobileSidebar"/>
    <div class="wrapper" v-bind:class="{'sidebar-min': sideBarMini, 'mobile_menu': sideBarMobileMini }">
      <Sidebar @mini-sidebar="changeSidebar" @mini-mobile-sidebar="changeMobileSidebar"  :nav-items="nav"/>
      <div class="body">
        <main class="main">
          <div class="container-fluid">
            <nuxt/>
          </div>
        </main>
      </div>
    </div>
    <Footer/>
  </div>
</template>
<script>
    import Header from '~/components/Pages/Cabinet/Header/Header'
    import Notification from '~/components/Pages/Cabinet/Notification/Notification'
    import Footer from '~/components/Pages/Cabinet/Footer/Footer'
    import Sidebar from '~/components/Pages/Cabinet/Sidebar/Sidebar'
    import breadcrumbs from '~/converters/breadcrumbs'
    export default {
        name: 'full',
        head: {
            title: 'РЕСО-Гарантия'
        },
        components: {
            Header,
            Sidebar,
            Footer,
            Notification
        },
      data () {
        return {
          sideBarMini: false,
          sideBarMobileMini: false
        }
      },
        watch: {
            $route(to, from) {
                if (to.meta === 'Cabinet') {
                  this.sideBarMobileMini = false;
                    this.setParams();
                } else {
                    let url;
                    if (to.path === '/') {
                        url = 'index'
                    }
                    this.$store.dispatch('pages/fetchPageByUrl', url);
                }
            }
        },
        methods: {
            setParams() {
                const bc = breadcrumbs.getData(this.$store.getters['menu/menu'], this.$route.params)
                this.$store.commit('menu/setBreadcrumbs', bc)
                this.$store.dispatch('card/setCard', {
                    page: this.$route.params,
                    settings: bc.slice(-1).pop()
                });
            },
          changeSidebar() {
            this.sideBarMini = !this.sideBarMini
            this.sideBarMobileMini = false
          },
          changeMobileSidebar() {
            this.sideBarMobileMini = !this.sideBarMobileMini
            this.sideBarMini = false;
          },
        },
        computed: {
            nav() {
                return this.$store.getters['menu/menu'][0].children
            },
            name() {
                return this.$route.name
            },
            items() {
                return this.$store.getters['menu/breadcrumbs']
            }
        }
    }
    
</script>
<style lang="scss">
.cabinet { @import '~/assets/scss/style_new.scss'}
.cabinet {
    display: grid;
    grid-template-rows: 80px auto min-content;
    min-height: 100vh;
}

</style>



