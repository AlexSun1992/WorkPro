<template>
  <header>
    <div class="container">
      <div class="top_menu">
        <div class="float-left">
          <span class="icon-left icon-location"
            ><span class="d-none d-lg-inline-block">Ваш город:</span></span
          >
          <a href="" class="icon-right icon-arrow-small-down color-green pr-3"
            >Москва</a
          >
        </div>
        <div class="float-left">
          <div class="separator32"></div>
        </div>
        <div class="float-left">
          <a href="/contacts" class="icon-left icon-search-office"
            >Найти ближайший офис</a
          >
        </div>
        <div class="float-right">
          <a href="" class="icon-left icon-eye">Версия для слабовидящих</a>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    <div class="container">
      <div class="middle_menu row align-items-center">
        <div class="col-2">
          <a href="/" class="logo"></a>
        </div>
        <div class="col-7">
          <a href="">Купить полис</a><a href="">Страховой случай</a
          ><a href="">Бизнесу</a>
        </div>
        <div class="col-3 text-right">
          <button class="search mr-4"></button>
          <button class="gotolk btn_trn btn-p-sm btn-icon-left">
            Личный кабинет
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "MainHeader",
};
</script>
<style scoped>
.logo {
  width: 120px;
  height: 40px;

  display: block;
}

.buy-block {
  background: #36ab4d;
  border-radius: 10px;
  height: 80px;
}
.logo {
  background: url(/img/main/logo.svg) 0 0 no-repeat;
}
.search {
  background: url(/img/main/search.svg) 0 0 no-repeat;
  height: 16px;
  width: 16px;
  border: 0;
}
</style>
