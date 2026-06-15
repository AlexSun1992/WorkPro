<template>
  <div>
    <div class="reg-title">
      <button
        type="button"
        class="reg-back"
        @click.prevent="handleBack"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5425 18.1482C11.4125 18.2882 11.2425 18.3582 11.0625 18.3582C10.9025 18.3582 10.7525 18.3082 10.6225 18.1882L4.58248 12.6982C4.27248 12.4182 4.27248 11.9382 4.58248 11.6582L10.6225 6.16817C10.8925 5.92817 11.3025 5.94817 11.5425 6.20817C11.7825 6.47817 11.7725 6.88817 11.5025 7.12817L6.66683 11.5282H17.5625C17.9215 11.5282 18.2125 11.8192 18.2125 12.1782C18.2125 12.5372 17.9215 12.8282 17.5625 12.8282H6.66683L11.5025 17.2282C11.7625 17.4682 11.7825 17.8782 11.5425 18.1482Z"
            fill="#686868"
          />
        </svg>
      </button>
      <div>Регистрация</div>
    </div>
    <div class="v-scroll">
      <div class="login-more">
        <div>Зарегистрируйтесь<br />с помощью</div>
        <EsiaButton />
      </div>
      <form @submit.prevent="onSubmit">
        <PhoneField
          :state="usernameState.isHaveNotErrorMessage"
          :disabled="isMainFormDisabled"
          :user-data="userData"
          :error-input-text="errorInputTextPhone"
          @updatePhone="updatePhone"
        />

        <!-- Фамилия -->
        <RAutocomplete
          id="surname"
          main-class="mt-3"
          :value="userData.registration.surname"
          name="autocomplete-surname"
          input-ref="autocompleteSurname"
          label="Фамилия"
          :search="getSuggestionsSurname"
          :get-result-value="getResultValue"
          :disabled="isDisabledForm"
          :initial-value="userData.registration.surname"
          field-type="surname"
          :error-input-text="errorInputTextSurname"
          :state="surnameState.isHaveNotErrorMessage"
          :is-have-not-valid-signs-error-message="surnameState.isHaveNotValidSignsErrorMessage"
          data-testid="regFamily"
          @blur="handleBlur('surname', $event)"
          @update:state="updateState('surname', $event)"
        />

        <div
          v-if="!surnameState.isHaveNotValidSignsErrorMessage"
          class="invalid-feedback"
        >
          Просьба указать ФИО в русской транскрипции
        </div>

        <!-- Имя -->
        <RAutocomplete
          id="name"
          main-class="mt-3"
          :value="userData.registration.name"
          name="autocomplete-name"
          input-ref="autocompleteName"
          label="Имя"
          :search="getSuggestionsName"
          :get-result-value="getResultValue"
          :disabled="isDisabledForm"
          :initial-value="userData.registration.name"
          field-type="name"
          :state="nameState.isHaveNotErrorMessage"
          :is-have-not-valid-signs-error-message="nameState.isHaveNotValidSignsErrorMessage"
          :error-input-text="errorInputTextName"
          data-testid="regName"
          @blur="handleBlur('name', $event)"
          @update:state="updateState('name', $event)"
        />

        <div
          v-if="!nameState.isHaveNotValidSignsErrorMessage"
          class="invalid-feedback"
        >
          Просьба указать ФИО в русской транскрипции
        </div>

        <!-- Отчество -->
        <RAutocomplete
          id="patronymic"
          main-class="mt-3"
          name="autocomplete-patronymic"
          input-ref="autocompletePatronymic"
          label="Отчество"
          field-type="patronymic"
          :value="userData.registration.patronymic"
          :search="getSuggestionsPatronymic"
          :state="patronymicState.isHaveNotErrorMessage"
          :get-result-value="getResultValue"
          :disabled="isPatronymicNotExist || isDisabledForm"
          :error-input-text="errorInputTextPatronymic"
          data-testid="regPatronymic"
          @blur="handleBlur('patronymic', $event)"
        />
        <div
          v-if="!patronymicState.isHaveNotValidSignsErrorMessage"
          class="invalid-feedback"
        >
          Просьба указать ФИО в русской транскрипции
        </div>

        <BirthdateField
          main-class="mt-3"
          :user-data="userData"
          :state="birthdateState.isHaveNotErrorMessage"
          :error-input-text="errorInputTextBirthdate"
          @updateBirthdate="updateBirthdate"
        />

        <div class="checkbox-switcher mt-3">
          <input
            id="policy"
            v-model="isHavePolicy"
            type="checkbox"
            name="policy"
            @change="handlePolicyChange"
          />
          <label for="policy">У меня есть полис РЕСО</label>
        </div>

        <div
          v-if="isHavePolicy"
          class="mt-3"
        >
          <RInput
            v-model="numberPolicy"
            type="text"
            :state="policyState.isHaveNotErrorMessage"
            :error-input-text="errorInputTextPolicy"
            label="Номер полиса"
            @input="validatePolicyNumber"
          />
        </div>

        <div class="pt-3">
          <SubmitButton>Зарегистрироваться</SubmitButton>

          <div class="checkbox-hide mt-3">
            <input
              id="agreement-check-box"
              v-model="isAgreement"
              type="checkbox"
              @click="userConfirm"
            />
            <label
              for="agreement-check-box"
              class="checkbox-hide"
            >
              Даю согласие на
              <a
                href="/regulations/personal-agreement-2.html"
                class="reg_agreement"
                target="_blank"
                >обработку персональных данных</a
              >
              в соответствии с
              <a
                href="/export/sites/reso/about/polozhenie-po-pnd-21.08.2025.pdf"
                class="reg_agreement"
                target="_blank"
                >Положением</a
              >;
            </label>
            <div
              v-if="isErrorMessageAgreement && !isAgreement"
              class="invalid-feedback"
            >
              Необходимо согласие с обработкой персональных данных
            </div>
          </div>

          <div class="checkbox-hide mt-3">
            <input
              id="agreement-check-box_rec"
              v-model="isAgreementRec"
              type="checkbox"
            />
            <label
              for="agreement-check-box_rec"
              class="checkbox-hide"
            >
              Даю согласие на
              <a
                href="/about/normative/advertising-mailing-agreement.html"
                class="reg_agreement"
                target="_blank"
                >получение информации</a
              >
              о продуктах, услугах и акциях.
            </label>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, getCurrentInstance } from "vue";
