<template>
  <!-- <div>
    <slot name="data" v-for="item in dataContent.items" v-bind:content="item">
    </slot>
    <slot :update="update" v-bind:content="dataContent.items"> </slot>
  </div> -->

  <div>
    <b-form-group
      :label="isButtonRender.label"
      :class="{ required: isButtonRender.required }"
      :label-for="isButtonRender.name"
    >
      <b-input
        v-model="isButtonRender.value.text || 'Выберите из списка'"
        :readonly="true"
        class="mb-2"
        aria-controls="collapse-4"
        @click="openList"
      >
        {{ "Выберите из списка" }}
      </b-input>
      <!-- <b-collapse id="collapse-4" class="mt-2"> -->
      <b-card>
        <b-col style="width: 60rem">
          <slot
            name="data"
            v-for="item in dataContent.items"
            v-bind:content="item"
          >
          </slot>
          <slot :update="update" v-bind:content="dataContent.items"> </slot>
        </b-col>
      </b-card>
      <!-- </b-collapse> -->
    </b-form-group>
  </div>

  <!-- <div>
    <b-form-group
      :label="isButtonRender?.label"
      :class="{ required: isButtonRender?.required }"
      :label-for="isButtonRender?.name"
    >
      <b-input
        v-model="isButtonRender?.value.text || 'Выберите из списка'"
        :readonly="true"
        class="mb-2"
        :class="visible ? null : 'collapsed'"
        :aria-expanded="visible ? 'true' : 'false'"
        aria-controls="collapse-4"
        @click="openList"
      >
        {{ isButtonRender?.value.text || "Выберите из списка" }}
      </b-input>
      <b-collapse id="collapse-4" v-model="visible" class="mt-2">
        <b-card>
          <b-col style="width: 60rem">
            <slot
              name="data"
              v-for="item in dataContent.items"
              v-bind:content="item"
            >
            </slot>
            <slot :update="update" v-bind:content="dataContent.items"> </slot>
          </b-col>
        </b-card>
      </b-collapse>
    </b-form-group>
  </div> -->
</template>

<script>
import ChooseButton from "../../../Pages/Cabinet/Block/ChooseButton.vue";
import FilterBlock from "../../../Pages/Cabinet/Block/FilterBlock.vue";
import ObjectsOnMap from "../../ObjectsOnMap/ObjectsOnMap.vue";

export default {
  name: "SelectItemFromTemplate",
  components: {
    ChooseButton,
    FilterBlock,
    ObjectsOnMap,
  },

  data() {
    return {
      visible: false,
    };
  },

  props: {
    data: {
      type: Object,
      required: false,
      default: () => {},
    },

    itemId: {
      required: false,
      default: () => "",
    },
    name: {
      type: String,
      required: false,
      default: () => "",
    },
    isButtonRender: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  async fetch() {
    try {
      (await this.cardId)
        ? this.$store.dispatch("blocks/fetchWizardBlock", {
            itemId: this.itemId,
            cardId: this.cardId,
          })
        : this.$store.dispatch("blocks/fetchBlock", {
            id: this.itemId,
            query: { ...this.$route.query },
          });
    } catch (err) {
      this.$bvToast.toast(err.response.data.MESSAGE, {
        title: "Ошибка",
        variant: "danger",
        noAutoHide: true,
        solid: true,
      });
    }
  },

  mounted() {
    console.log(this.isButtonRender);
  },

  computed: {
    dataContent: {
      get: function () {
        console.log("начинаю делать запрос!!!");
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          console.log(block);
          return block.data;
        } else {
          return {};
        }
      },
    },
    isEmptyContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          console.log(block);
          return !block?.data?.items.length;
        } else {
          return false;
        }
      },
    },
  },

  methods: {
    update(event) {
      // console.log(event);
      // console.log(this.itemId);
      this.$emit("update", event);
    },
    async openList() {
      console.log("!!!");
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
};
</script>
