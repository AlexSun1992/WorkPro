<template>
  <div class="blk-shadow br30 p-3 p-lg-4">
    <div
      class="row justify-content-center"
      v-if="hasNoActivePolicies"
    >
      <div class="col-12 col-lg-6 text-center">
        <img
          src="/img/ill_MainCategory_Search.png"
          class="m-auto"
        />
        <h5 class="mt-3">Нет действующих полисов</h5>
        Возможно срок действия полисов истек.<br />Если нет нужного полиса, воспользуйтесь поиском, чтобы найти его
        <ActionButton
          action-id="45459"
          class="btn-secondary btn-icon mt-3 d-table m-auto"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            class="me-2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.089 16.9106L14.3065 13.1282C15.259 11.9215 15.8332 10.4023 15.8332 8.74984C15.8332 4.844 12.6557 1.6665 8.74984 1.6665C4.844 1.6665 1.6665 4.844 1.6665 8.74984C1.6665 12.6557 4.844 15.8332 8.74984 15.8332C10.4032 15.8332 11.9215 15.2598 13.1282 14.3065L16.9107 18.089C17.0732 18.2515 17.2865 18.3332 17.4998 18.3332C17.7132 18.3332 17.9265 18.2515 18.089 18.089C18.4148 17.7632 18.4148 17.2365 18.089 16.9106ZM3.33317 8.74984C3.33317 5.76317 5.76317 3.33317 8.74984 3.33317C11.7365 3.33317 14.1665 5.76317 14.1665 8.74984C14.1665 11.7365 11.7365 14.1665 8.74984 14.1665C5.76317 14.1665 3.33317 11.7365 3.33317 8.74984Z"
              fill="#FE7333"
            />
          </svg>

          Найти нужный полис
        </ActionButton>
      </div>
    </div>
    <div
      class="row"
      v-else
    >
      <div class="col-12 col-lg-12">
        <label>Застрахованный</label>
        <ServerFilterBlock
          :menu-dic="String(itemId)"
          query-param-name="IDMEDPARTNER"
          fk="SNAME"
          name="Выберите застрахованного"
          id-param-name="IDMEDPARTNER"
          id="IDMEDPARTNER"
          :required="true"
          :is-show-as-template="false"
          class="icon-ppl"
        />
      </div>
      <div class="col-12"></div>

      <div v-if="flags.showAgr">
        <div class="row">
          <div class="col-12 col-lg-9">
            <div class="title-page">
              <br />
              Подтвердите согласие на обработку данных
            </div>
            <!-- для юзера и его детей -->
            <div v-if="flags.userOrChildren">
              <div class="phb2 fw-normal">
                Для доступа к разделу "Здоровье" необходимо подписать согласие на обработку персональных данных с
                помощью простой электронной подписи (ПЭП)
              </div>
              <a
                :href="content[0].SURL_SHOWAGR"
                class="btn btn-primary mt-3"
              >
                Перейти к подписанию
              </a>
            </div>
            <!-- для взрослого родственника -->
            <div v-if="flags.oldRelative">
              <div class="phb2 fw-normal">
                Для доступа к разделу "Здоровье" необходимо, чтобы ваш родственник подтвердил согласие на обработку
                персональных данных в своем личном кабинете
              </div>
            </div>
            <div v-else-if="flags.youngUser">
              <div class="phb2 fw-normal">
                Для доступа к разделу "Здоровье" необходимо, чтобы законный представитель подтвердил согласие на
                обработку персональных данных в своем личном кабинете
              </div>
            </div>
          </div>
          <div class="d-none d-lg-block col-lg-3 text-end">
            <img
              src="/system/modules/ru.reso.v2/resources/img/icons/ill_Health_Application_g.png"
              width="151"
              height="164"
            />
          </div>
        </div>
      </div>

      <div v-if="flags.showAgrN">
        <div v-if="flags.showAgrInfo">
          <div class="row"></div>
          <div class="row">
            <div class="col-12 col-lg-9">
              <div class="title-page">
                <br />
                Подтвердите согласие на обработку данных
              </div>
              <div v-if="flags.userOrChildren">
                <div class="phb2 fw-normal">
                  Вам необходимо подписать согласие на обработку персональных данных с помощью простой электронной
                  подписи (ПЭП)
                </div>
                <a
                  :href="content[0].SURL_SHOWAGR"
                  class="btn btn-primary mt-3"
                >
                  Перейти к подписанию
                </a>
              </div>
              <div v-if="flags.oldRelative">
                <div class="phb2 fw-normal">
                  Необходимо, чтобы ваш родственник подтвердил согласие на обработку персональных данных в своем личном
                  кабинете
                </div>
              </div>
              <div v-else-if="flags.youngUser">
                <div class="phb2 fw-normal">
                  Необходимо, чтобы законный представитель подтвердил согласие на обработку персональных данных в своем
                  личном кабинете
                </div>
              </div>
            </div>

            <div class="d-none d-lg-block col-lg-3 text-end">
              <img
                src="/system/modules/ru.reso.v2/resources/img/icons/ill_Health_Application_g.png"
                width="151"
                height="164"
              />
            </div>
          </div>
        </div>

        <div
          class="border-block mt-3"
          v-if="hasUpcomingAppointments"
        >
          <div class="row nav justify-content-between align-items-center">
            <div class="col-auto">
              <div class="title">Предстоящие записи</div>
            </div>
            <div class="col-auto">
              <a
                :href="`/cabinet/55/0/882/?name=FKSPOLICY&IDMEDPARTNER=${idMedPartner}`"
                class="link d-block"
              >
                <span class="d-none d-lg-inline-block">Смотреть все</span>
                <span class="d-lg-none">Все</span>
                <i class="icon-chevron-r"></i>
              </a>
            </div>
          </div>
          <div
            :data="{}"
            :item-id="itemId"
            class="row mt-3"
          >
            <template v-if="hasItems">
              <div
                v-for="item in list883.items"
                class="col-12 col-lg-6 mt-3 position-relative"
                :key="item.ID"
                :id="item.ID"
              >
                <nuxt-link
                  :to="item.SURL"
                  class="free"
                >
                  <div
                    class="block-visit"
                    :class="item.SSTATUS === 'Планируется' ? 'have_btn' : ''"
                  >
                    <div class="title">{{ item.SSPECIALIST }}</div>
                    <div class="clinic">{{ item.SLPU }}</div>
                    <div class="planning planned">{{ item.SSTATUS }}</div>
                    <div class="date">{{ formatTime(item.DTIME) }}&nbsp;&nbsp;{{ item.DDATE }}</div>
                    <div class="name">{{ item.SNAME }}</div>
                  </div>
                </nuxt-link>
                <ActionButton
                  v-if="item.SSTATUS === 'Планируется'"
                  :actions="menuActions"
                  action-id="45114"
                  :body="[{ name: 'IDMEDPARTNER', value: item.IDMEDPARTNER }]"
                  :rel-id="item.REL883"
                  :row-id="item.ID"
                  class="cancel-doctor h48 btn-secondary"
                >
                  Отменить
                </ActionButton>
              </div>
            </template>
          </div>
        </div>

        <div
          v-if="hasItemsAndFilter"
          class="healt-box mt-3"
        >
          <!-- Блоки с кнопками  -->

          <div
            class="healt-blk"
            v-if="flags.LSHOWBUTTON_CLINIC"
          >
            <img src="/img/ill_Health_BookToDoctor.png" />
            <div class="healt-blk-title">Записаться к врачу</div>
            <div class="healt-blk-btn">
              <a
                :href="`/cabinet/55/0/872/0?name=FKSPOLICY&IDMEDPARTNER=${idMedPartner}`"
                class="link d-block"
                v-if="flags.LSHOWONLINE"
              >
                <div class="healt-btn">
                  <div class="healt-btn-title">Онлайн</div>
                  <div class="healt-btn-dsc">Выберите клинику, специалиста и удобное время для записи</div>
                </div>
              </a>

              <a
                :href="`/cabinet/55/0/868/0?name=FKSPOLICY&IDMEDPARTNER=${idMedPartner}`"
                v-if="flags.LSHOWCALLCENTR"
              >
                <div class="healt-btn">
                  <div class="healt-btn-title">Через Центр медицинской поддержки</div>
                  <div class="healt-btn-dsc">Оформите заявку на запись к врачу через Центр медицинской поддержки</div>
                </div>
              </a>

              <a
                :href="`/cabinet/55/0/1140/0?SPOLICY=${idMedPartner}`"
                class="link d-block"
                v-if="flags.LSHOWEVOGEN"
              >
                <div class="healt-btn">
                  <div class="healt-btn-title">Запись на исследование Эвоген</div>
                  <div class="healt-btn-dsc">Запишитесь на исследование Эвоген</div>
                </div>
              </a>

              <a
                :href="`/cabinet/55/0/870/0?name=FKSPOLICY&IDMEDPARTNER=${idMedPartner}`"
                v-if="flags.LSHOWDIRECTLYCLINIC"
              >
                <div class="healt-btn">
                  <div class="healt-btn-title">По телефону</div>
                  <div class="healt-btn-dsc">Позвоните в выбранную клинику и запишитесь на прием</div>
                </div>
              </a>
            </div>
          </div>

          <a
            :href="`/cabinet/55/0/907/0?name=FKSPOLICY&IDMEDPARTNER=${idMedPartner}`"
            v-if="flags.LSHOWPND"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_CallDoctor.png" />
              <div class="healt-blk-title">Вызвать врача на дом</div>
            </div>
          </a>

          <a
            :href="`/cabinet/55/0/885/0/${idMedPartner}`"
            v-if="flags.LSHOWPROGRAM"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_Programm.png" />
              <div class="healt-blk-title">Список клиник</div>
            </div>
          </a>

          <!-- Новая кнопка запроса ГП -->
          <a
            :href="`/cabinet/55/0/1205/0?name=FKSPOLICY&IDMEDPARTNER=${idMedPartner}`"
            v-if="flags.LSHOWBUTTON_GL"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_OrderWarrantyLetter.png" />
              <div class="healt-blk-title">Запросить гарантийное письмо</div>
            </div>
          </a>

          <!-- переход на сайт телемедицины href="https://telemed.reso.ru/DMSResoRu/reso_policies" -->
          <a
            :href="'https://telemed.reso.ru/DMSResoRu/reso_iframe?token=' + content[0].ACCESSTOKEN"
            v-if="flags.LSHOWTELEMED"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_Telemedicine.png" />
              <div class="healt-blk-title">Телемедицина</div>
            </div>
          </a>

          <a
            href="-"
            v-if="flags.LSHOWCHAT_DMS"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_ChatDMS.png" />
              <div class="healt-blk-title">Чат ДМС</div>
            </div>
          </a>

          <a
            :href="`/cabinet/55/0/882?name=FKSPOLICY&IDMEDPARTNER=${idMedPartner}`"
            v-if="flags.LSHOWCALLLIST"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_HistoryAppeal.png" />
              <div class="healt-blk-title">История обращений</div>
            </div>
          </a>

          <a
            :href="`/cabinet/55/0/790?name=FKSPOLICY&IDMEDPARTNER=${idMedPartner}`"
            v-if="flags.LSHOWRESULTS"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_Analyze.png" />
              <div class="healt-blk-title">Медицинская карта MedSwiss</div>
            </div>
          </a>

          <a
            href="/cabinet/55/0/850"
            v-if="flags.LSHOWREPAY"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_ApplicationCompensation.png" />
              <div class="healt-blk-title">Заявление на возмещение</div>
            </div>
          </a>

          <a
            :href="`/cabinet/55/0/919/0?name=FKSPOLICY&IDMEDPARTNER=${idMedPartner}`"
            v-if="flags.LSHOWVZR"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_TravelBonuses.png" />
              <div class="healt-blk-title">Оформить туристический полис</div>
            </div>
          </a>

          <a
            :href="`/cabinet/55/0/928/0?name=FKSPOLICY&IDMEDPARTNER=${idMedPartner}`"
            v-if="flags.LSHOWCHOICE"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_AdditionalOptionsDMS.png" />
              <div class="healt-blk-title">Настройка программы страхования</div>
            </div>
          </a>

          <a
            href="/cabinet/55/0/1194"
            v-if="flags.LSHOWCHECKUP"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_ResoCheck.png" />
              <div class="healt-blk-title">Оценка здоровья</div>
            </div>
          </a>

          <a
            href="/cabinet/55/0/1120"
            v-if="flags.LSHOWATTACH"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_Add_Or_Change.png" />
              <div class="healt-blk-title">Подключить или изменить программу ДМС</div>
            </div>
          </a>

          <div v-if="flags.LSHOWDOBROSERV">
            <a
              href="https://lk.dobroservice.com/Identification"
              v-if="flags.LSHOWATTACH"
              target="_blank"
            >
              <div class="healt-blk">
                <img src="/img/ill_Health_Dobroservice.png" />
                <div class="healt-blk-title">Добросервис</div>
              </div>
            </a>
          </div>

          <a
            href="https://resovip6.ru/insurance_programs"
            v-if="flags.LSHOWRESOVIP"
          >
            <div class="healt-blk">
              <img src="/img/ill_Health_ClubVIP.png" />
              <div class="healt-blk-title">Клуб привилегий</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";
