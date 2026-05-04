<template>
  <div>
    <div
      class="title-conf-block"
      v-if="title"
    >
      {{ title }}
    </div>
    <div class="all-cards">
      <div
        v-for="item in JSON.parse(data.VJSON)"
        :key="item.IDCARD"
        :class="['bank-card', item.IDCARD === activeWindow ? 'open' : '']"
      >
        <div class="bank-card-top">
          <img :src="'/img/bank/' + item.IDBANK + '.svg'" />
          <div>
            <div>
              <img
                v-if="item.BMAINCARD"
                src="/img/bank/ic_Check_Solid.svg"
              />
              <vue-easy-tooltip
                :with-arrow="false"
                position="top"
                :offset="4"
              >
                <span>По данной карте есть активное автосписание</span>
              </vue-easy-tooltip>
            </div>
            <button
              ref="setBtnRef(item.IDCARD)"
              @click.stop="toggleOptionsWindow(item.IDCARD)"
            ></button>
          </div>
        </div>
        <div class="bank-card-bottom">
          <div>*{{ item.NCARD }}</div>
          <img
            v-if="item.SPAYMENTSYSTEM === 'MIR'"
            src="/img/bank/mir.svg"
          />
          <img
            v-if="item.SPAYMENTSYSTEM === 'VISA'"
            src="/img/bank/vis.svg"
          />
          <img
            v-if="item.SPAYMENTSYSTEM === 'MASTER'"
            src="/img/bank/master.svg"
          />
        </div>
        <div
          class="action-container"
          v-if="item.IDCARD === activeWindow"
          v-click-outside="handleClickOutside(item.IDCARD)"
          :ref="setDropdownRef(item.IDCARD)"
        >
          <div
            v-for="button in item.ACTIONS"
            :key="button.actionId"
          >
            <ActionButton
              :params="{ idCard: item.IDCARD, idRel: item.REL }"
              :id="item.IDCARD"
              :action-id="button.actionId"
              class="btn-action-bankcard"
              >{{ button.text }}</ActionButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount, computed, getCurrentInstance } from "vue";
import ClickOutside from "vue-click-outside";
import ActionButton from "@/components/Pages/Cabinet/Block/ActionButton";

export default {
  name: "ControlBankCards",
  components: { ActionButton },
  directives: {
    ClickOutside,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: "",
    },
  },

  setup() {
    const activeWindow = ref(null);
    const dropdownRefs = ref({});
    const btnRefs = ref({});
    const setDropdownRef = (id) => (el) => {
      if (el) dropdownRefs.value[id] = el;
    };

    const setBtnRef = (id) => (el) => {
      if (el) {
        const btn = el.$el || el;
        if (!btnRefs.value.cardBtns) {
          btnRefs.value.cardBtns = {};
        }
        btnRefs.value.cardBtns[id] = btn;
      }
    };

    const toggleOptionsWindow = (id) => {
      activeWindow.value = activeWindow.value === id ? null : id;
    };

    const handleClickOutside = (cardId) => (event) => {
      const btn = btnRefs.value.cardBtns?.[cardId];
      const dropdown = dropdownRefs.value[cardId];
      const isExcluded = btn?.contains(event.target) || dropdown?.contains(event.target);

      if (!isExcluded) {
        activeWindow.value = null;
      }
    };
    onBeforeUnmount(() => {
      btnRefs.value.cardBtns = null;
    });

    return {
      activeWindow,
      setDropdownRef,
      setBtnRef,
      handleClickOutside,
      toggleOptionsWindow,
    };
  },
};
</script>

<style scoped>
.bank-card {
  border: 1px solid #f0f0f0;
  border-radius: 24px;
  position: relative;
}
.bank-card-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 12px;
  border-radius: 24px 24px 0 0;
  min-height: 40px;
  background-color: #fff;
}
.bank-card-top > div button,
.bank-card-top > div img {
  display: inline-block;
}
.bank-card-top img + button {
  margin-left: 4px;
}
.bank-card-top button {
  width: 20px;
  height: 20px;
  background: transparent url(/img/bank/ic_More_Vertical_Outline.svg) 50% 50% no-repeat;
  border: 0;
}
.bank-card-top div {
  display: flex;
  align-items: start;
}
.bank-card-bottom {
  padding: 12px;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f2f4f5;
  border-radius: 0 0 24px 24px;
}
.all-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
}
.action-container {
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 36px;
  right: 36px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  transform: translateX(100%);
  z-index: 1;
}
.action-container > div + div {
  border-top: 1px solid #f2f4f5;
}
.btn-action-bankcard {
  padding: 12px 20px;
  text-align: center;
  line-height: 20px;
  color: #292929;
  background-color: #fff;
  border: 0;
  white-space: nowrap;
  width: 100%;
}
.btn-action-bankcard:hover {
  background-color: #f2f4f5;
}
.bank-card:nth-child(4n) .action-container {
  transform: translateX(0);
  right: 12px;
}
.title-modal {
  display: none;
}
@media (max-width: 768px) {
  .all-cards {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: visible;
  }
  .bank-card {
    min-width: 80%;
  }
  .action-container {
    transform: none;
    width: 90%;
    right: 12px;
    top: 36px;
  }
  .btn-action-bankcard {
    padding: 6px;
  }
  /*
  .action-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    z-index: 1;
    top: auto;
    transform: translateX(0);
    border-radius: 30px 30px 0 0;
    padding: 31px 0 30px 0;
    overflow: visible;
  }
  .title-modal {
    position: relative;
    display: block;
    text-align: center;
    padding: 16px;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 600;
  }
  .title-modal:after {
    content: "";
    width: 69px;
    height: 5px;
    background-color: #c3c3c3;
    margin-left: -34px;
    left: 50%;
    top: -16px;
    position: absolute;
    border-radius: 10px;
    z-index: 2;
  }
  .action-container > div:first-child + div {
    border-top: 0;
  }
  .btn-action-bankcard {
    font-size: 1.125rem;
    text-align: left;
    background: url(/img/bank/icons.svg) right 16px center no-repeat;
  }
  .bank-card.open::before {
    content: "";
    display: block;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.18);
    position: fixed;
    z-index: 1;
  }*/
}
</style>
