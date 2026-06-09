<template>
  <div
    :class="['dropdown-wrapper', validClass, { open: isOpen, disabled: isDisabled }]"
    ref="containerRef"
    @click="$emit('click-trigger', $event)"
  >
    <slot name="trigger" />
    <ul
      v-if="isOpen"
      :class="['control-dropdown-menu', { visible: isOpen }, menuClass]"
    >
      <slot name="menu" />
    </ul>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from "vue";

export default {
  name: "ControlDropdownBase",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    validClass: {
      type: String,
      default: "",
    },
    menuClass: {
      type: String,
      default: "",
    },
  },
  emits: ["click-trigger", "outside"],
  setup(props, { emit }) {
    const containerRef = ref(null);

    // используем не v-click-outside потому что с ним виснет при переключении между одинаковыми компонентами, получается цикличная зависимость
    const outOfClick = (e) => {
      if (props.isOpen && containerRef.value && !containerRef.value.contains(e.target)) {
        emit("outside");
      }
    };

    onMounted(() => document.addEventListener("mousedown", outOfClick));
    onBeforeUnmount(() => document.removeEventListener("mousedown", outOfClick));

    return { containerRef };
  },
};
</script>

<style scoped>
.icon-ppl::v-deep .dropdown-wrapper > span {
  background: url(/img/icon-input-ppl.svg) left 15px center no-repeat !important;
  padding-left: 49px !important;
}

.dropdown-wrapper > span {
  padding: 0 0 0 20px;
}

.dropdown-wrapper {
  position: relative;
  border: 1px solid var(--warmgrey_40);
  width: 100%;
  border-radius: 15px;
  min-height: 56px;
  display: flex;
  align-items: center;
  padding-right: 40px;
  cursor: pointer;
}

.dropdown-wrapper:hover {
  border: 1px solid var(--warmgrey);
}

.dropdown-wrapper.disabled:hover {
  border: 1px solid var(--warmgrey_40);
}

.dropdown-wrapper.disabled,
.dropdown-wrapper.disabled *,
.dropdown-wrapper.disabled::after {
  cursor: default;
}

