<template>
  <b-col
    :xl="colXl"
    :lg="data.cols"
    :md="colMd"
    :sm="colSm"
    :cols="colSm"
    :class="{
      'collapse-filter': data.type === 'CollapseGroup',
    }"
  >
    <div
      class="control"
      :class="{ visibility_hidden: data.hidden }"
      :field-id="data.fieldId"
      :style="{ width: data.width ? data.width : '100%' }"
    >
      <component
        :is="comp"
        :class="data.labelCols"
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
import ControlString from "./ControlString/ControlString";
import ControlText from "./ControlText";
import ControlBoolean from "./ControlBoolean";
import ControlDouble from "./ControlDouble";
import ControlLong from "./ControlLong";
import ControlTimestamp from "./ControlTimestamp";
import ControlPeriod from "./ControlPeriod";
import ControlClob from "./ControlText";
import ControlEnum from "./ControlEnum";
import ControlButton from "./ControlButton";
import ControlLink from "./ControlLink";
import ControlLabel from "./ControlLabel";
import ControlSplitter from "./ControlSplitter";
import ControlCombobox from "./ControlCombobox";
import ControlUploader from "./ControlUploader";
import ControlCaptcha from "./ControlCaptcha";
import ControlError from "./ControlError";
import ControlPhoneChange from "./ControlPhoneChange";
import ControlEmailChange from "./ControlEmailChange";
import ControlProgressbar from "./ControlProgressbar";
import ControlEmpty from "./ControlEmpty";
import ControlLabelMoney from "./ControlLabelMoney";
import ControlDadataSelect from "./ControlDadataSelect.vue";
import ControlDadataSelect2 from "./ControlDadataSelect2.vue";
import ControlCustomCombobox from "./ControlCustomCombobox.vue";
import ControlCustomDouble from "./ControlCustomDouble.vue";
import ControlGoogleCaptcha from "./ControlGoogleCaptcha/ControlGoogleCaptcha.vue";
import ControlMap from "./ControlMap/ControlMap.vue";
import ControlListSelect from "./ControlListSelect/ControlListSelect.vue";
import ControlRegNumber from "./ControlRegNumber/ControlRegNumber.vue";
import ControlRadioButton from "./ControlRadioButton.vue";
import ControlDoctorSchedule from "./ControlDoctorSchedule.vue";
import ControlOneToMany from "./ControlOneToMany/ControlOneToMany";
import ControlPasswordConfirm from "./ControlPasswordConfirm/ControlPasswordConfirm.vue";
import ControlCollapseGroup from "./ControlCollapseGroup.vue";

export default {
  name: "Control",
  components: {
    ControlDadataSelect,
    ControlDadataSelect2,
    ControlProgressbar,
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
    ControlCaptcha,
    ControlError,
    ControlPhoneChange,
    ControlEmailChange,
    ControlEmpty,
    ControlLabelMoney,
    ControlCustomCombobox,
    ControlCustomDouble,
    ControlGoogleCaptcha,
    ControlMap,
    ControlListSelect,
    ControlRegNumber,
    ControlRadioButton,
    ControlDoctorSchedule,
    ControlOneToMany,
    ControlPasswordConfirm,
    ControlCollapseGroup,
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
      return `Control${this.data.type
        .charAt(0)
        .toUpperCase()}${this.data.type.slice(1)}`;
    },
    colXl() {
      return (12 / this.cols) * this.data.col;
    },
    colMd() {
      return this.data.colMd ? this.data.colMd : 12;
    },
    colSm() {
      return this.data.colSm ? this.data.colSm : 12;
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