import PhoneField from "../Authorization/PhoneField";
import RInput from "../Authorization/RInput";
import SubmitButton from "../Authorization/SubmitButton";
import EsiaButton from "../Authorization/EsiaButton";
import BirthdateField from "../Authorization/BirthdateField";
import RAutocomplete from "../Authorization/RAutocomplete";
import {
  useFIOSuggestions,
  updateFieldState,
  handleFIOBlur,
  initializeField,
  createFieldState,
  updateField,
  formatDateObject,
} from "./useFIOSuggestions";
import {
  getArrayWithClass,
  fetchPatronymic,
  fetchSurname,
  fetchName,

  // eslint-disable-next-line import/extensions
} from "@/components/Login/RegForm/dadata.helper";

export default {
  name: "RegistrationForm",
  components: {
    PhoneField,
    RInput,
    RAutocomplete,
    SubmitButton,
    EsiaButton,
    BirthdateField,
  },
  props: {
    userData: { type: Object, default: () => ({}) },
    options: { type: Object, default: () => ({}) },
  },
  emits: ["submit", "componentStep", "updateFields"],

  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const dirty = ref(false);
    const dirtyBirthdate = ref(false);
    const dirtyName = ref(false);
    const isErrorMessageAgreement = ref(false);
    const isHavePolicy = ref(Boolean(props.userData.registration?.numberPolicy));
    const numberPolicy = ref(props.userData.registration?.numberPolicy || "");
    const isAgreement = ref(props.userData.registration?.isAgreement || false);
    const isAgreementRec = ref(props.userData.registration?.isAgreementRec || false);
    const autocompleteSurname = ref(null);
    const autocompleteName = ref(null);
    const autocompletePatronymic = ref(null);
    const suggestionsHub = ref([]);
    const isInvalidBirthdate = ref(null);
    const isInvalidPhone = ref(null);
    const isInvalidName = ref(null);
    const isDisabledForm = ref(false);
    const isPatronymicNotExist = ref(false);

    const surnameState = ref(createFieldState());
    surnameState.value.type = "surname";
    const usernameState = ref(createFieldState());
    usernameState.value.type = "phone";
    const nameState = ref(createFieldState());
    nameState.value.type = "name";
    const patronymicState = ref(createFieldState());
    patronymicState.value.type = "patronymic";
    const policyState = ref(createFieldState());
    policyState.value.type = "policy";
    const birthdateState = ref(createFieldState());
    birthdateState.value.type = "birthdate";

    const updateValues = ref({
      phone: props.userData.username,
      surname: props.userData.registration?.surname,
      name: props.userData.registration?.name,
      patronymic: props.userData.registration?.patronymic,
      birthdate: props.userData.registration?.birthdate,
      numberPolicy: props.userData.registration?.numberPolicy,
    });

    const { updateGenderFromFields, createFIOGetter } = useFIOSuggestions(
      surnameState,
      nameState,
      patronymicState,
      suggestionsHub
    );
    const getSuggestionsSurname = createFIOGetter(surnameState.value, fetchSurname);
    const getSuggestionsName = createFIOGetter(nameState.value, fetchName);
    const getSuggestionsPatronymic = createFIOGetter(patronymicState.value, fetchPatronymic);

    onMounted(() => {
      initializeField(props.userData.registration?.surname, autocompleteSurname, surnameState);
      initializeField(props.userData.registration?.name, autocompleteName, nameState);
      initializeField(props.userData.registration?.patronymic, autocompletePatronymic, patronymicState);
      if (props.userData.registration?.numberPolicy) {
        getArrayWithClass(policyState.value.policyClassHub, "is-valid");
      }
      if (props.userData.username?.length === 12) isInvalidPhone.value = false;
    });

    const errorInputTextPhone = computed(() =>
      !props.userData.username ? "Введите номер, чтобы продолжить регистрацию" : props.options.errorInput
    );
    const errorInputTextBirthdate = computed(() =>
      !props.userData.registration?.birthdate ? "Введите дату вашего рождения" : props.options.errorInput
    );
    const errorInputTextPatronymic = computed(() => props.options.errorInput);
    const errorInputTextName = computed(() => {
      if (!validClassName.value && !props.userData.registration?.name)
        return "Введите имя, чтобы продолжить регистрацию";
      return props.options.errorInput;
    });
    const errorInputTextSurname = computed(() =>
      !props.userData.registration?.surname ? "Введите фамилию, чтобы продолжить регистрацию" : props.options.errorInput
    );
    const errorInputTextPolicy = computed(() =>
      isHavePolicy.value && !props.userData.registration?.numberPolicy
        ? "Введите полис, чтобы продолжить регистрацию"
        : props.options.errorInput
    );
    const isMainFormDisabled = computed(() => props.options.isMainFormDisabled || false);
    const validClassPhone = computed(() => {
      if (!dirty.value) return null;
      return !(
        (dirty.value && !props.userData.username) ||
        props.options.errorInput?.length ||
        props.options.statusObject === "SERROR_INFO"
      );
    });
    const validClassBirthdate = computed(() => {
      if (!dirtyBirthdate.value) return null;
      if (isInvalidBirthdate.value) return false;
      if (isInvalidBirthdate.value === false || props.userData.registration?.birthdate) return true;
      return true;
    });
    const validClassName = computed(() => {
      if (!dirtyName.value) return null;
      if (isInvalidName.value) return false;
      if (isInvalidName.value === false || props.userData.registration?.name) return true;
      return true;
    });

    const isDisabled = computed(
      () =>
        !isAgreement.value ||
        Boolean(props.options.authInProcess) ||
        !props.userData.username ||
        props.userData.username.length < 12 ||
        !surnameState.value.value?.length ||
        !nameState.value.value?.length ||
        !patronymicState.value.value?.length ||
        !props.userData.registration?.birthdate?.length
    );

    const updateState = (field, newState) => {
      const map = { surname: surnameState, name: nameState, patronymic: patronymicState };
      if (map[field]?.value) {
        map[field].value = { ...map[field].value, ...newState };
      }
    };

    const changeField = (field, event) => {
      const value = event || "";
      const map = { surname: surnameState, name: nameState, patronymic: patronymicState, birthdate: birthdateState };
      if (map[field]) {
        updateFieldState(map[field].value, value);
        updateFields(field, value);
      }
    };

    const handleBlur = (field, event) => {
      changeField(field, event);
      if (field === "surname") handleFIOBlur(surnameState.value);
      if (field === "name") handleFIOBlur(nameState.value);
      if (field === "numberPolicy") {
        if (isHavePolicy.value && numberPolicy.value === "") {
          policyState.value.isHaveNotErrorMessage = false;
        }
        updateFields("numberPolicy", numberPolicy.value);
      }
      if (field === "phone" && !props.userData.username) {
        usernameState.value.isHaveNotErrorMessage = false;
      }
      if (field === "birthdate" && !props.userData.registration?.birthdate) {
        birthdateState.value.isHaveNotErrorMessage = false;
      }
      updateGenderFromFields();
    };

    const handlePolicyChange = (e) => {
      isHavePolicy.value = e.target.checked;
      if (!isHavePolicy.value) {
        numberPolicy.value = "";
        policyState.value.policyClassHub = [];
        policyState.value.isHaveNotErrorMessage = null;
      }
    };

    const validatePolicyNumber = (event) => {
      if (isHavePolicy.value && numberPolicy.value === "") {
        policyState.value.isHaveNotErrorMessage = false;
      } else if (isHavePolicy.value && numberPolicy.value !== "") {
        policyState.value.isHaveNotErrorMessage = true;
      } else {
        policyState.value.isHaveNotErrorMessage = null;
      }
      handleBlur("numberPolicy", event);
    };

    const updateBirthdate = (event) => {
      updateField("birthdate", event, isInvalidBirthdate, dirtyBirthdate, handleBlur, updateFields);
    };
    const updatePhone = (event) => {
      updateField("phone", event, isInvalidPhone, dirty, handleBlur, updateFields);
    };

    const updateFields = (field, value) => {
      updateValues.value[field] = field === "birthdate" ? formatDateObject(value) : value;
      emit("updateFields", { ...updateValues.value });
    };

    const handleBack = () => {
      emit("componentStep", "phone");
      emit("updateFields", {
        phone: props.userData.username,
        surname: "",
        name: "",
        patronymic: "",
        birthdate: "",
        numberPolicy: "",
        registration: {},
      });
    };

    const userConfirm = () => {
      if (instance?.proxy?.$LogEvent) {
        instance.proxy.$LogEvent({
          formName: "RegForm",
          idEventType: 14,
          controlName: "RegForm.vue",
          message: "Подтвердил «Согласия на обработку» при регистрации",
          timeUser: new Date(),
        });
      }
    };

    const getResultValue = (item) => item.value;

    const validateForm = () => {
      const fields = [
        { state: surnameState },
        { state: nameState },
        { state: birthdateState },
        { state: policyState },
        { state: usernameState },
      ];
      for (const f of fields) {
        if (!f.state.value.value?.length) {
          f.state.value.isHaveNotErrorMessage = false;
          f.state.value.isTouch = true;
        }
      }
      if (isHavePolicy.value && !numberPolicy.value?.length) {
        policyState.value.isHaveNotErrorMessage = false;
      }
    };

    const onSubmit = (event) => {
      event.preventDefault();
      if (!isAgreement.value) {
        isErrorMessageAgreement.value = true;
      }
      validateForm();
      const hasInvalid =
        !surnameState.value.isHaveNotErrorMessage ||
        !nameState.value.isHaveNotErrorMessage ||
        (isHavePolicy.value && !props.userData.registration?.numberPolicy) ||
        !birthdateState.value.isHaveNotErrorMessage ||
        !isAgreement.value;
      if (hasInvalid) {
        return;
      }

      const params = {
        SECONDNAME: surnameState.value.value,
        FIRSTNAME: nameState.value.value,
        THIRDNAME: patronymicState.value.value,
        BIRTHDATE: props.userData.registration?.birthdate
          ? formatDateObject(props.userData.registration.birthdate)
          : "",
        PHONE: props.userData.registration?.username || props.userData.username,
        POLICY_NUMBER: numberPolicy.value,
        USER_CONFIRM: isAgreement.value ? "Y" : "N",
        CONFIRM_MARKETING: isAgreementRec.value ? "Y" : "N",
      };
      emit("submit", params);
    };

    return {
      usernameState,
      surnameState,
      nameState,
      patronymicState,
      birthdateState,
      policyState,
      autocompleteSurname,
      autocompleteName,
      autocompletePatronymic,
      isHavePolicy,
      isAgreement,
      isAgreementRec,
      numberPolicy,
      isDisabled,
      isMainFormDisabled,
      isDisabledForm,
      isPatronymicNotExist,
      isErrorMessageAgreement,
      errorInputTextPhone,
      errorInputTextBirthdate,
      errorInputTextPatronymic,
      errorInputTextName,
      errorInputTextSurname,
      errorInputTextPolicy,
      validClassPhone,
      validClassBirthdate,
      validClassName,
      getSuggestionsSurname,
      getSuggestionsName,
      getSuggestionsPatronymic,
      getResultValue,
      handleBack,
      handleBlur,
      handlePolicyChange,
      updateBirthdate,
      updatePhone,
      validatePolicyNumber,
      updateState,
      onSubmit,
      userConfirm,
      openAgreementForm: () => emit("componentStep", "agreement"),
    };
  },
};
</script>

