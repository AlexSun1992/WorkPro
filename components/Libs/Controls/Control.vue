<template>
  <div :class="[dataCols, colMd, colLg, collapse ? 'collapse-filter' : '']">
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
        :oneToManyData="oneToManyData"
        @blur="$emit('blur', $event)"
        @update="$emit('update', $event)"
        @clear="$emit('clear', $event)"
        @open-card="$emit('open-card', $event)"
        @remove="$emit('remove', $event)"
        @goNext="$emit('goNext', $event)"
        @goBack="$emit('goBack', $event)"
        @saveCard="$emit('saveCard', $event)"
      />
    </div>
  </div>
</template>

<script>
import ControlTimePicker from "./ControlTimePicker/ControlTimePicker";
import ControlString from "./ControlString/ControlString";
import ControlMultiSelect from "./ControlMultiSelect/ControlMultiSelect";
import ControlText from "./ControlText";
import ControlBoolean from "./ControlBoolean";
import ControlDouble from "./ControlDouble";
import ControlLong from "./ControlLong";
import ControlTimestamp from "./ControlTimestamp";
import ControlPeriod from "./ControlPeriod";
import ControlEnum from "./ControlEnum";
import ControlButton from "@/components/Pages/Cabinet/Block/ActionButton";
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
import ControlDadataSelect from "./ControlDadataSelect";
import ControlDadataSelect2 from "./ControlDadataSelect2";
import ControlCustomCombobox from "./ControlCustomCombobox/ControlCustomCombobox";
import ControlSearchSelect from "./ControlCustomCombobox/ControlSearchSelect";
import ControlFileDownload from "@/components/FileDownload/FileDownload";
import ControlCustomDouble from "./ControlCustomDouble";
import ControlGoogleCaptcha from "./ControlGoogleCaptcha/ControlGoogleCaptcha";
import ControlSelectObjectFromMap from "./ControlSelectObjectFromMap/ControlSelectObjectFromMap";
import ControlMap from "./ControlMap/ControlMap";
import ControlYMap from "./ControlMap/ControlYMap.vue";
import ControlListSelect from "./ControlListSelect/ControlListSelect";
import ControlRegNumber from "./ControlRegNumber/ControlRegNumber";
import ControlRegNumberAuto from "./ControlRegNumberAuto/ControlRegNumberAuto";
import ControlRadioButton from "./ControlRadioButton";
import ControlDoctorSchedule from "./ControlDoctorSchedule";
import ControlNewDoctorSchedule from "./ControlDoctorSchedule/WrapperDoctorSchedule";
import ControlOneToMany from "./ControlOneToMany/ControlOneToMany";
import ControlPasswordConfirm from "./ControlPasswordConfirm/ControlPasswordConfirm";
import ControlCollapseGroup from "./ControlCollapseGroup";
import ControlCollapse from "./Collapse/ControlCollapse";
import ControlRange from "./ControlRange/ControlRange";
import ControlInsuredBox from "./ControlInsuredBox/InsuredBox";
import ControlRangeInput from "./ControlRangeInput/ControlRangeInput";
import ControlVueComponent from "./ControlVueComponent/ControlVueComponent";
import ControlWizardButton from "./ControlWizardButton";
import ControlTokenBox from "./ControlTokenBox/ControlTokenBox";
import ControlSeparator from "./ControlSeparator";
import ControlVariantPolicy from "./ControlVariantPolicy/ControlVariantPolicy";
import ControlNewVariantPolicy from "./ControlNewVariantPolicy/ControlNewVariantPolicy";
import ControlPencil from "./ControlPencil/ControlPencil";
import ControlLoadingOverlay from "./ControlLoadingOverlay/ControlLoadingOverlay";
import ControlDynamicDepend from "./ControlDynamicDepend/ControlDynamicDepend";
import ControlDynamicList from "./ControlDynamicDepend/ControlDynamicList";
import ControlSelectButton from "./ControlSelectButton";
import ControlInformer from "./ControlInformer/ControlInformer";
import ControlGallery from "./ControlGallery/ControlGallery";
import ControlSlider from "./ControlSlider/ControlSlider";
import ControlAuthorization from "./ControlAuthorization/ControlAuthorization";
import ControlAsyncModal from "./AsyncModalAction/ControlAsyncModal";
import ControlChipsCard from "./ControlChipsCard/ControlChipsCard.vue";
import ControlCustomComboboxJSON from "./ControlCustomComboboxJSON/ControlCustomComboboxJSON";
import ControlCardList from "./ControlCardList/CardList";
import ControlDropdown from "./ControlDropdown/ControlDropdown";

const ControlClob = ControlText;
export default {
  name: "Control",
  components: {
    ControlTimePicker,
    ControlWizardButton,
    ControlSeparator,
    ControlPencil,
    ControlDadataSelect,
    ControlDadataSelect2,
    ControlProgressbar,
    ControlMultiSelect,
    ControlSelectObjectFromMap,
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
    ControlYMap,
    ControlListSelect,
    ControlLoadingOverlay,
    ControlRegNumber,
    ControlRegNumberAuto,
    ControlRadioButton,
    ControlDoctorSchedule,
    ControlNewDoctorSchedule,
    ControlOneToMany,
    ControlPasswordConfirm,
    ControlFileDownload,
    ControlCollapseGroup,
    ControlCollapse,
    ControlRange,
    ControlInsuredBox,
    ControlRangeInput,
    ControlVueComponent,
    ControlVariantPolicy,
    ControlNewVariantPolicy,
    ControlDynamicDepend,
    ControlDynamicList,
    ControlSelectButton,
    ControlInformer,
    ControlTokenBox,
    ControlSlider,
    ControlGallery,
    ControlAuthorization,
    ControlAsyncModal,
    ControlChipsCard,
    ControlCustomComboboxJSON,
    ControlCardList,
    ControlDropdown,
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
    oneToManyData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    comp() {
      return `Control${this.data?.type.charAt(0).toUpperCase()}${this.data?.type.slice(1)}`;
    },
    colMd() {
      return `col-md-${this.data?.colMd}`;
    },
    colLg() {
      return `col-lg-${this.data?.cols}`;
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
      return `col-${this.data?.colSm}`;
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
