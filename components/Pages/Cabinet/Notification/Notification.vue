<div class="block  bg-one block-border-two mt-4">
  <div v-text="name"  class="block-title"/>
  <content-block :item-id="itemId">
    <template v-slot:data="data">
      <div class="block-insurancecase-item">
        <div class="img-insurancecase-kasko"></div>
        <div   class="block-insurancecase-text">
          <b  v-text="data.content.SRISK + ' от ' + data.content.DCLAIM_DATE"/>
          <span v-text="data.content.SPNUMBER" class="block-insurancecase-item-number"/>
        </div>
        <div class="block-btn">
          <open-card-button class="arrow-right-bold"  :moduleId="moduleId" :menuId="itemId" :itemId="data.content.ID" ><div>Перейти</div></open-card-button>
        </div>
      </div>
    </template>
  </content-block>
  <div class="block-footer bg-one row justify-content-center align-items-center">
    <button type="button" class="col-auto link-arrow-right">Архив страховых случаев</button>
  </div>
</div>
<template>
<div>

  <div class="block-title title-bottom-line">Мои полисы</div>
  <div class="block bg-one block-border-two mypolices-block">
    <div class="img-mypolices-img"></div>
    <div class="mypolices-title">КАСКО</div>
    <div class="mypolices-name">Nissan tiana 2,5, 2009</div>
    <div class="mypolices-number">XXFFEE678978965468</div>
    <div class="mypolices-time">Срок действия: <b>по 02.02.2021</b></div>
    <div class="block-footer bg-one row justify-content-start align-items-center"><button type="button" class="col-auto link-arrow-right position-static">Перейти к полису</button></div>
  </div>

  <div class="row">
        <div class="col-lg-4">
          <div class="block bg-two h-100 d-grid">
            <div class="block-title">
              ДМС для москвичей
            </div>
            <div class="block-offer">
              Полис страхования здоровья  при обслуживании у стратегического партнера РЕСО-Гарантия – сети медцентров Medswiss
            </div>
            <a href="" class="block-offer-button">
              Полис страхования<br>от <b>17 100</b> рублей
            </a>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="block bg-tree h-100 d-grid">
            <div class="block-title">
              Туризм
            </div>
            <div class="block-offer">
              <img src="/img/card2.svg">
            </div>
            <a href="" class="block-offer-button">
              Полис “Активная защита” для<br>любителей активного отдыха
            </a>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="block bg-for h-100  d-grid">
            <div class="block-title">
              Несчастный случай
            </div>
            <div class="block-offer">
              <img src="/img/card3.svg">
            </div>
            <a href=""  class="block-offer-button">
              Получите доступ к<br>качественной медицине
            </a>
          </div>
        </div>
  </div>

</div>
</template>

<script>
  export default {
    name: 'Notification'
  }
</script>

<style scoped>

</style>


