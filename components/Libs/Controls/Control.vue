<template>
  <b-col
    :xl="colXl"
    :lg="dataCols"
    :md="colMd"
    :sm="colSm"
    :cols="colSm"
    :class="{
      'collapse-filter': collapse,
    }"
  >
    <div
      class="control"
      :class="{ visibility_hidden: hidden }"
      :field-id="fieldId"
      :style="{ width: width ? width : '100%' }"
    >
      <component
        :is="comp"
        :class="cssClass"
        :data="data"
        :params="params"
        :edit="edit"
        :store="store"
        :loading="loading"
        @blur="$emit('blur', $event)"
        @update="$emit('update', $event)"
        @clear="$emit('clear', $event)"
        @open-card="$emit('open-card', $event)"
        @remove="$emit('remove', $event)"
      />
    </div>
  </b-col>
</template>
<script>
import ControlString from "./ControlString/ControlString.vue";
import ControlMultiSelect from "./ControlMultiSelect/ControlMultiSelect.vue";
import ControlText from "./ControlText";
import ControlBoolean from "./ControlBoolean";
import ControlDouble from "./ControlDouble";
import ControlLong from "./ControlLong";
import ControlTimestamp from "./ControlTimestamp";
import ControlPeriod from "./ControlPeriod";
import ControlClob from "./ControlText";
import ControlEnum from "./ControlEnum";
import ControlButton from "../../Pages/Cabinet/Block/ActionButton.vue";
import ControlLink from "./ControlLink";
import ControlLabel from "./ControlLabel";
import ControlSplitter from "./ControlSplitter";
import ControlCombobox from "./ControlCombobox";
import ControlUploader from "./ControlUploader";
import ControlUploadFiles from "./ControlUploadFiles/ControlUploadFiles";
import ControlCaptcha from "./ControlCaptcha";
import ControlError from "./ControlError";
import ControlPhoneChange from "./ControlPhoneChange";
import ControlEmailChange from "./ControlEmailChange";
import ControlProgressbar from "./ControlProgressbar";
import ControlEmpty from "./ControlEmpty";
import ControlLabelMoney from "./ControlLabelMoney";
import ControlDadataSelect from "./ControlDadataSelect.vue";
import ControlDadataSelect2 from "./ControlDadataSelect2.vue";
import ControlCustomCombobox from "./ControlCustomCombobox/ControlCustomCombobox.vue";
import ControlSearchSelect from "./ControlCustomCombobox/ControlSearchSelect.vue";
import ControlCustomDouble from "./ControlCustomDouble.vue";
import ControlGoogleCaptcha from "./ControlGoogleCaptcha/ControlGoogleCaptcha.vue";
import ControlMap from "./ControlMap/ControlMap.vue";
import ControlListSelect from "./ControlListSelect/ControlListSelect.vue";
import ControlRegNumber from "./ControlRegNumber/ControlRegNumber.vue";
import ControlRegNumberAuto from "./ControlRegNumberAuto/ControlRegNumberAuto.vue";
import ControlRadioButton from "./ControlRadioButton.vue";
import ControlDoctorSchedule from "./ControlDoctorSchedule.vue";
import ControlNewDoctorSchedule from "./ControlDoctorSchedule/WrapperDoctorSchedule.vue";
import ControlOneToMany from "./ControlOneToMany/ControlOneToMany";
import ControlPasswordConfirm from "./ControlPasswordConfirm/ControlPasswordConfirm.vue";
import ControlCollapseGroup from "./ControlCollapseGroup.vue";
import ControlRange from "./ControlRange/ControlRange.vue";
import ControlInsuredBox from "./ControlInsuredBox/InsuredBox.vue";
import ControlRangeInput from "./ControlRangeInput/ControlRangeInput.vue";
import ControlVueComponent from "./ControlVueComponent/ControlVueComponent.vue";

import ControlSeparator from "./ControlSeparator.vue";

import ControlVariantPolicy from "./ControlVariantPolicy/ControlVariantPolicy.vue";
import ControlPencil from "./ControlPencil/ControlPencil.vue";

export default {
  name: "Control",
  components: {
    ControlSeparator,
    ControlPencil,
    ControlDadataSelect,
    ControlDadataSelect2,
    ControlProgressbar,
    ControlMultiSelect,
    ControlString,
    ControlText,
    ControlBoolean,
    ControlDouble,
    ControlLong,
    ControlTimestamp,
    ControlPeriod,
    ControlClob,
    ControlEnum,
    ControlButton,
    ControlLink,
    ControlLabel,
    ControlCombobox,
    ControlSplitter,
    ControlUploader,
    ControlUploadFiles,
    ControlCaptcha,
    ControlError,
    ControlPhoneChange,
    ControlEmailChange,
    ControlEmpty,
    ControlLabelMoney,
    ControlCustomCombobox,
    ControlSearchSelect,
    ControlCustomDouble,
    ControlGoogleCaptcha,
    ControlMap,
    ControlListSelect,
    ControlRegNumber,
    ControlRegNumberAuto,
    ControlRadioButton,
    ControlDoctorSchedule,
    ControlNewDoctorSchedule,
    ControlOneToMany,
    ControlPasswordConfirm,
    ControlCollapseGroup,
    ControlRange,
    ControlInsuredBox,
    ControlRangeInput,
    ControlVueComponent,
    ControlVariantPolicy,
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    params: {
      type: Object,
      required: false,
    },
    cols: {
      type: Number,
      required: false,
      default: () => 1,
    },
    store: {
      type: String,
      required: false,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
    },
    profileFullness: {
      type: Array,
      required: false,
    },
  },
  computed: {
    comp() {
      return `Control${this.data?.type
        .charAt(0)
        .toUpperCase()}${this.data?.type.slice(1)}`;
    },
    colXl() {
      return (12 / this.cols) * this.data?.col;
    },
    colMd() {
      return this.data?.colMd ? this.data?.colMd : 12;
    },
    colSm() {
      return this.data?.colSm ? this.data?.colSm : 12;
    },
    collapse() {
      return this.data?.type === "CollapseGroup";
    },
    hidden() {
      return this.data?.hidden;
    },
    width() {
      return this.data?.width;
    },
    fieldId() {
      return this.data?.fieldId;
    },
    cssClass() {
      return this.data?.cssClass;
    },
    dataCols() {
      return this.data?.cols;
    },
  },
};
</script>

<style scoped>
.control > fieldset {
  margin-bottom: 0;
}
.visibility_hidden {
  visibility: hidden;
}
</style>
