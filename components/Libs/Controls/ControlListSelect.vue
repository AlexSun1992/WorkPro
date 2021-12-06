<template>
  <!-- <content-block :itemId="itemId">
    <div :item="itemId">
      <v-runtime-template
        :itemId="itemId"
        :template="getData"
      ></v-runtime-template>
    </div>
  </content-block> -->
  <!-- <div>
    <template :itemId="itemId" v-html="getTemplate"></template>
  </div> -->

  <div v-click-outside="outside" :itemId="itemId">
    <b-form-group
      :label="data.label"
      :class="{ required: data.required }"
      :label-for="data.name"
      :itemId="itemId"
    >
      <b-input
        v-model="data.value.text || 'Выберите из списка'"
        :readonly="true"
        class="mb-2"
        :class="visible ? null : 'collapsed'"
        :aria-expanded="visible ? 'true' : 'false'"
        aria-controls="collapse-4"
        @click="openList"
      >
        {{ data.value.text || "Выберите из списка" }}
      </b-input>
      <b-collapse
        id="collapse-4"
        v-model="visible"
        class="mt-2"
        :itemId="itemId"
      >
        <content-block
          class="mypolices-all-block"
          :item-id="itemId"
          :itemId="itemId"
        >
          <v-runtime-template
            :itemId="itemId"
            :template="getData"
          ></v-runtime-template>
          <!-- <template v-slot:data="data">
            <div>
              <div class="mypolices-block" :data-id="data.content.IDPRODUCT">
                <div class="mypolices-title">
                  {{ data.content.SSECONDNAME }} {{ data.content.SFIRSTNAME }}
                  {{ data.content.STHIRDNAME }}
                </div>
                <div class="img-mypolices-img"></div>
                <div class="mypolices-name">
                  {{
                    data.content.SPOLOBJ && data.content.SPOLOBJ.match(/г\/н/)
                      ? data.content.SPOLOBJ.trim()
                          .split(/; +г\/н: +/)
                          .shift()
                          .trim()
                      : data.content.SPOLOBJ
                  }}
                </div>

                <div class="mypolices-info">
                  <div class="mypolices-number">
                    {{ data.content.SPOLICY }}
                  </div>
                  <div class="mypolices-time">
                    Срок действия:
                    <b>
                      {{
                        $moment(data.content.TO_DATE).locale("ru").fromNow(true)
                      }}</b
                    >
                    ({{ data.content.TO_DATE | moment("DD.MM.YYYY") }})
                  </div>
                </div>
                <div
                  class="
                    block-footer
                    row
                    px-0
                    justify-content-between
                    align-items-center
                  "
                >
                  <NLink
                    :to="`/cabinet/55/0/901?SPOLICY=${data.content.SPOLICY}`"
                    ><div>Перейти к полису</div></NLink
                  >
                  <NLink to="/cabinet/55/0/905?SPOLICY=306526-13/21"
                    ><div>Список ЛПУ</div></NLink
                  >
                </div>
              </div>
            </div>
          </template> -->
        </content-block>
      </b-collapse>
    </b-form-group>
  </div>
</template>

<script>
import Grid from "../Table/Grid";
import VRuntimeTemplate from "v-runtime-template";
import ContentBlock from "../../Pages/Cabinet/Block/ContentBlock.vue";
import FilterBlock from "../../Pages/Cabinet/Block/ContentBlock.vue";

export default {
  name: "ControlListSelect",
  components: { Grid, VRuntimeTemplate, ContentBlock, FilterBlock },
  data() {
    return {
      visible: false,
      isLoad: false,
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
    itemId: {
      type: String,
      required: true,
      default: () => 900,
    },
  },
  computed: {
    dataContent: {
      get: function () {
        const block = this.$store.getters["blocks/getUnfilteredBlockById"](
          this.data.menudic
        );
        if (block) {
          return block.data;
        } else {
          return {};
        }
      },
    },
    getData: {
      get: function () {
        const data = this.$store.getters["menu/getMenuById"](
          this.data.menudic
        ).SVJCARDGRID;
        if (data) {
          return data;
        }
      },
    },
  },
  methods: {
    selectItem(value) {
      this.visible = false;
      this.$store.commit("data_card/setFilters", value.data.item);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {
          value: value.data.item,
          text:
            value.data.item[this.data.name.substring(2)] ||
            value.data.item[this.dataContent.fields[1].label],
        },
      });
    },
    outside() {
      if (this.visible) {
        this.visible = false;
      }
    },
    async openList() {
      this.visible = !this.visible;
      if (this.visible) {
        try {
          this.isLoad = true;
          await this.$store.dispatch("blocks/fetchBlock", {
            id: this.data.menudic,
            query: this.$store.getters["data_card/getFilters"],
          });
          this.isLoad = false;
        } catch (err) {
          console.log(err);
        }
      }
    },
  },
  directives: {
    clickOutside: {
      bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind: function (el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
};
</script>

<style scoped></style>
