<template>
  <div>
    <div class="position-relative">
      <label>Стоимость полиса</label>
      <!-- Полная цена -->
      <div
        class="price"
        v-if="getFieldValue('NDISCOUNTPREMIUM') === getFieldValue('NPREMIUM')"
      >
        <font>{{
          new Intl.NumberFormat("ru-RU", {}).format(getFieldValue("NPREMIUM"))
        }}</font>
      </div>
      <!-- Цена со скидкой/промокодом -->
      <div
        class="price"
        v-else
        :class="
          getFieldValue('LPROMOCODE') === true
            ? 'use_promocode'
            : 'use_discount'
        "
      >

        <font>{{
          new Intl.NumberFormat("ru-RU", {}).format(getFieldValue("NDISCOUNTPREMIUM"))
        }}</font>
        <font>{{
          new Intl.NumberFormat("ru-RU", {}).format(
            getFieldValue("NPREMIUM")
          )
        }}</font>
      </div>
      <div
        v-if="getField('SSTATEPAY').visible"
        class="payment_status"
        :class="
          getFieldValue('SSTATENAME') === 'Оплачен'
            ? 'payment_true'
            : 'payment_fail'
        "
      >
        {{ getFieldValue("SSTATENAME") }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.mt-4.buttons.row {
  display: none;
}
.cabinet .conf-label {
  line-height: 23px;
  font-size: 0.875rem;
  color: #292929;
}
.cabinet .conf-label label {
  font-weight: 700;
  margin-bottom: 0px;
  font-size: 0.875rem;
  color: #292929;
}
.price font:after {
  content: "\20BD";
  font-family: "SF Pro Display", Helvetica, Arial, system-ui, -apple-system,
    Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif,
    "Apple Color Emoji";
  padding-left: 10px;
}
.price font {
  font-size: 3rem;
  font-weight: 700;
  font-family: Raleway;
  font-feature-settings: "pnum" on, "lnum" on;
  line-height: 77px;
}
font + font {
  margin-left: 20px;
}
.price.use_promocode font,
.price.use_discount font {
  color: #eb5757;
}
.price.use_discount font + font,
.price.use_promocode font + font {
  color: #c3c3c3;
  text-decoration: line-through;
}
.price.use_discount,
.price.use_promocode {
  padding-bottom: 32px;
  position: relative;
}
.use_discount:after,
.use_promocode:after {
  position: absolute;
  padding: 4px 12px;
  content: "Промокод применён!";
  font-size: 0.875rem;
  color: #43b02a;
  background-color: #edf8ea;
  border-radius: 100px;
  bottom: 0;
  left: 0;
  display: inline-block;
}

.use_discount:after {
  content: "Со скидкой";
}

.payment_fail {
  background: #eb5757 url(/img/payment_fail.svg) right 12px top 50% no-repeat;
  font-size: 1.125rem;
  color: #fff;
  border-radius: 100px;
  line-height: 30px;
  display: inline-block;
  padding: 4px 43px 4px 12px;
  top: -43px;
  right: 0px;
  position: absolute;
}
.payment_true {
  background: #43b02a url(/img/payment_true.svg) right 12px top 50% no-repeat;
  font-size: 1.125rem;
  color: #fff;
  border-radius: 100px;
  line-height: 30px;
  display: inline-block;
  padding: 4px 43px 4px 12px;
  top: -43px;
  right: 0px;
  position: absolute;
}
@media (max-width: 992px) {
  .btn-link.color-black {
    border-radius: 15px;
    background: #eff1f3;
    font-size: 0.875rem;
    padding: 10px 24px;
    line-height: 20px;
    text-decoration: none !important;
  }
  .price font {
    font-size: 1.5rem;
    white-space: nowrap;
    line-height: 30px;
  }
  .payment_fail,
  .payment_true {
    font-size: 0.875rem;
    line-height: 24px;
    top: -40px;
  }
}
</style>
