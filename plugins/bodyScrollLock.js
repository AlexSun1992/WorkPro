import Vue from "vue";

const getLockState = () => {
  if (window && !window.__controlModalLockState) {
    window.__controlModalLockState = {
      count: 0,
      scrollY: 0,
    };
  }
  return window.__controlModalLockState;
};
const lockBodyScroll = () => {
  const state = getLockState();
  if (state.count > 0) return;

  state.count += 1;
  const pebody = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.overflow = "hidden";
  document.documentElement.style.height = "100vh";
  document.body.style.paddingRight = `${pebody}px`;
};
const unlockBodyScroll = () => {
  const state = getLockState();
  if (state.count < 1) return;

  document.documentElement.style.overflow = "";
  document.documentElement.style.height = "";
  document.body.style.paddingRight = "";
  state.count -= 1;
};

Vue.prototype.$unlockBodyScroll = unlockBodyScroll;
Vue.prototype.$lockBodyScroll = lockBodyScroll;

export default {
  install(Vue) {
    Vue.prototype.$unlockBodyScroll = unlockBodyScroll;
    Vue.prototype.$lockBodyScroll = lockBodyScroll;
  },
};
