<template>
  <header>
    <div class="relative">
      <a href="/" class="header-logo"></a>
      <div class="header-text col-auto mr-auto">
        Страхование на все случаи жизни
      </div>
      <ul class="header-nav col-auto">
        <li class="header-nav-item">
          <button v-on:click="goToNotify()"  type="button" class="header-nav-notifications" />
        </li>
        <li class="header-nav-item">
          <button v-on:click="logout()" type="button" class="header-nav-exit" />
        </li>
        <li class="header-nav-item mobile-menu-btn">
          <button v-on:click="mobileMenu()" type="button" class="header-nav-mobile" />
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'Header',
    methods: {
      mobileMenu() {
        
      },
      logout() {
        try {
          this.$auth.logout();
          window.$nuxt.$cookiz?.remove('url');
          this.$router.push('/')
        } catch (e) {
          console.log(e)
        }
      },
      goToNotify() {
        this.$router.push('/cabinet/55/0/705')
      }
    }
  }
</script>

<style scoped>

</style>