<style scoped>
.login-more {
  border-radius: 16px;
  margin: 1rem 0;
  padding: 16px;
  border: 1px solid #f2f4f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.login-more > div {
  font-size: 1.125rem;
  color: #434343;
}
.login-more::v-deep button {
  width: auto;
  padding: 0 1rem;
  margin: 0;
}
.reg-title {
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 2rem;
  color: #292929;
  display: flex;
  padding-right: 40px;
  align-items: center;
}
.reg-back {
  width: 24px;
  height: 24px;
  border: 0;
  display: inline-block;
  padding: 0;
  background: transparent;
}
.reg-back svg {
  vertical-align: top;
}
.reg-back + * {
  margin-left: 16px;
}
.invalid-feedback {
  display: block;
}
.invalid {
  border: 2px solid #eb5757 !important;
}
@media (max-width: 576px) {
  .login-more {
    padding: 8px;
  }
}
@media (min-width: 992px) {
  .v-scroll {
    padding-right: 24px;
    margin-right: -24px;
    max-height: 780px;
    overflow-y: auto;
  }
  .v-scroll::-webkit-scrollbar {
    background: #fff;
    width: 3px;
    height: 3px;
  }
  .v-scroll::-webkit-scrollbar-thumb {
    background: #43b02a;
    border: 5px solid transparent;
  }
  .v-scroll::-webkit-scrollbar-thumb:hover {
    background: #43b02a;
  }
  .v-scroll::-webkit-scrollbar-thumb:vertical {
    border-top-width: 0;
    border-bottom-width: 0;
  }
}
</style>
