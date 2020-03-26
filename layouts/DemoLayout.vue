<template>
  <div class="app">
    <nuxt/>
  </div>
</template>

<script>
  export default {
    name: 'DemoPage',
    head() {
      return {
        link: [
          // { rel: 'stylesheet', href: 'http://reso.ru/export/system/modules/ru.reso.bootstrap4/resources/css/reso-style.css' }
        ]
      }
    }
  }
</script>

<style>

  html, body, #wrapper
  {
    width: 100%;
    height: 100%;
  }
  /*Ð¦ÐµÐ½Ñ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ‚ÐµÐºÑÐ° Ð¿Ð¾Ð´ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ¾Ð¼*/
  div.income-info p {
    max-width: 700px;
  }
  div.income-info {
    display: flex;
    flex-direction: column;
    align-items: center
  }
  /*Ð¡Ñ‚Ð¸Ð»Ð¸ Ð¸ÐºÐ¾Ð½ÐºÐ¸ Ð½Ð°Ð´ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ¾Ð¼*/
  .content-caption-icon {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    margin: 0 auto 25px;
    padding: 5px;
    border-radius: 50%;
    background:#5AA844;
    -webkit-box-shadow: 0 15px 20px 0 rgba(146, 209, 73, 0.3);
    box-shadow: 0 15px 20px 0
    rgba(146, 209, 73, 0.3);
  }

  /*ÐšÑ€ÑƒÐ¿Ð½Ñ‹Ðµ Ð¿Ñ€ÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ñ*/
  .company-title {
    font-size: 21px;
    line-height: 1.4;
    margin-bottom: 30px;
  }

  /*id Ð´Ð»Ñ Ð±Ð»Ð¾ÐºÐ¾Ð² Ð½Ð° Ð²ÑÑŽ ÑˆÐ¸Ñ€Ð¸Ð½Ñƒ ÑÐºÑ€Ð°Ð½Ð°*/
  #grey-backgrond {
    background: #F4F8FB;
    padding: 40px 0px;
  }
  #padding-60 {
    padding: 60px 0px;
  }
  #products {
    padding: 60px 0px;
    color: white;
  }
  #products .content-caption-icon {
    background: #ffffff !important;
  }

  /*Ð±Ð»Ð¾ÐºÐ¸ Ñ ÑÐµÑ€Ð¾Ð¹ Ð³Ð¾Ñ€Ð¸Ð·Ð¾Ð½Ñ‚Ð°Ð»ÑŒÐ½Ð¾Ð¹ Ð¿Ð¾Ð»Ð¾ÑÐ¾Ð¹*/
  .cost-saving-item:first-child {
    border-top: 0;
    padding-top: 30px;
  }
  .cost-saving-item:last-child {
    padding-bottom: 0px;
  }
  .cost-saving-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 60px 0 50px;
    padding-top: 60px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  .cost-saving-item div:nth-child(2) {
    padding-left: 40px;
  }
  /*Ð‘ÐµÐ»Ð°Ñ ÐºÐ½Ð¾Ð¿ÐºÐ°*/
  .button-white {
    padding: 15px 33px 16px;
    color: #23803F !important;
    background: #ffffff !important;
    border: 2px solid #92D149 !important;
    -webkit-box-shadow: 0 10px 15px 0 #DBE4EB !important;
    box-shadow: 0 10px 15px 0 #DBE4EB !important;
    min-height: 51px !important;
  }
  .button-white:hover {
    color: #ffffff !important;
    background: #5AA844 !important;
    border-color: #5AA844 !important;
  }
  /*Ð¡ÐµÑ€Ñ‹Ð¹ Ð±Ð»Ð¾Ðº Ð½Ð° 100% + Ð¿Ð¾Ð»Ñ 60px*/
  #grey-background-60 {
    background: #F4F8FB;
    padding: 60px 0px;
  }

  #company .contacts-list {
    margin: 0px 0px -42px 0px;
    position: relative;
    z-index: 2;
  }

  .doc-list-item {
    margin-bottom: 15px;
  }


  /*---Ð¡Ð¿Ð¸ÑÐ¾Ðº Ñ Ñ‡ÐµÑ€Ñ‚Ð¾Ñ‡ÐºÐ¾Ð¹ Ð²Ð¿ÐµÑ€ÐµÐ´Ð¸---*/
  ul.list-line li::before {
    content: "";
    position: absolute;
    left: 0px;
    width: 10px;
    height: 2px;
    background: #23803F;
    margin: 11px 0px;
  }
  ul.list-line li {
    padding-left: 20px;
  }
  ul.list-line {
    padding-bottom: 10px;
    position: relative;
  }


  /*Ð¡ÐµÑ€Ñ‹Ð¹ ÑˆÑ€Ð¸Ñ„Ñ‚*/
  .gray {
    color: #a3a3a3 !important;
  }
  /*Ð¡Ñ‚Ð¸Ð»Ð¸ Ð´Ð»Ñ Ð½ÑƒÐ¼ÐµÑ€ÐµÐ²Ð°Ð½Ð½Ð¾Ð³Ð¾ ÑÐ¿Ð¸ÑÐºÐ°*/
  .accident-instructions-item {min-width: 33.333333%;}
  .accident-instructions-item .accident-instructions-item-number {
    display: inline-block;
    vertical-align: top;
    min-width: 60px;
    padding-bottom: 29px;
    margin-bottom: 30px;
    font-size: 45px;
    line-height: 1.2223;
    font-family: "Montserrat", Helvetica, Arial, sans-serif;
    font-weight: 800;
    color:
      #23803F;
    border-bottom: 1px solid
    rgba(0, 0, 0, 0.1);
    margin: 30px 35px;
  }
  .accident-instructions-item .accident-instructions-item-text {
    margin: 0px 35px 20px;
    padding-bottom: 2px;
  }
  #grey-background-60 .contacts-item {background: #ffffff; border: 2px solid #ffffff;}



  #padding-bottom-40 {
    padding-bottom: 40px;
  }
  #padding-bottom-60 {
    padding-bottom: 60px;
  }
  #padding-top-60 {
    padding-top: 60px;
  }
  #grey-backgrond-Season-RENAULT {
    background: #F4F8FB;
    padding: 40px 0px;
    margin-top: 40px;
  }
  #green-backgrond-60 {
    background:#23803F;
    background-image: none;
    background-image: -webkit-gradient(linear, left bottom, left top, color-stop(1%, rgba(90, 168, 68, 0)), color-stop(99%, #5AA844));
    background-image: -webkit-linear-gradient(bottom, rgba(90, 168, 68, 0) 1%, #5AA844 99%);
    background-image: -o-linear-gradient(bottom, rgba(90, 168, 68, 0) 1%, #5AA844 99%);
    background-image: linear-gradient(0deg,rgba(90, 168, 68, 0) 1%, #5AA844 99%);
    padding: 60px 0px;
    color: white;
  }
  #green-backgrond-60 .content-caption-icon {
    background: #ffffff !important;
  }
  #background-cost {
    padding: 95px 0;
    background-size: cover;
    background-image: url('https://reso.ru/system/modules/ru.reso.landing/resources/images/gr/calculate.jpg');
  }
  .white-block {
    padding: 60px 65px;
    max-width: 780px;
    background:
      #ffffff;
    border-radius: 10px;
  }
  .white-block .text {
    padding: 0px 0px 20px 0px;
  }

  #products .faq-item.open {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
  }
  p.description {
    color: #AAAAAA;
    font-size: 0.9em;
    line-height: 1.6em;
    margin-top: 30px;
  }

  /*--Ð¤Ð¾Ñ€Ð¼Ð° Ð¾Ñ‚Ð¿Ñ€Ð°Ð²ÐºÐ¸ Ð·Ð°ÑÐ²ÐºÐ¸ Ð½Ð° Ð¿Ð¾Ð»Ð¸Ñ--*/
  .reso_from_title {
    display: flex;
    justify-content: center;
    margin-bottom: 22px;
  }
  .reso_from_title h3 {
    font-weight: 900;
  }
  .margin-5-0 {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .personal__info {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  /*--Ð¥Ð»ÐµÐ±Ð½Ñ‹Ðµ ÐºÑ€Ð¾ÑˆÐºÐ¸--*/
  nav {
    display: block;
  }
  .breadcrumb > li + li:before {
    color: #cccccc;
    content: "â†’";
    padding: 0 5px;
  }
  .breadcrumb li.active {
    color: #a3a3a3;
  }
  .breadcrumb li a{
    color: #a3a3a3;
    border-bottom: 1px solid rgba(163,163,163,0.33);
  }
  .breadcrumb li a:hover {
    border-bottom: 1px solid rgba(17,86,37,0.33) !important;
    color: #115625 !important;
  }
  .breadcrumb {
    font-size: 0.8em;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    padding-bottom: 2em;
    list-style: none;
  }
  ol.breadcrumb {
    margin-top: 0;
  }


  @media (min-width: 992px) {
    #vip-contacts .contacts-item {
      min-height: 220px;
    }
  }

  @media (min-width: 980px) {
    .footer-mobile{
      display: none;
    }
  }
  @media (max-width: 979px) {
    .copyright{
      display: none;
    }
    .footer-mobile{
      max-width: 1000px;
      padding: 0 20px 20px;
      margin: 0 auto;
    }
  }
  @media (max-width: 991px) {
    #grey-backgrond-Season-RENAULT {
      display: none;
    }
    div.income-info p {
      max-width: 100%;
    }
    .cost-saving-item div:nth-child(2) {
      padding-left: 15px;
    }
    .white-block {
      padding: 30px;
    }
  }
  @media screen and (max-width: 470px) {
    a.button {
      padding: 14px 15px 16px;
    }
    .white-block a.button{
      padding: 15px 10px;
    }
  }
  .min-template .logo-title {
    margin-left: 25px;
  }

  .min-template .header-content {
    justify-content: left;
  }

  .video-block iframe {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .input__text.input-error,
  .select.input-error {
    visibility: unset;
    border-color: #FE6F5F;
  }

  .input__text.input-error:focus,
  .select.input-error:focus {
    border: 2px solid  #FE6F5F;
  }

  .field__error {
    display:none;
  }

  .field__error.field__error-show {
    display: block;
    color: #FE6F5F;
  }

  .notification-background {
    text-align:center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(128, 128, 128, 0.95);
    z-index:99999;
  }

  .notification-content{
    position:absolute;
    left:50%;
    top:50%;
    width:800px;
    height:400px;
    margin-left:-400px;
    margin-top:-200px;
    background: white;
    padding: 50px 50px 0;
  }

  @media {
    #car-season-renault .income-item-icon{-webkit-box-flex:0;-ms-flex:0 0 150px;flex:0 0 130px;max-width:150px; min-width: 150px; padding-right:20px; padding-top: 20px;}
    #car-season-renault .income-item-icon span{height:150px;width: 150px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;background:#ffffff;border-radius:50%; }
    #car-season-renault .income-item-icon img{margin:0 auto;/* width: 150px;*/}
    #car-season-renault .income-item-title { min-height: 30px; padding-bottom: 10px; margin-bottom: 13px; padding-top: 15px;}
    #car-season-renault .income-item { padding: 20px 45px 15px;}
    #car-season-renault .income-item-info { padding-left: 45px;}

  }

  @media {
    .feedback {
      padding: 60px 0;
    }
  }



  @media (max-width:768px){
    #feedback {
      background: #F4F8FB;
      margin-bottom: 60px;
    }
  }

  @media (min-width:769px){
    #feedback {
      background: #FFFFFF;
    }
  }


  @media (max-width:768px){
    .action-reno {
      font-size: 15px;
    }
  }

  @media (min-width:769px){
    .about-action {
      padding: 40px 0px;
    }
  }


  @media (max-width:768px){
    .about-action {
      padding-top: 25px;
      padding-bottom: 0px;
      padding-left: 0px;
    }
  }

  /** Dialog */

  .ui-dialog .ui-dialog-titlebar-close{
    display:block;
    border:0;
    background:url(/export/system/modules/ru.reso/resources/images/icos/close.png) no-repeat 0 0;
    width:52px;
    height:52px;
    position:absolute;
    top:5px;
    right:-19px;
    z-index:10000;
  }
  .ui-widget-overlay.ui-front{
    background:#000;
    position:fixed;
    top:0; right:0; bottom:0; left:0;
    z-index:9998;
    -moz-opacity:0.5;
    -webkit-opacity:0.5;
    opacity:0.5;
    filter:alpha(opacity=50);
  }

  @media (max-width:400px) {
    .modal-content {
      padding-left: 10px;
      padding-right: 10px;
    }
  }

  /** Reso Dialog */

  .modal.reso-modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10000;
    display: none;
    overflow: hidden;
    outline: 0;
    padding: 20px;
    width: unset;
    background: unset;
    border-radius: unset;
    max-width: unset;
  }

  .modal.reso-modal .modal-dialog {
    position: relative;
    max-width: 600px;
    background: #fff;
    border-radius: 10px;
    margin: 1.75em auto;
  }

  .modal.reso-modal .modal-content {
    text-align: left;
    padding: 50px 60px 40px;
  }

  .modal.reso-modal .button {
    padding: 12px 25px 12px;
  }

  @media (max-width: 460px) {
    .modal.reso-modal .modal-content {
      padding: 20px;
      font-size: 15px;
    }
    .modal.reso-modal .modal-close {
      width: 35px;
      height: 35px;
      top: 5px;
      right: 5px;
      z-index: 10001;
    }
    .modal.reso-modal .modal-title {
      font-size: 18px;
    }
  }

  .reso-btstrp .modal-backdrop.fade.in {
    -moz-opacity: 0.5;
    -webkit-opacity: 0.5;
    opacity: 0.5;
  }

  /** radio & checkbox */

  .input__radio,
  .input__checkbox {
    display: none;
  }

  .input__radio + label,
  .input__checkbox + label {
    position: relative;
    min-height: 1.5rem;
    margin-bottom: .5rem;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .input__radio:disabled + label::before,
  .input__checkbox:disabled + label::before {
    cursor:default;
  }
  .input__checkbox:disabled + label,
  .input__radio:disabled + label {
    cursor:default;
    color:#ccc
  }

  .input__radio + label:focus,
  .input__checkbox + label:focus {
    font-weight: bold;
  }


  /** checkbox */

  .input__checkbox + label {
    display: block;
    padding-left: 40px;
    position: relative;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .input__checkbox + label::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 25px;
    height: 25px;
    border: 1px solid #5AA844;
    border-radius: 2px;
    background: #fff;
  }

  .input__checkbox + label:focus::before {
    border: 2px solid #5AA844;
  }

  .input__checkbox + label::after {
    opacity: 0;
    content: "";
    position: absolute;
    top: 8px;
    left: 4px;
    width: 16px;
    height: 11px;
    background:
      transparent url("https://reso.ru/gr/checkbox.svg") 50% 50% no-repeat;
    background-size: auto;
    background-size: 100% 100%;
    -webkit-transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    -o-transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .input__checkbox:checked + label::after {
    opacity: 1;
  }

  .input__checkbox:checked + label::before {
    background-position: 1px -18px;
  }

  /** radio */

  .input__radio + label {
    padding-left: 1.5rem;
  }

  .input__radio + label::before {
    position: absolute;
    top: .25rem;
    left: 0;
    display: block;
    width: 1rem;
    height: 1rem;
    pointer-events: none;
    content: "";
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: #FFF;
    border: 1px solid #23803f;
    border-radius: 50%;
  }

  .input__radio + label:focus::before {
    border: 2px solid #23803f;
  }

  .input__radio + label::after {
    position: absolute;
    top: .25rem;
    left: 0;
    display: block;
    width: 1rem;
    height: 1rem;
    content: "";
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
  }

  .input__radio:checked + label::before {
    background-color: #23803f;
  }

  .input__radio:checked + label::after {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23fff'/%3E%3C/svg%3E");
  }


  /** Select */

  select.select:disabled {
    color: #dedede;
    background: #ffffff;
    border-color: #ccc;
  }

  select.select {
    padding-right: 40px;
    border: 1px solid #5AA844;
  }

  select.select:focus {
    border: 2px solid #5AA844;
  }

  select.select.select-min {
    height: 35px;
    padding: 5px 40px 5px 5px;
    background: #ffffff url("https://reso.ru/gr/select-min.svg") 100% 50% no-repeat;
  }

  /** Placeholder for Select */

  select.select-placeholder {
    color: #999;
  }

  select.select-placeholder option {
    color: #000;
  }

  /** Ui menu */
  .ui-menu {
    background: #ffffff;
    border: 1px solid #C8CCCF;
    max-height: 230px;
    overflow-y: auto;
  }

  .ui-menu .ui-menu-item-wrapper {
    padding: 5px 19px;
  }

  .ui-menu .ui-state-hover,
  .ui-menu .ui-state-active,
  .ui-menu .ui-state-focus
    /*.ui-menu .ui-menu-item:hover*/
    /*.ui-menu .ui-menu-item.ui-state-active*/ {
    background: #23803f;
    color: #ffffff;
    cursor: pointer;
  }


  /** Text input */

  .input__text {
    display: block;
    width: 100%;
    height: 55px;
    padding: 13px 14px 15px 19px;
    font-size: 15px;
    line-height: 1.6667;
    color: #000000;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid  #5AA844;
    -webkit-transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    -o-transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: color, background-color, border-color;
  }

  .input__text:focus {
    border: 2px solid  #5AA844;
  }

  .input__text:disabled {
    color: black;
    background: #ccc;
    border-color: #ccc;
  }

  /** Tooltip */

  .tooltip-inner {
    max-width:250px;
    padding: 20px;
    background:#f9f7e6;
    border: 1px solid #C8CCCF;
    border-radius:2px;
  }

  .tooltip-show {
    cursor: default;
    background: url(https://reso.ru/gr/vopros.svg) no-repeat;
    width: 20px;
    height: 16px;
    display: -moz-inline-stack;
    display: inline-block;
    zoom: 1;
    *display: inline;
    line-height: 16px;
    margin: 4px 0 -2px 3px;
  }

  @media screen and (max-width:991px) {
    .tooltip-inner {
      max-width: 200px;
      font-size: 13px;
    }
  }

  /** Calculators */

  .calculate-buttons {
    max-width: 820px;
    margin: auto;
    padding: 25px;
  }

  .result_title {
    margin: 0;
    padding: 10px 20px;
    color: #23803f;
  }

  .no-price {
    margin: 10px 0;
    padding: 15px 35px;
    border-radius: 5px;
    background-color: #f0f0f0;box-shadow: inset 0 0 6px rgba(0,0,0,.29);
    font-size: 16px;
    font-weight: bold;
  }

  .calculate-result-content {
    max-width: 820px;
    margin: 20px auto;
  }

  .result_container {
    padding: 25px;
    background: #f0f0f0;
  }

  .service_price {
    margin: 10px 0;
    padding: 15px 35px;
    border-radius: 5px;
    background-color:#f0f0f0;box-shadow: inset 0 0 6px rgba(0,0,0,.29);
  }

  .service_price .border_box {
    background:#fff;
    padding: 5px 25px;
    border-radius: 5px;
    border: 1px dashed #b6b6b6;
  }

  .calculate__button_delete {
    color: #d21623;
  }

  .calculate__button_delete:hover {
    color: #f45945;
  }

  /** Casco */

  .casco__franchise {
    display: inline-block;
    position: relative;
  }

  .casco__franchise label {
    max-width: 280px;
  }

  .casco__franchise .tooltip-show {
    position: absolute;
    right: -30px;
    bottom: 20px;
  }

  @media (max-width:400px) {
    .casco__franchise label {
      max-width: 275px;
    }

    .casco__franchise .tooltip-show {
      left: 150px;
      bottom: 14px;
    }
  }

  /** Button */

  .reso-btstrp a.button,
  .reso-btstrp button.button,
  .reso-btstrp input.button {
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  .reso-btstrp a.button.disabled,
  .reso-btstrp button.button:disabled,
  .reso-btstrp input.button:disabled {
    background: #272A3B;
    color: #979aab;
    cursor: unset;
  }

  /** Google capcha */

  @media (max-width: 400px) {
    #captcha {
      transform: scale(0.83);
      -webkit-transform: scale(0.83);
      transform-origin: 0 0;
      -webkit-transform-origin: 0 0;
    }
  }

  /** Calculate styles */

  .bootstrap-action {
    margin: 0 auto;
    max-width: 800px;
  }

  .bootstrap-action .input__text {
    min-width: 55px;
  }

  .bootstrap-action a {
    cursor: pointer;
  }

  .bootstrap-action .calculate_title {
    padding: 0px 15px 20px 15px;
  }

  .bootstrap-action .calculate_title h3 {
    font-weight: bold;
  }

  .bootstrap-action .required_field {
    color: #23803f;
  }

  .bootstrap-action .grey-container {
    background: #f0f0f0;
    padding: 10px 10px;
    margin: 5px -10px 25px;
  }

  .bootstrap-action .width-50 {
    width: 100%;
  }

  .bootstrap-action .row, .col-55 {
    margin: 10px 0px;
    min-height: 55px;
  }

  .margin-top-20 {
    margin-top: 20px !important;
  }

  .min-height-30 {
    min-height: 30px !important;
  }

  .max-width-120 {
    max-width: 110px;
  }

  .bootstrap-action label {
    display: inline-block;
    margin-bottom: .5rem;
  }

  .bootstrap-action button,
  .bootstrap-action input {
    overflow: visible;
  }
  .bootstrap-action .white-container {
    padding: 10px;
    margin: 25px 15px;
    background: #ffffff;
    border-radius: 10px;
  }
  .bootstrap-action .gray-line {
    width: 100%;
    height: 1px;
    background: #ccc;
    margin-bottom: 5px;
  }
  .bootstrap-action .min-height-30 label {
    margin-bottom: 0px;
  }
  .osago-driver + .osago-driver {
    border-top: 1px solid #ccc;
    padding-top: 15px;
    margin-top: 15px;
  }
  @media screen and (min-width: 992px) {
    .bootstrap-action .calculate_title {
      text-align: center;
    }
    .bootstrap-action .width-50 {
      width: 50%;
    }
  }

  @media screen and (max-width: 991px){
    .bootstrap-action div.col-sm-6.margin-top-20,
    .bootstrap-action div.col-sm-6.margin-top-20  {
      margin-top: 0px !important;
      max-height: 30px;
    }
  }


  /** Mobile menu */

  .menu-mobile-sublink {
    position: relative;
  }

  .menu-mobile-sublink::before {
    content: ' ';
    width: 33px;
    height: 35px;
    position: absolute;
    right: -10px;
    top: 0;
    background: #fff url('https://reso.ru/system/modules/ru.reso.bootstrap4/resources/gr/select.svg') 100% 100% no-repeat;
    transform: translate3d(0,0,0) rotate(-90deg);
  }

  .menu-mobile.menu-moblie-submenu li a {
    padding-left: 35px;
  }
  .menu-mobile-sublink.menu-mobile-backlink::before {
    left: -20px;
    top: 24px;
    transform: translate3d(0,0,0) rotate(90deg);
  }


  .hide {
    display: none !important;
  }


  /** Test tourism **/
  .test-container {
    max-width: 980px;
  }
  .test-name {
    font-size: 1.8em;
    padding: 20px 10px 40px 10px;
  }
  .test-title {
    font-weight: bold;
    font-size: 1.3em;
    padding: 0px 0px 10px 0px;
    text-align: center;
  }
  .test-container .option {
    height: 250px;
    padding: 0px !important;
    min-width: 180px;
    max-width: 306px;
    margin: 10px;
    border-radius: 10px;
    border: 2px solid #ffffff;
    -webkit-box-shadow: 0px 5px 5px 5px rgba(240,240,240,1);
    -moz-box-shadow: 0px 5px 5px 5px rgba(240,240,240,1);
    box-shadow: 0px 5px 5px 5px rgba(240,240,240,1);
  }
  .test-container .option .img {
    width: 100%;
    height: 186px;
    background: #f0f0f0;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-size: cover;
  }
  .test-container .option .text {
    margin-top: auto;
    margin-bottom: auto;
    padding: 0 10px;
    font-weight: 900;
    text-align: center;
  }
  a.next-green {
    background: #23803f;
  }
  .result-text {
    min-height: 250px;
    padding: 20px 35px !important;
    max-width: 600px;
    margin: 10px -25px;
    border-radius: 10px;
    border: 2px solid #ffffff;
    -webkit-box-shadow: 0px 5px 5px 5px rgba(240,240,240,1);
    -moz-box-shadow: 0px 5px 5px 5px rgba(240,240,240,1);
    box-shadow: 0px 5px 5px 5px rgba(240,240,240,1);
    font-size: 1.2em;
    line-height: 1.4em;
  }
  .result-text .test-title {
    font-size: 1.4em;
    padding-bottom: 20px;
  }

  .select .answer {
    width: 100%;
    height: 186px;
    background-image: url("https://reso.ru/test/14-February/img/check-mark.svg");
    background-position: center center;
    background-repeat: no-repeat;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .test-container .step {
    color: #898989;
  }
  .test-container .button {
    margin: 20px 0px 15px 0px;
  }
  .test-container .copyright {
    margin: 40px 0px 0px 0px;
  }

     .carousel {
       position: relative;
     }

  .carousel-inner {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .carousel-item {
    position: relative;
    display: none;
    align-items: center;
    width: 100%;
  @include transition($carousel-transition);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .carousel-item.active,
  .carousel-item-next,
  .carousel-item-prev {
    display: block;
  }

  .carousel-item-next,
  .carousel-item-prev {
    position: absolute;
    top: 0;
  }



  /** Carousel reso custom style */

  .carousel-indicators li {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin: 0 4px;
  }

  .carousel-indicators li.active::before{
    width: 12px;
    height: 12px;
    margin-top: 0;
    margin-left: 0px;
  }

  .carousel-indicators li::before {
    content: '.';
    float: left;
    text-indent: -9999px;
    display: inline-block;
    margin-top: 3px;
    margin-left: 3px;
    width: 6px;
    height: 6px;
    background-color: #308f49;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .suggestions-suggestions {
    position: absolute;
    z-index: 10;
    border: 1px solid #d0d0d0;
    background: #ffffff;
    margin: -1px 0 0 0;
    border-top: 0 none;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    -webkit-border-radius: 0 0 3px 3px;
    -moz-border-radius: 0 0 3px 3px;
    border-radius: 0 0 3px 3px;
    /*top: 255px;*/
  }

  .suggestions-selected {
    background: rgba(125, 168, 208, 0.2)
  }

  .suggestions-suggestion {
    font-size: 13px;
    color: #23803f;
    border-top: 1px solid #f0f0f0;
    height: 38px !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    line-height: 38px !important;
    padding: 5px 8px;
  }

  .suggestions-hint {
    font-size: 13px;
    border-top: 1px solid #f0f0f0;
    height: 38px !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    line-height: 38px !important;
    padding: 5px 8px;
    color: #23803f;
  }

</style>
