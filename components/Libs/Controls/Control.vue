<template>
  <b-col :xl="colXl" :lg="data.cols" :md="colMd" :sm="colSm" :cols="colSm">
    <div
      class="control"
      v-bind:class="{ visibility_hidden: data.hidden }"
      :field-id="data.fieldId"
      :style="{ width: data.width ? data.width : '100%' }"
    >
      <component
        @update="$emit('update', $event)"
        @clear="$emit('clear', $event)"
        v-bind:is="comp"
        @open-card="$emit('open-card', $event)"
        :data="data"
        :edit="edit"
        :store="store"
        :disabled="disabled"
        :loading="loading"
        :profileFullness="loggedInUser"
      ></component>
      
    </div>
  </b-col>
</template>
<script>
import ControlString from "~/components/Libs/Controls/ControlString/ControlString";
import ControlText from "~/components/Libs/Controls/ControlText";
import ControlBoolean from "~/components/Libs/Controls/ControlBoolean";
import ControlDouble from "~/components/Libs/Controls/ControlDouble";
import ControlLong from "~/components/Libs/Controls/ControlLong";
import ControlTimestamp from "~/components/Libs/Controls/ControlTimestamp";
import ControlPeriod from "~/components/Libs/Controls/ControlPeriod";
import ControlClob from "~/components/Libs/Controls/ControlText";
import ControlEnum from "~/components/Libs/Controls/ControlEnum";
import ControlButton from "~/components/Libs/Controls/ControlButton";
import ControlLink from "~/components/Libs/Controls/ControlLink";
import ControlLabel from "~/components/Libs/Controls/ControlLabel";
import ControlSplitter from "~/components/Libs/Controls/ControlSplitter";
import ControlCombobox from "~/components/Libs/Controls/ControlCombobox";
import ControlUploader from "~/components/Libs/Controls/ControlUploader";
import ControlCaptcha from "~/components/Libs/Controls/ControlCaptcha";
import ControlError from "~/components/Libs/Controls/ControlError";
import ControlProgressbar from "~/components/Libs/Controls/ControlProgressbar"
import { mapGetters } from "vuex";


export default {
  name: "Control",
  components: {
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
    profileFullness:{
      type:Array,
      required:false
    }
  },
  computed: {
    comp: function () {
      // console.log(this.data)
      return (
        "Control" +
        this.data.type.charAt(0).toUpperCase() +
        this.data.type.slice(1)
      );
    },
    colXl: function () {
      return (12 / this.cols) * this.data.col;
    },
    colMd: function () {
      return this.data.colMd ? this.data.colMd : 12;
    },
    colSm: function () {
      return this.data.colSm ? this.data.colSm : 12;
    },

    ...mapGetters(['loggedInUser'])

  },
  watch: {
    "data.value": "eventValidate",
  },
  methods: {
    eventValidate() {
      if (this.data.required) {
        if (this.data.value != null && this.data.value !== "") {
          this.data.state = null;
          this.data.checked = true;
        }
        if (this.data.checked) {
          if (this.data.value == null || this.data.value === "") {
            this.data.state = false;
          }
        }
      }
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
