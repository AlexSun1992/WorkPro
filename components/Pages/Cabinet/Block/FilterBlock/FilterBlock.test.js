import {
  mount,
  shallowMount,
  enableAutoDestroy,
  createLocalVue,
} from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import FilterBlock from "./FilterBlock.vue";

//
import {
  actions as actionsStore,
  getters as gettersStore,
  mutations as mutationsStore,
  state as stateStore,
} from "../../../../../store/blocks";

// jest.mock("this.$route.query.filters");

describe("FilterBlock", () => {
  enableAutoDestroy(beforeEach);
  let wrapper;
  Vue.use(Vuex);
  const filterProperyName = "SSTATUS";
  const filterItemId = "712";
  const filterShowFilteredItemsCount = true;
  const filterRouteQuery = [
    { propertyName: "SSTATUS", filter: ["Действующие"], id: "712" },
  ];

  // const localVue = createLocalVue();
  // localVue.use(Vuex);
  const route = {
    fullPath:
      "/cabinet/55/0/712?filters=%5B%7B%22propertyName%22%3A%22SSTATUS%22,%22filter%22%3A%5B%22%D0%94%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D1%83%D1%8E%D1%89%D0%B8%D0%B5%22%5D,%22id%22%3A%22712%22%7D%5D",
    hash: "",
    meta: "Cabinet",
    name: undefined,
    params: {
      idModule: "55",
      idParent: "0",
      idItem: "712",
    },
    path: "/cabinet/55/0/712",
    query: {
      filters:
        '[{"propertyName":"SSTATUS","filter":["Действующие"],"id":"712"}]',
    },
  };

  const dataObj = {
    fields: [
      {
        key: "index",
        label: "Действия",
      },
      {
        label: "SPRODUCTNAME",
        key: "SPRODUCTNAME",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "SPRODUCTNAME2",
        key: "SPRODUCTNAME2",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "Продукт",
        key: "IDPRODUCT",
        type: "double",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "SPOLICY_NUMBER",
        key: "SPOLICY_NUMBER",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "DFROMDATE",
        key: "DFROMDATE",
        type: "timestamp",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "DTODATE",
        key: "DTODATE",
        type: "timestamp",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "SPOLOBJ",
        key: "SPOLOBJ",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "Уч номер",
        key: "IDPOLICY",
        type: "long",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "IDPOLICYHEADER",
        key: "IDPOLICYHEADER",
        type: "long",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "Ссылка на файл",
        key: "SLINK",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "SSTATUS",
        key: "SSTATUS",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "DACCRUAL_DATE",
        key: "DACCRUAL_DATE",
        type: "timestamp",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "DLAST_CHANGE",
        key: "DLAST_CHANGE",
        type: "timestamp",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "SINS_PERIOD",
        key: "SINS_PERIOD",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "SPROLONGATION",
        key: "SPROLONGATION",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "SCOPY",
        key: "SCOPY",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "IDACCRUAL",
        key: "IDACCRUAL",
        type: "double",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "SREL_ACCRUAL",
        key: "SREL_ACCRUAL",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "NSUM_TO_PAY",
        key: "NSUM_TO_PAY",
        type: "double",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "SCURRENCY",
        key: "SCURRENCY",
        type: "string",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
      {
        label: "POLICY_PORTAL",
        key: "POLICY_PORTAL",
        type: "timestamp",
        tdClass: "text-col",
        sortable: true,
        formatter: "formatData",
      },
    ],
    items: [
      {
        SSTATUS: "Действующие",
        POLICY_PORTAL: "2023-03-31 00:00:00.0",
        SPRODUCTNAME: "ДМС",
        IDPOLICYHEADER: 2151860958,
        SPOLICY_NUMBER: "2529400-13/22",
        IDPOLICY: 2151860959,
        SPRODUCTNAME2: "Корпоративный ДМС",
        DFROMDATE: "2022-04-01 00:00:00.0",
        IDPRODUCT: 1,
        SPOLOBJ: "Гаврилов Алексей Николаевич",
        REL: "3AB42A0E5081F716D9CD35423CAE3265",
        SLINK: "/cabinet/55/0/937/2151860959/9770E8CA7B96A891F9BE5870AA614167",
        SCOPY: "N",
        DTODATE: "2023-03-31 00:00:00.0",
        ID: 2151860959,
        SINS_PERIOD: "Действует до 31.03.2023",
        SPROLONGATION: "Нет данных",
      },
      {
        SSTATUS: "Действующие",
        POLICY_PORTAL: "2023-10-30 00:00:00.0",
        SPRODUCTNAME: "ОСАГО",
        IDPOLICYHEADER: 1290517532,
        SPOLICY_NUMBER: "ХХХ0274097299",
        IDPOLICY: 2272217098,
        SPRODUCTNAME2: "ОСАГО",
        DFROMDATE: "2022-10-31 00:00:00.0",
        IDPRODUCT: 2,
        SPOLOBJ: "NISSAN TEANA; 2009; E045MK777",
        REL: "08F6F6F9EF6C7A8C236516197497A22C",
        SLINK: "/cabinet/55/0/934/2272217098/B150F3A5633ADB121F2E9BE825352F3E",
        SCOPY: "N",
        DTODATE: "2023-10-30 00:00:00.0",
        ID: 2272217098,
        SINS_PERIOD: "Действует до 30.10.2023",
        SPROLONGATION: "Нет данных",
      },
      {
        SSTATUS: "Действующие",
        POLICY_PORTAL: "2023-11-06 00:00:00.0",
        SPRODUCTNAME: "Имущество",
        IDPOLICYHEADER: 1291142723,
        SPOLICY_NUMBER: "SYS2276279102",
        IDPOLICY: 2276279102,
        SPRODUCTNAME2: "Домовой Коробочный",
        DFROMDATE: "2022-11-07 00:00:00.0",
        IDPRODUCT: 4,
        SPOLOBJ: "111402, Москва г, Старый Гай ул, д 4к2, кв 53",
        REL: "83EBC3070F8E0F748ACB55858ACBB16B",
        SLINK: "/cabinet/55/0/942/2276279102/D58F994A5090B6BA4401AC16C1F96CB2",
        SCOPY: "N",
        DTODATE: "2023-11-06 00:00:00.0",
        ID: 2276279102,
        SINS_PERIOD: "Действует до 06.11.2023",
        SPROLONGATION: "Нет данных",
      },
      {
        SSTATUS: "Архивные",
        SPRODUCTNAME: "Имущество",
        IDPOLICYHEADER: 1291142723,
        SPOLICY_NUMBER: "SYS2063262865",
        IDPOLICY: 2063262865,
        SPRODUCTNAME2: "Домовой Коробочный",
        DFROMDATE: "2021-11-07 00:00:00.0",
        IDPRODUCT: 4,
        SPOLOBJ: "111402, Москва г, Старый Гай ул, д 4к2, кв 53",
        REL: "9649E4DAE4B5E53CE74CE4EC2A46A2AB",
        SLINK: "/cabinet/55/0/942/2063262865/1FAE4CAC171BB65C7906732800055805",
        SCOPY: "N",
        DTODATE: "2022-11-06 00:00:00.0",
        ID: 2063262865,
        SINS_PERIOD: "Действует до 06.11.2022",
        SPROLONGATION: "Нет данных",
      },
      {
        SSTATUS: "Архивные",
        SPRODUCTNAME: "Имущество",
        IDPOLICYHEADER: 1451781686,
        SPOLICY_NUMBER: "SYS2063270809",
        IDPOLICY: 2063270809,
        SPRODUCTNAME2: "Домовой Коробочный",
        DFROMDATE: "2021-11-05 00:00:00.0",
        IDPRODUCT: 4,
        SPOLOBJ: "141075, Московская обл, Королев г, Исаева ул, д 3а, кв 13",
        REL: "D0DD82ACA5D01BA55CFC50D233CDDB7F",
        SLINK: "/cabinet/55/0/942/2063270809/8922A47E7C3441A118F959AB53834688",
        SCOPY: "N",
        DTODATE: "2022-11-04 00:00:00.0",
        ID: 2063270809,
        SINS_PERIOD: "Действует до 04.11.2022",
        SPROLONGATION: "Нет данных",
      },
      {
        SSTATUS: "Архивные",
        SPRODUCTNAME: "ОСАГО",
        IDPOLICYHEADER: 1290517532,
        SPOLICY_NUMBER: "ААС5066679066",
        IDPOLICY: 2063222878,
        SPRODUCTNAME2: "ОСАГО",
        DFROMDATE: "2021-10-31 00:00:00.0",
        IDPRODUCT: 2,
        SPOLOBJ: "NISSAN TEANA; 2009; E045MK777",
        REL: "918FA3E70BBF2AD3CE51D8E4A4C8D969",
        SLINK: "/cabinet/55/0/934/2063222878/712D113CD1B8A8C942CCFAD64D0ECA8F",
        SCOPY: "N",
        DTODATE: "2022-10-30 00:00:00.0",
        ID: 2063222878,
        SINS_PERIOD: "Действует до 30.10.2022",
        SPROLONGATION: "Нет данных",
      },
      {
        SSTATUS: "Архивные",
        SPRODUCTNAME: "ДМС",
        IDPOLICYHEADER: 1978212567,
        SPOLICY_NUMBER: "1119476-13/21-Ч0",
        IDPOLICY: 1978212569,
        SPRODUCTNAME2: "Корпоративный ДМС",
        DFROMDATE: "2021-04-01 00:00:00.0",
        IDPRODUCT: 1,
        SPOLOBJ: "Гаврилов Алексей Николаевич",
        REL: "407B29D74D7F663B91111378FD6BF25B",
        SLINK: "/cabinet/55/0/937/1978212569/E42366737E1499E2AE7732903C81B094",
        SCOPY: "N",
        DTODATE: "2022-03-31 00:00:00.0",
        ID: 1978212569,
        SINS_PERIOD: "Действует до 31.03.2022",
        SPROLONGATION: "Нет данных",
      },
      {
        SSTATUS: "Архивные",
        SPRODUCTNAME: "ДМС",
        IDPOLICYHEADER: 2111489572,
        SPOLICY_NUMBER: "2017302-13/21",
        IDPOLICY: 2129499443,
        SPRODUCTNAME2: "Корпоративный ДМС",
        DFROMDATE: "2022-03-01 00:00:00.0",
        IDPRODUCT: 1,
        SPOLOBJ: "Гаврилов Алексей Николаевич",
        REL: "7B3457FB572B9916A19AFC19136541B6",
        SLINK: "/cabinet/55/0/937/2129499443/752F5E5F24F4D1EC2AA06F4F505ABA0E",
        SCOPY: "N",
        DTODATE: "2022-03-31 00:00:00.0",
        ID: 2129499443,
        SINS_PERIOD: "Действует до 31.03.2022",
        SPROLONGATION: "Нет данных",
      },
      {
        SSTATUS: "Архивные",
        SPRODUCTNAME: "Имущество",
        IDPOLICYHEADER: 1291142723,
        SPOLICY_NUMBER: "SYS1810329134",
        IDPOLICY: 1810329134,
        SPRODUCTNAME2: "Домовой Коробочный",
        DFROMDATE: "2020-11-07 00:00:00.0",
        IDPRODUCT: 4,
        SPOLOBJ: "111402, Москва г, Старый Гай ул, д 4к2, кв 53",
        REL: "61E44FD6A2005C5907716CEC416ECEA2",
        SLINK: "/cabinet/55/0/942/1810329134/6881052B7D3AB003E21EE8D8ADE512C1",
        SCOPY: "N",
        DTODATE: "2021-11-06 00:00:00.0",
        ID: 1810329134,
        SINS_PERIOD: "Действует до 06.11.2021",
        SPROLONGATION: "Нет данных",
      },
      {
        SSTATUS: "Архивные",
        SPRODUCTNAME: "Имущество",
        IDPOLICYHEADER: 1451781686,
        SPOLICY_NUMBER: "SYS1810330507",
        IDPOLICY: 1810330507,
        SPRODUCTNAME2: "Домовой Коробочный",
        DFROMDATE: "2020-11-05 00:00:00.0",
        IDPRODUCT: 4,
        SPOLOBJ: "141075, Московская обл, Королев г, Исаева ул, д 3а, кв 13",
        REL: "BCF0B3B80F4DFB9699F37CD8BCC09CBF",
        SLINK: "/cabinet/55/0/942/1810330507/4F9AD8B88AD5D32D725EB6282F617CDD",
        SCOPY: "N",
        DTODATE: "2021-11-04 00:00:00.0",
        ID: 1810330507,
        SINS_PERIOD: "Действует до 04.11.2021",
        SPROLONGATION: "Нет данных",
      },
      {
        SSTATUS: "Архивные",
        SPRODUCTNAME: "ОСАГО",
        IDPOLICYHEADER: 1290517532,
        SPOLICY_NUMBER: "РРР5041647350",
        IDPOLICY: 1834749234,
        SPRODUCTNAME2: "ОСАГО",
        DFROMDATE: "2020-10-31 00:00:00.0",
        IDPRODUCT: 2,
        SPOLOBJ: "NISSAN TEANA; 2009; E045MK777",
        REL: "586FB5EAB9538814F3EF4AFF910D03B1",
        SLINK: "/cabinet/55/0/934/1834749234/1F60EB093BF1F47B81B9347274CDECDB",
        SCOPY: "N",
        DTODATE: "2021-10-30 00:00:00.0",
        ID: 1834749234,
        SINS_PERIOD: "Действует до 30.10.2021",
        SPROLONGATION: "Нет данных",
      },
    ],
    total: 11,
    addFields: {
      SURL: "/cabinet/55/0/707-1",
      "": "",
    },
    breadCrumbs: [
      {
        text: "Личный кабинет",
        href: "/cabinet/55/0/701",
      },
      {
        text: "Мои полисы",
        to: "/cabinet/55/0/712",
      },
    ],
    listCaption: null,
    settings: {
      SONSELECTCALLBACKCOMPLETE:
        "function getAgeFromBirthday(birthday) {\n    if(birthday){\n      var totalMonths = moment().diff(birthday, 'months');\n      var years = parseInt(totalMonths / 12);\n      var months = totalMonths % 12;\n        if(months !== 0){\n           return parseFloat(years + '.' + months);\n         }\n    return years;\n      }\n    return null;\n}",
      IDADMMENUTYPE: 17,
      SGROUPMENU: "полисы",
      NCOLCOUNT: 1,
      LMODALFORMSTYLE: false,
      SCARDCAPTION: "Карточка полиса",
      SICONFILENAME: "mypolicies",
      SVJMETHOD:
        "function getAgeFromBirthday(birthday) {\n    if(birthday){\n      var totalMonths = moment().diff(birthday, 'months');\n      var years = parseInt(totalMonths / 12);\n      var months = totalMonths % 12;\n        if(months !== 0){\n           return parseFloat(years + '.' + months);\n         }\n    return years;\n      }\n    return null;\n}",
      LCLOSEAFTERSAVE: false,
      LNEW: false,
      SVJCARDGRID:
        '<div class="nb-block">\n    <div class="row nav justify-content-between align-items-center">\n        <div class="col-auto">\n            <div class="title">Мои полисы</div>\n        </div>\n        <div class="col-auto">\n          <nuxt-link to="/cabinet/55/0/707" class="link">\n            <span class="d-none d-lg-inline-block">Купить полис</span><span class="d-lg-none">Купить</span><i class="icon-green-plus"></i>\n          </nuxt-link>\n        </div>\n    </div>\n     <filter-block\n          @filter="$emit(\'filter\')"\n          :unique-items = "[\'Проекты\',\'Действующие\', \'Архивные\']"\n          :itemId="itemId"      \n           filterType="radiobutton"\n           propertyName ="SSTATUS"\n           all-items-button-name="Все полисы"\n           :showButtonAll="true"    \n           :show-filtered-items-count="true"\n           class="mt-3">\n           <action-button    \n             class="y-btn"\n             :actions="actions"\n              action-id="38706" \n             :row-id="0"\n             :rel-id="actions.find((a) => a.ID === parseInt(38706)).REL">\n             Нет нужного полиса?\n           </action-button>\n                    \n    </filter-block>\n    <filter-block\n          @filter="$emit(\'filter\')"\n          :itemId="itemId"      \n           filterType="radiobutton"\n           propertyName ="SPRODUCTNAME2"\n           all-items-button-name="Все продукты"\n           :showButtonAll="true"    \n           :show-filtered-items-count="false"\n           class="mt-4">\n    </filter-block>\n  <content-block class="row mt-2" :item-id="itemId" :params="params">\n    <template v-slot="data">\n        <div class="filters-block-title mt-4" v-if="data.list.items?.filter(item=>item.SSTATUS === \'Проекты\').length > 0 && filters.length === 0">Проекты</div>\n        <div v-for="item in data.list.items?.filter(item=>item.SSTATUS ===\'Проекты\')" class="col-12 col-lg-4 mt-3" :key="item.ID">\n        \n        <!--Проекты ОСАГО линкуем на client.reso.ru-->\n        <div v-if="item.SPRODUCTNAME2===\'ОСАГО\'"> \n        <a :href="item.SLINK" class="freecard br30 free" target="_blank">\n                  <div :data-id="item.IDPRODUCT" class="block-policy  block-policy_small">\n                    <div v-if="item.NSUM_TO_PAY>0" class="pay-notification">\n                    <div v-if="$moment(new Date()).format(\'DD.MM.YYYY\')  === $moment(item.DACCRUAL_DATE).format(\'DD.MM.YYYY\')">Истекает</div>\n                    <div v-else>Оплатите до {{ $moment(item.DACCRUAL_DATE).format("DD.MM.YYYY") }}</div>\n                    </div>   \n                    <div v-else> <div class="pay-notification">Продолжить оформление</div>  </div>\n                    <div class="title" data-title="SPRODUCTNAME2" v-html="item.SPRODUCTNAME2"></div>\n                    <div class="description">                       \n                        <!--<div class="policy-number" v-text="item.SPOLICY_NUMBER" />  -->\n                        <div class="policy-object" v-text="item.SPOLOBJ" />\n                        <div class="date" v-text="item.SINS_PERIOD"/> \n                        <div v-if="item.NSUM_TO_PAY>0" class="block-pay-btn">\n                          <button class="btn btn-secondary" :rel-id="item.SREL_ACCRUAL" :row-id="item.IDACCRUAL" :actions="actions" action-id="38424" >   \n                            Оплатить&nbsp;&nbsp;{{ new Intl.NumberFormat(\'ru-RU\', { style: \'currency\', currency: \'RUB\', minimumFractionDigits: 0 }).format(item.NSUM_TO_PAY) }}    \n                           <!--class="policy-payment"-->\n                          </button>                                                                                                                                 \n                        </div>                                                                                                                                \n                    </div>\n                </div>\n        </a>  \n        </div>\n        \n        <div v-else>\n        \n        <nuxt-link :to="item.SLINK || \'\'"  class="freecard br30 free" >      \n                <div :data-id="item.IDPRODUCT" class="block-policy  block-policy_small">\n                    <div v-if="item.NSUM_TO_PAY>0" class="pay-notification">\n                    <div v-if="$moment(new Date()).format(\'DD.MM.YYYY\')  === $moment(item.DACCRUAL_DATE).format(\'DD.MM.YYYY\')">Истекает</div>\n                    <div v-else>Оплатите до {{ $moment(item.DACCRUAL_DATE).format("DD.MM.YYYY") }}</div>\n                    </div>  \n                    <div v-else> <div class="pay-notification">Продолжить оформление</div>  </div>\n                    <div class="title" data-title="SPRODUCTNAME2" v-html="item.SPRODUCTNAME2"></div>\n                    <div class="description">                       \n                        <div class="policy-number" v-text="item.SPOLICY_NUMBER" />  \n                        <div class="policy-object" v-text="item.SPOLOBJ" />\n                        <div class="date" v-text="item.SINS_PERIOD"/> \n                        <div v-if="item.NSUM_TO_PAY>0" class="block-pay-btn">\n                          <button class="btn btn-secondary" :rel-id="item.SREL_ACCRUAL" :row-id="item.IDACCRUAL" :actions="actions" action-id="38424" >   \n                            Оплатить&nbsp;&nbsp;{{ new Intl.NumberFormat(\'ru-RU\', { style: \'currency\', currency: \'RUB\', minimumFractionDigits: 0 }).format(item.NSUM_TO_PAY) }}    \n                           <!--class="policy-payment"-->\n                          </button>                                                                                                                                 \n                        </div>                                                                                                                                \n                    </div>\n                </div>\n        </nuxt-link>\n        </div>   \n        \n        \n        </div>\n        <div class="filters-block-title mt-4" v-if="data.list.items?.filter(item=>item.SSTATUS === \'Действующие\').length > 0 && filters.length === 0">Действующие</div>\n        <div v-for="item in data.list.items?.filter(item=>item.SSTATUS === \'Действующие\')" class="col-12 col-lg-4 mt-3">  \n<!--            <open-card-button class="freecard br30" :relId="item.REL" :moduleId="moduleId" :menuId="712" :itemId="item.ID">-->\n<nuxt-link :to="item.SLINK || \'\'" class="freecard br30 free" >     \n                <div :data-id="item.IDPRODUCT" class="block-policy  block-policy_small"> \n                <div class="pay-notification" v-if="item.SPROLONGATION!=\'Нет данных\'">\n                    <div v-text="item.SPROLONGATION"/>\n                </div>\n                <div class="title" data-title="SPRODUCTNAME2" v-html="item.SPRODUCTNAME2"></div>           \n                    <div class="description"> \n                        <div class="d-none" v-text="data.getAddField(\'SURL\')" />\n                        <div class="policy-number" v-text="item.SPOLICY_NUMBER" />\n                        <div class="policy-object" v-text="item.SPOLOBJ" />\n                        <div class="date" v-text="item.SINS_PERIOD"/>\n                                  \n                    </div>\n                </div>\n</nuxt-link>\n<!--            </open-card-button>-->\n        </div>\n        <div class="filters-block-title mt-4" v-if="data.list.items?.filter(item=>item.SSTATUS === \'Архивные\').length > 0 && filters.length === 0">Архивные</div>\n        <div v-for="item in data.list.items?.filter(item=>item.SSTATUS === \'Архивные\')" class="col-12 col-lg-4 mt-3">\n<!--            <open-card-button class="freecard br30" :relId="item.REL" :moduleId="moduleId" :menuId="712" :itemId="item.ID">-->\n<nuxt-link :to="item.SLINK || \'\'" class="freecard br30 free" >\n            <div :data-id="item.IDPRODUCT" class="block-policy  block-policy_small">  \n            <div class="pay-notification" v-if="item.SCOPY===\'Y\'">Купить еще раз</div> \n                <div class="title" data-title="SPRODUCTNAME2" v-html="item.SPRODUCTNAME2"></div>\n                <div class="description">\n                    <div class="policy-number" v-text="item.SPOLICY_NUMBER" />\n                    <div class="policy-object" v-text="item.SPOLOBJ" />\n                    <div class="date" v-text="item.SINS_PERIOD"/>                        \n                </div>\n            </div>\n            </nuxt-link>\n<!--            </open-card-button>-->\n\n        </div>\n       \n    </template>\n  </content-block>\n  <div v-if="isEmptyContent" class="border-block mt-2 mt-lg-0 mb-lg-4">       <!-- px-4 mx-2 !-->\n        У Вас нет полиса, который удовлетворяет данным критериям. Выберите себе\n        <!--Сейчас у вас нет действующих полисов, но это легко исправить! \n        <!--Оформите полис \n        <!--<NLink to="https://client.reso.ru" class="color-green">ОСАГО</NLink>   !-->\n        <!--<a class="color-green" href="https://client.reso.ru">ОСАГО</a>          !-->\n        <!--или выберите себе                                         !-->\n        <NLink to="/cabinet/55/0/707" class="color-green">подходящий продукт</NLink>  \n    </div>\n</div>',
      LEDIT: false,
      ID: 9067,
      IDITEM: 712,
      LSHOW: true,
      ONETOMANYCUR: [],
      IDPARENT: 0,
      LNEWRECORDMETHOD: false,
      LSHOWVUE: true,
      WIZARDCUR: [],
      LDELETE: false,
      FILTERCUR: [],
      SNAME: "Мои полисы",
      NONETOMANY: 0,
      LCANLIST: false,
      NORDER: 21,
      LNOTCARD: false,
      ACTIONSCUR: [
        {
          LUSEINCARD: true,
          LIDLIST: false,
          LSELECTDEFAULT: false,
          NITEM: 712,
          LCREATEBUTTON: false,
          LCHECKACCESS: false,
          LINLIST: false,
          LOUTPARAM: false,
          LWITHCOMMIT: false,
          ID: 38706,
          LCURWINDOW: false,
          LMULTISELECT: false,
          ADMDATE: "24.10.2022 17:05:33",
          SCONST: "959",
          SNAME: "Поиск полиса",
          LFREEZONE: false,
          LREQUESTCODE: false,
          LCLOSEAFTER: false,
          LINACTIONS: true,
          ADMUSER: "DELEA",
          LREFRESH: false,
          REL: "27B6A6241D0C1322C5B2A9F4B3B1B2F8",
          SFIELD: "id",
          NTYPE: 2,
          LHIDEDLG: false,
          IDADMMODULE: 55,
          LHIDEINLIST: false,
          LTOOLBAR: false,
        },
        {
          LUSEINCARD: true,
          LIDLIST: false,
          LSELECTDEFAULT: false,
          NITEM: 712,
          LCREATEBUTTON: false,
          LCHECKACCESS: false,
          LINLIST: false,
          LOUTPARAM: true,
          LWITHCOMMIT: false,
          ID: 38319,
          LCURWINDOW: false,
          LMULTISELECT: false,
          ADMDATE: "10.08.2022 17:34:42",
          SCONST: "i3.pkg_lk_utils.GenerateUrlForRepeatSendPolicyDocs",
          SNAME: "Отправить полис на e-mail",
          LFREEZONE: false,
          LREQUESTCODE: false,
          LCLOSEAFTER: false,
          LINACTIONS: true,
          ADMUSER: "DELEA",
          LREFRESH: false,
          REL: "28F7B17EAD40EE09A35410FF9A02787A",
          SFIELD: "Id",
          NTYPE: 4,
          LHIDEDLG: true,
          IDADMMODULE: 55,
          LHIDEINLIST: false,
          LTOOLBAR: false,
        },
        {
          LUSEINCARD: true,
          LIDLIST: false,
          LSELECTDEFAULT: false,
          NITEM: 712,
          LCREATEBUTTON: false,
          LCHECKACCESS: false,
          LINLIST: false,
          LOUTPARAM: true,
          LWITHCOMMIT: false,
          ID: 38424,
          LCURWINDOW: false,
          LMULTISELECT: false,
          ADMDATE: "26.08.2022 13:14:10",
          SCONST: "i3.pkg_lk_utils.PayLinkAccrual",
          SNAME: "Оплатить",
          LFREEZONE: false,
          LREQUESTCODE: false,
          LCLOSEAFTER: false,
          LINACTIONS: true,
          ADMUSER: "SMIAVI",
          LREFRESH: false,
          REL: "17ACAED3CB42CA9D3758C4B260485541",
          SFIELD: "id",
          NTYPE: 4,
          LHIDEDLG: true,
          IDADMMODULE: 55,
          LHIDEINLIST: false,
          LTOOLBAR: false,
        },
      ],
      LFIRSTLOADRECORD: true,
      LTABBED: false,
      LPRINT: false,
    },
    subSettings: {
      name: "Мои полисы",
      url: "/cabinet/55/0/712",
      id: 9067,
      icon: "",
      iconFileName: "mypolicies",
      idItem: 712,
      idParent: 0,
      parentMenu: null,
      compType: 17,
      recordLoad: true,
      newRecord: false,
      filters: [],
      actions: [
        {
          label: "Поиск полиса",
          id: 38706,
          type: 2,
          command: "959",
          relaction: "27B6A6241D0C1322C5B2A9F4B3B1B2F8",
          isDialog: true,
          isCurrentWindow: false,
          field: "id",
          refresh: false,
          closeAfter: false,
        },
        {
          label: "Отправить полис на e-mail",
          id: 38319,
          type: 4,
          command: "i3.pkg_lk_utils.GenerateUrlForRepeatSendPolicyDocs",
          relaction: "28F7B17EAD40EE09A35410FF9A02787A",
          isDialog: false,
          isCurrentWindow: false,
          field: "Id",
          refresh: false,
          closeAfter: false,
        },
        {
          label: "Оплатить",
          id: 38424,
          type: 4,
          command: "i3.pkg_lk_utils.PayLinkAccrual",
          relaction: "17ACAED3CB42CA9D3758C4B260485541",
          isDialog: false,
          isCurrentWindow: false,
          field: "id",
          refresh: false,
          closeAfter: false,
        },
      ],
      tabs: [],
      add: false,
      edit: false,
      delete: false,
      cols: 1,
      isCard: false,
      isWizard: false,
      isForm: false,
      isPortal: true,
      isTelemed: false,
      wizard: [],
      portalgrid: null,

      isModal: false,
      closeAfterSave: false,
      groupmenu: "полисы",
      isVisible: true,
      newCount: null,
    },
  };

  const getters = {
    getUnfilteredBlockById: () => {},
  };

  const getStoreConfig = () => ({
    stateStore,
    gettersStore,
    mutationsStore,
    actionsStore,
  });

  const createComponent = () => {
    const store = new Vuex.Store(getStoreConfig);
    wrapper = shallowMount(FilterBlock, {
      propsData: {
        propertyName: filterProperyName,
        itemId: filterItemId,
        showFilteredItemsCount: filterShowFilteredItemsCount,
      },
      mocks: {
        $store: store,
        $route: route,
        getUnfilteredBlockById: { data: dataObj, dataId: "712" },
      },
    });
  };
  it("отображает FilterBlock", () => {
    createComponent();
  });
});

// describe("FilterBlock", () => {
//   const filterProperyName = "SSTATUS";
//   const filterItemId = "712";
//   const filterShowFilteredItemsCount = true;
//   const filterRouteQuery = [
//     { propertyName: "SSTATUS", filter: ["Действующие"], id: "712" },
//   ];

//   const route = {
//     fullPath:
//       "/cabinet/55/0/712?filters=%5B%7B%22propertyName%22%3A%22SSTATUS%22,%22filter%22%3A%5B%22%D0%94%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D1%83%D1%8E%D1%89%D0%B8%D0%B5%22%5D,%22id%22%3A%22712%22%7D%5D",
//     hash: "",
//     meta: "Cabinet",
//     name: undefined,
//     params: {
//       idModule: "55",
//       idParent: "0",
//       idItem: "712",
//     },
//     path: "/cabinet/55/0/712",
//     query: {
//       filters:
//         '[{"propertyName":"SSTATUS","filter":["Действующие"],"id":"712"}]',
//     },
//   };

//   let store;
//   let state;
//   let getters;
//   let actions;
//   let mutations;

//   const filterItem = [
//     {
//       name: "Корпоративный ДМС",
//       isChecked: false,
//     },
//     {
//       name: "ОСАГО",
//       isChecked: false,
//     },
//     {
//       name: "Домовой Коробочный",
//       isChecked: false,
//     },
//   ];

//   beforeEach(() => {
//     state = stateStore;
//     getters = gettersStore;
//     actions = actionsStore;
//     mutations = mutationsStore;
//     Vue.use(Vuex, BootstrapVue);
//     store = new Vuex.Store({
//       state,
//       getters: {
//         filterItems: () => filterItem,
//       },
//       actions,
//       mutations,
//     });
//   });

//   it("test", async () => {
//     const wrapper = mount(FilterBlock, {
//       propsData: {
//         propertyName: filterProperyName,
//         itemId: filterItemId,
//         showFilteredItemsCount: filterShowFilteredItemsCount,
//       },
//       mocks: {
//         $store: {
//           store,
//           commit: () => null,
//           // filterItems()=>
//         },
//         $route: route,
//       },
//     });
//     expect(wrapper).not.toBe(null);
//   });
// });
