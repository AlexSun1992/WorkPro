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
  state.scrollY = window.scrollY || window.pageYOffset || 0;
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${state.scrollY}px`;
  document.body.style.width = "100%";
};
const unlockBodyScroll = () => {
  const state = getLockState();
  if (state.count < 1) return;

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, state.scrollY || 0);
  state.count -= 1;
  state.scrollY = 0;
};

Vue.prototype.$unlockBodyScroll = unlockBodyScroll;
Vue.prototype.$lockBodyScroll = lockBodyScroll;

export default {
  install(Vue) {
    Vue.prototype.$unlockBodyScroll = unlockBodyScroll;
    Vue.prototype.$lockBodyScroll = lockBodyScroll;
  },
};