.dropdown-wrapper > div {
  color: var(--warmgrey);
  padding: 0 0 0 20px;
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

.dropdown-wrapper.disabled > span,
.dropdown-wrapper.disabled > div {
  color: var(--warmgrey_80);
}

.dropdown-wrapper.disabled {
  pointer-events: none;
  user-select: all;
}

.dropdown-wrapper.disabled .selected-items span,
.dropdown-wrapper.disabled .selected-items .clear-btn {
  opacity: 0.3;
}

.dropdown-wrapper > div.placeholder,
.selected-items .placeholder {
  color: var(--warmgrey_80);
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

.dropdown-wrapper.disabled > div.placeholder,
.dropdown-wrapper.disabled > div .placeholder {
  color: var(--warmgrey_40);
}

.dropdown-wrapper.is-invalid.disabled,
.dropdown-wrapper.disabled {
  background: #f2f2f2;
}

.dropdown-wrapper::after {
  cursor: pointer;
  width: 1em;
  height: 1em;
  content: "";
  background: url(/img/icon-btn-dropdown.svg) 50% 50% no-repeat;
  position: absolute;
  right: 13px;
  top: 20px;
}

.dropdown-wrapper.open::after {
  transform: rotate(180deg);
}

.dropdown-wrapper.disabled::after {
  opacity: 0.3;
}

.is-valid > input,
.is-invalid > input,
.dropdown-wrapper > input,
.dropdown-wrapper > input:hover,
.is-valid input.autocomplete-input,
.dropdown-wrapper.is-valid input.autocomplete-input {
  border: 0 !important;
  background: transparent !important;
  padding: 0 0 0 20px !important;
  height: auto !important;
}

.dropdown-wrapper input:-webkit-autofill,
.dropdown-wrapper input:-webkit-autofill:hover,
.dropdown-wrapper input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

.control-dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  text-align: left;
  width: 100%;
  border-radius: 10px;
  z-index: 1;
  background: #fff;
  margin: 0;
  padding: 0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  overflow-x: hidden;
}

.control-dropdown-menu.visible {
  display: flex;
  max-height: 25rem;
  flex-direction: column;
  position: absolute;
  z-index: 1000;
  top: calc(100% + 2px);
  width: calc(100% + 2px);
  left: -1px;
}

.dropdown-wrapper.is-valid {
  border: 2px solid var(--lgreen);
}

.dropdown-wrapper.is-invalid {
  border: 2px solid #eb5757;
}

.dropdown-wrapper.disabled.is-valid,
.dropdown-wrapper.disabled.is-invalid {
  border: 1px solid var(--warmgrey_80);
}

.dropdown-wrapper.is-valid .control-dropdown-menu.visible {
  width: calc(100% + 4px);
  left: -2px;
}

.control-dropdown-menu ::v-deep li {
  list-style-type: none;
  position: relative;
  margin: 0;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(193, 193, 193, 0.3);
  cursor: pointer;
}

.control-dropdown-menu ::v-deep li:hover {
  background: #f4f7f5;
  opacity: 0.8;
}

.control-dropdown-menu ::v-deep li.disabled {
  cursor: not-allowed;
  color: gray;
  background-color: #f2f4f5;
  opacity: 1;
}

.control-dropdown-menu ::v-deep li.disabled:hover {
  cursor: not-allowed;
  background-color: #f2f4f5;
  opacity: 1;
}

.control-dropdown-menu ::v-deep .selected-option {
  background-color: #f0f3f1;
}

.control-dropdown-menu ::v-deep .selected-option:hover {
  background-color: #f4f7f5;
  opacity: 0.8;
}

.control-dropdown-menu.visible ::v-deep li span {
  position: relative;
  display: block;
}

.control-dropdown-menu.visible.control-multiselect ::v-deep li span::before {
  content: url(/img/icon-input-valid-disabled.svg);
  position: absolute;
  right: 2px;
  width: 1rem;
  height: 1rem;
}

.control-dropdown-menu.visible.control-multiselect ::v-deep li.selected-option span::before {
  content: url(/img/icon-input-valid.svg);
}

.control-dropdown-menu.visible::-webkit-scrollbar-thumb {
  background: #43b02a;
  width: 2px;
  border: 3px solid #ffff;
  border-radius: 10px;
}

.control-dropdown-menu.visible::-webkit-scrollbar {
  width: 6px;
}

.control-dropdown-menu.visible::-webkit-scrollbar:vertical {
  border: 4px solid transparent;
  width: 10px;
}

.is-invalid .selected-items {
  border-color: #dc3545;
}

.is-valid .selected-items {
  border-color: #28a745;
}

.dropdown-wrapper .selected-value {
  align-items: center;
  background: #edf8ea;
  border-radius: 1.1em;
  color: #292929;
  font-size: 18px;
  font-weight: 400;
  height: 30px;
  line-height: 1.1;
  margin: 0;
  overflow: hidden;
  padding: 4px 40px 4px 12px;
  position: relative;
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: baseline;
  white-space: nowrap;
}

.clear-btn {
  background: transparent url(/img/icon-btn-close.svg) 50% 50% no-repeat;
  cursor: pointer;
  font-size: 0;
  height: 20px;
  position: absolute;
  right: 12px;
  top: 6px;
  width: 22px;
}

.clear-all-btn {
  right: 0px;
  top: 16px;
}

.dropdown-wrapper > div.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 22px 4px 20px;
  position: relative;
  width: 100%;
  min-height: 54px;
  align-items: center;
}

.dropdown-wrapper.disabled {
  border: 1px solid #c3c3c3;
  background-color: #f2f2f2 !important;
  color: #868686;
}

.dropdown-wrapper.disabled:after {
  opacity: 0.2;
}

.dropdown-wrapper.disabled > span {
  color: #868686;
}

@media (min-width: 993px) {
  .dropdown-wrapper.disabled > span,
  .dropdown-wrapper.disabled > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.dropdown-wrapper.disabled {
  border: 1px solid #c3c3c3;
  background-color: #f2f2f2 !important;
  color: #868686;
}

.dropdown-wrapper.disabled:after {
  opacity: 0.2;
}

.dropdown-wrapper.disabled > span {
  color: #868686;
}

.dropdown-wrapper.disabled .autocomplete-input {
  color: #868686;
}
</style>