import { useContext } from "@nuxtjs/composition-api";
import ServerFilterBlock from "@/components/Pages/Cabinet/Block/ServerFilterBlock/ServerFilterBlock.vue";
import ActionButton from "@/components/Pages/Cabinet/Block/ActionButton.vue";

export default defineComponent({
  name: "ControlHealth",
  components: { ActionButton, ServerFilterBlock },
  props: {
    data: {
      type: Object,
      default: () => ({ list: { items: [] }, filters: [] }),
    },
    itemId: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    const { store } = useContext();

    const isEmptyContent = computed(() => {
      const block = store.getters["blocks/getBlockById"](props.itemId);

      return !block?.data?.items.length;
    });

    const filters = computed(() => props.data?.filters ?? []);
    const content = computed(() => props.data?.content ?? []);
    const list = computed(() => props.data?.list ?? {});
    const list883 = computed(() => store.getters["blocks/getBlockById"](883)?.data);
    const hasFilterOption = (key, value) => filters.value?.some((item) => item.filterOptions?.[key] === value);

    const idMedPartner = computed(
      () => filters.value?.find((item) => item.propertyName === "IDMEDPARTNER")?.filter || ""
    );

    const flags = computed(() => ({
      LSHOWCALLLIST: hasFilterOption("LSHOWCALLLIST", "Y"),
      LSHOWRESOVIP: hasFilterOption("LSHOWRESOVIP", "Y"),
      LSHOWDOBROSERV: hasFilterOption("LSHOWDOBROSERV", "Y"),
      LSHOWATTACH: hasFilterOption("LSHOWATTACH", true),
      LSHOWCHOICE: hasFilterOption("LSHOWCHOICE", "Y"),
      LSHOWVZR: hasFilterOption("LSHOWVZR", "Y"),
      LSHOWREPAY: hasFilterOption("LSHOWREPAY", true),
      LSHOWRESULTS: hasFilterOption("LSHOWRESULTS", true),
      LSHOWCHAT_DMS: hasFilterOption("LSHOWCHAT_DMS", true),
      LSHOWTELEMED: hasFilterOption("LSHOWTELEMED", true),
      LSHOWBUTTON_GL: hasFilterOption("LSHOWBUTTON_GL", true),
      LSHOWPROGRAM: hasFilterOption("LSHOWPROGRAM", true),
      LSHOWPND: hasFilterOption("LSHOWPND", "Y"),
      LSHOWDIRECTLYCLINIC: hasFilterOption("LSHOWDIRECTLYCLINIC", "Y"),
      LSHOWEVOGEN: hasFilterOption("LSHOWEVOGEN", "Y"),
      LSHOWCALLCENTR: hasFilterOption("LSHOWCALLCENTR", "Y"),
      LSHOWONLINE: hasFilterOption("LSHOWONLINE", "Y"),
      LSHOWBUTTON_CLINIC: hasFilterOption("LSHOWBUTTON_CLINIC", true),
      LSHOWCHECKUP: hasFilterOption("LSHOWCHECKUP", true),
      showAgr: hasFilterOption("LSHOWAGR", "Y"),
      showAgrN: hasFilterOption("LSHOWAGR", "N"),
      showAgrInfo: hasFilterOption("LSHOWAGR_INFO", "Y"),
      oldRelative: hasFilterOption("LOLDRELATIVE", true),
      youngUser: hasFilterOption("LYOUNGUSER", true),
      userOrChildren: filters.value?.some(
        (item) => item.filterOptions?.LOLDRELATIVE === false && item.filterOptions?.LYOUNGUSER === false
      ),
    }));

    const hasNoActivePolicies = computed(
      () => list.value && list.value.items && !list.value.items.length && filters.value
    );

    const hasUpcomingAppointments = computed(() => {
      const block883 = store.getters["blocks/getBlockById"](883)?.data;

      return Boolean(filters.value?.[0]?.filter && block883?.items?.length && !isEmptyContent.value);
    });
    const hasItemsAndFilter = computed(() => list.value?.items && filters.value?.[0]?.filter);
    const hasItems = computed(() => list883.value?.total > 0);

    const formatTime = (time) =>
      time
        ?.replace(".", ":")
        .replace(/[a-zа-яё]/gi, "")
        .replace(".", "")
        .trim();

    const menuActions = computed(() => store.getters["menu/getMenuById"](883)?.ACTIONSCUR);

    return {
      isEmptyContent,
      filters,
      content,
      list,
      idMedPartner,
      flags,
      hasNoActivePolicies,
      hasUpcomingAppointments,
      hasItemsAndFilter,
      hasItems,
      formatTime,
      menuActions,
      list883,
    };
  },
});
</script>

<style scoped>
.healt-blk img {
  width: 100px;
  height: 100px;
}
</style>
