<template>
  <div>
    <div class="main-blk">
      <div
        v-if="data.label != null"
        class="mb-3"
      >
        {{ data.label }}
      </div>
      <div class="row">
        <div class="col-auto mb-3">
          <button
            type="button"
            @click="showModal"
            id="btn_osago_form_auth"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 14C15.033 14 17.5 11.532 17.5 8.5C17.5 5.468 15.033 3 12 3C8.967 3 6.5 5.468 6.5 8.5C6.5 11.532 8.967 14 12 14ZM12 5C13.93 5 15.5 6.57 15.5 8.5C15.5 10.43 13.93 12 12 12C10.07 12 8.5 10.43 8.5 8.5C8.5 6.57 10.07 5 12 5ZM20 18.967V19.9998C20 20.5522 19.5522 21 18.9998 21C18.4475 21 17.9998 20.5525 17.9995 20.0002L17.999 18.967C17.999 17.568 17.072 16.358 15.746 16.025C15.554 15.977 15.349 16.001 15.185 16.095C13.204 17.197 10.786 17.191 8.82397 16.101C8.65097 16.002 8.447 15.977 8.255 16.025C6.926 16.358 6 17.568 6 18.967V20C6 20.5523 5.55228 21 5 21C4.44772 21 4 20.5523 4 20V18.967C4 16.65 5.54903 14.642 7.76703 14.085C8.45403 13.91 9.19803 14.011 9.80603 14.358C11.155 15.106 12.836 15.1121 14.204 14.3521C14.803 14.0091 15.547 13.909 16.235 14.084C18.451 14.642 20 16.649 20 18.967Z"
                fill="#292929"
              />
            </svg>
            Личный кабинет
          </button>
        </div>
        <div
          class="col-auto mb-3"
          @click="goESIA"
        >
          <button
            type="button"
            class="btn-gosuslugi"
            id="btn_osago_form_esia"
          >
            <svg
              data-v-5e3cce17=""
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                data-v-5e3cce17=""
                d="M23.491 7.96099C23.3939 6.72414 22.4227 5.13843 21.4514 4.37728C20.3593 3.59833 19.2245 2.8784 18.0521 2.22071C16.8887 1.54516 15.6891 0.931138 14.4586 0.381281C13.8013 0.118613 13.0965 -0.010849 12.3866 0.000711296V1.52763C13.0112 1.51754 13.6315 1.63052 14.2099 1.85977C15.2928 2.33964 16.3484 2.87551 17.3722 3.46508C18.4039 4.03906 19.4025 4.66738 20.3637 5.34719C21.2183 6.01144 22.073 7.39533 22.1585 8.47478C22.1585 8.47478 22.3579 10.0801 22.3864 11.9816C22.3846 13.1559 22.3181 14.3293 22.187 15.4967C21.9882 16.719 21.3405 17.83 20.3637 18.6243C20.3637 18.6243 19.0246 19.5653 17.3722 20.534C16.3482 21.1233 15.2926 21.6592 14.2099 22.1393C13.6323 22.3712 13.0115 22.4842 12.3866 22.4715V23.9989C13.0967 24.0135 13.8022 23.8839 14.4586 23.6183C15.6889 23.0681 16.8885 22.4541 18.0521 21.7789C19.9298 20.6689 21.4514 19.5906 21.4514 19.5906C22.5615 18.6805 23.2975 17.4075 23.5234 16.0069C23.6724 14.6693 23.748 13.3247 23.75 11.9792C23.7176 9.80039 23.491 7.96099 23.491 7.96099Z"
                fill="#D9D9D9"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M23.491 7.96099C23.3939 6.72414 22.4227 5.13843 21.4514 4.37728C20.3593 3.59833 19.2245 2.8784 18.0521 2.22071C16.8887 1.54516 15.6891 0.931138 14.4586 0.381281C13.8013 0.118613 13.0965 -0.010849 12.3866 0.000711296V1.52763C13.0112 1.51754 13.6315 1.63052 14.2099 1.85977C15.2928 2.33964 16.3484 2.87551 17.3722 3.46508C18.4039 4.03906 19.4025 4.66738 20.3637 5.34719C21.2183 6.01144 22.073 7.39533 22.1585 8.47478C22.1585 8.47478 22.3579 10.0801 22.3864 11.9816C22.3846 13.1559 22.3181 14.3293 22.187 15.4967C21.9882 16.719 21.3405 17.83 20.3637 18.6243C20.3637 18.6243 19.0246 19.5653 17.3722 20.534C16.3482 21.1233 15.2926 21.6592 14.2099 22.1393C13.6323 22.3712 13.0115 22.4842 12.3866 22.4715V23.9989C13.0967 24.0135 13.8022 23.8839 14.4586 23.6183C15.6889 23.0681 16.8885 22.4541 18.0521 21.7789C19.9298 20.6689 21.4514 19.5906 21.4514 19.5906C22.5615 18.6805 23.2975 17.4075 23.5234 16.0069C23.6724 14.6693 23.748 13.3247 23.75 11.9792C23.7176 9.80039 23.491 7.96099 23.491 7.96099Z"
                fill="url(#paint0_linear_1360_28394)"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M12.3866 1.52763V0.000711296C11.6768 -0.010849 10.9721 0.11861 10.3148 0.381278C9.08427 0.931135 7.88472 1.54516 6.72125 2.2207C5.5489 2.8784 4.41413 3.59833 3.32194 4.37727C2.35071 5.13842 1.37947 6.72414 1.28237 7.96098H2.70556C2.96222 6.98825 3.68596 5.90969 4.40973 5.34719C5.37085 4.66738 6.36948 4.03905 7.40113 3.46508C8.42495 2.87551 9.4806 2.33963 10.5634 1.85976C11.1419 1.63052 11.762 1.51754 12.3866 1.52763Z"
                fill="#D9D9D9"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M12.3866 1.52763V0.000711296C11.6768 -0.010849 10.9721 0.11861 10.3148 0.381278C9.08427 0.931135 7.88472 1.54516 6.72125 2.2207C5.5489 2.8784 4.41413 3.59833 3.32194 4.37727C2.35071 5.13842 1.37947 6.72414 1.28237 7.96098H2.70556C2.96222 6.98825 3.68596 5.90969 4.40973 5.34719C5.37085 4.66738 6.36948 4.03905 7.40113 3.46508C8.42495 2.87551 9.4806 2.33963 10.5634 1.85976C11.1419 1.63052 11.762 1.51754 12.3866 1.52763Z"
                fill="url(#paint1_linear_1360_28394)"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M12.3866 23.9989V22.4715C11.7618 22.4842 11.1411 22.3712 10.5634 22.1393C9.48075 21.6591 8.42515 21.1233 7.40113 20.534C5.74874 19.5653 4.40973 18.6243 4.40973 18.6243C3.57074 17.9421 2.97454 17.0262 2.69705 16.0069H1.25C1.47588 17.4075 2.2119 18.6805 3.32194 19.5906C3.32194 19.5906 4.84355 20.6689 6.72125 21.7789C7.88492 22.454 9.08447 23.068 10.3148 23.6183C10.9712 23.8839 11.6766 24.0135 12.3866 23.9989Z"
                fill="#D9D9D9"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M12.3866 23.9989V22.4715C11.7618 22.4842 11.1411 22.3712 10.5634 22.1393C9.48075 21.6591 8.42515 21.1233 7.40113 20.534C5.74874 19.5653 4.40973 18.6243 4.40973 18.6243C3.57074 17.9421 2.97454 17.0262 2.69705 16.0069H1.25C1.47588 17.4075 2.2119 18.6805 3.32194 19.5906C3.32194 19.5906 4.84355 20.6689 6.72125 21.7789C7.88492 22.454 9.08447 23.068 10.3148 23.6183C10.9712 23.8839 11.6766 24.0135 12.3866 23.9989Z"
                fill="url(#paint2_linear_1360_28394)"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M14.2099 1.85977C13.6315 1.63052 13.0112 1.51754 12.3866 1.52763V2.2207C12.9143 2.2207 13.2975 2.2207 14.2869 2.70375C16.0938 3.58589 17.6137 4.37727 19.1692 5.34719C20.1547 5.96168 20.6685 6.15953 21.4428 7.94137C21.4428 7.94137 21.7752 10.3965 21.7752 11.9741C21.7752 13.5518 21.4428 16.0069 21.4428 16.0069C20.6637 17.8069 20.1498 18.004 19.1607 18.6207C17.6052 19.5906 16.0852 20.382 14.2784 21.2641C13.289 21.7472 12.9058 21.7472 12.3781 21.7472C11.8505 21.7472 11.4673 21.7472 10.4779 21.2641C8.67102 20.382 7.15108 19.5906 5.59554 18.6207C4.60643 18.004 4.09256 17.8069 3.31344 16.0069H2.69705C2.97454 17.0262 3.57074 17.9421 4.40973 18.6243C4.40973 18.6243 5.74874 19.5653 7.40113 20.534C8.42515 21.1233 9.48075 21.6591 10.5634 22.1393C11.1411 22.3712 11.7618 22.4842 12.3866 22.4715C13.0115 22.4842 13.6323 22.3712 14.2099 22.1393C15.2926 21.6592 16.3482 21.1233 17.3722 20.534C19.0246 19.5653 20.3637 18.6243 20.3637 18.6243C21.3405 17.83 21.9882 16.719 22.187 15.4967C22.3181 14.3293 22.3846 13.1559 22.3864 11.9816C22.3579 10.0801 22.1585 8.47478 22.1585 8.47478C22.073 7.39533 21.2183 6.01144 20.3637 5.34719C19.4025 4.66738 18.4039 4.03906 17.3722 3.46508C16.3484 2.87551 15.2928 2.33964 14.2099 1.85977Z"
                fill="#D9D9D9"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M14.2099 1.85977C13.6315 1.63052 13.0112 1.51754 12.3866 1.52763V2.2207C12.9143 2.2207 13.2975 2.2207 14.2869 2.70375C16.0938 3.58589 17.6137 4.37727 19.1692 5.34719C20.1547 5.96168 20.6685 6.15953 21.4428 7.94137C21.4428 7.94137 21.7752 10.3965 21.7752 11.9741C21.7752 13.5518 21.4428 16.0069 21.4428 16.0069C20.6637 17.8069 20.1498 18.004 19.1607 18.6207C17.6052 19.5906 16.0852 20.382 14.2784 21.2641C13.289 21.7472 12.9058 21.7472 12.3781 21.7472C11.8505 21.7472 11.4673 21.7472 10.4779 21.2641C8.67102 20.382 7.15108 19.5906 5.59554 18.6207C4.60643 18.004 4.09256 17.8069 3.31344 16.0069H2.69705C2.97454 17.0262 3.57074 17.9421 4.40973 18.6243C4.40973 18.6243 5.74874 19.5653 7.40113 20.534C8.42515 21.1233 9.48075 21.6591 10.5634 22.1393C11.1411 22.3712 11.7618 22.4842 12.3866 22.4715C13.0115 22.4842 13.6323 22.3712 14.2099 22.1393C15.2926 21.6592 16.3482 21.1233 17.3722 20.534C19.0246 19.5653 20.3637 18.6243 20.3637 18.6243C21.3405 17.83 21.9882 16.719 22.187 15.4967C22.3181 14.3293 22.3846 13.1559 22.3864 11.9816C22.3579 10.0801 22.1585 8.47478 22.1585 8.47478C22.073 7.39533 21.2183 6.01144 20.3637 5.34719C19.4025 4.66738 18.4039 4.03906 17.3722 3.46508C16.3484 2.87551 15.2928 2.33964 14.2099 1.85977Z"
                fill="url(#paint3_linear_1360_28394)"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M12.3866 1.52763C11.762 1.51754 11.1419 1.63052 10.5634 1.85976C9.4806 2.33963 8.42495 2.87551 7.40113 3.46508C6.36948 4.03905 5.37085 4.66738 4.40973 5.34719C3.68596 5.90969 2.96222 6.98825 2.70556 7.96098H3.32194C4.10107 6.16097 4.61494 5.96393 5.60405 5.34719C7.15959 4.37727 8.67953 3.58589 10.4864 2.70375C11.4758 2.2207 11.859 2.2207 12.3866 2.2207V1.52763Z"
                fill="#D9D9D9"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M12.3866 1.52763C11.762 1.51754 11.1419 1.63052 10.5634 1.85976C9.4806 2.33963 8.42495 2.87551 7.40113 3.46508C6.36948 4.03905 5.37085 4.66738 4.40973 5.34719C3.68596 5.90969 2.96222 6.98825 2.70556 7.96098H3.32194C4.10107 6.16097 4.61494 5.96393 5.60405 5.34719C7.15959 4.37727 8.67953 3.58589 10.4864 2.70375C11.4758 2.2207 11.859 2.2207 12.3866 2.2207V1.52763Z"
                fill="url(#paint4_linear_1360_28394)"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M1.25 9.3498C1.25 9.18412 1.38431 9.0498 1.55 9.0498H9.95C10.1157 9.0498 10.25 9.18412 10.25 9.3498V11.1498C10.25 11.3155 10.1157 11.4498 9.95 11.4498H1.55C1.38431 11.4498 1.25 11.3155 1.25 11.1498V9.3498Z"
                fill="#1068B2"
              ></path>
              <path
                data-v-5e3cce17=""
                d="M1.25 12.9504C1.25 12.7847 1.38431 12.6504 1.55 12.6504H17.45C17.6157 12.6504 17.75 12.7847 17.75 12.9504V14.7504C17.75 14.9161 17.6157 15.0504 17.45 15.0504H1.55C1.38431 15.0504 1.25 14.9161 1.25 14.7504V12.9504Z"
                fill="#EF3054"
              ></path>
              <defs data-v-5e3cce17="">
                <linearGradient
                  data-v-5e3cce17=""
                  id="paint0_linear_1360_28394"
                  x1="17.9673"
                  y1="-0.08736"
                  x2="17.9673"
                  y2="23.9674"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    data-v-5e3cce17=""
                    stop-color="#0F67B1"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="0.4"
                    stop-color="#0F67B1"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="0.66"
                    stop-color="#EE2F53"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="1"
                    stop-color="#EE2F53"
                  ></stop>
                </linearGradient>
                <linearGradient
                  data-v-5e3cce17=""
                  id="paint1_linear_1360_28394"
                  x1="17.9673"
                  y1="-0.08736"
                  x2="17.9673"
                  y2="23.9674"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    data-v-5e3cce17=""
                    stop-color="#0F67B1"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="0.4"
                    stop-color="#0F67B1"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="0.66"
                    stop-color="#EE2F53"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="1"
                    stop-color="#EE2F53"
                  ></stop>
                </linearGradient>
                <linearGradient
                  data-v-5e3cce17=""
                  id="paint2_linear_1360_28394"
                  x1="17.9673"
                  y1="-0.08736"
                  x2="17.9673"
                  y2="23.9674"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    data-v-5e3cce17=""
                    stop-color="#0F67B1"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="0.4"
                    stop-color="#0F67B1"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="0.66"
                    stop-color="#EE2F53"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="1"
                    stop-color="#EE2F53"
                  ></stop>
                </linearGradient>
                <linearGradient
                  data-v-5e3cce17=""
                  id="paint3_linear_1360_28394"
                  x1="17.9673"
                  y1="-0.08736"
                  x2="17.9673"
                  y2="23.9674"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    data-v-5e3cce17=""
                    stop-color="#0F67B1"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="0.4"
                    stop-color="#0F67B1"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="0.66"
                    stop-color="#EE2F53"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="1"
                    stop-color="#EE2F53"
                  ></stop>
                </linearGradient>
                <linearGradient
                  data-v-5e3cce17=""
                  id="paint4_linear_1360_28394"
                  x1="17.9673"
                  y1="-0.08736"
                  x2="17.9673"
                  y2="23.9674"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    data-v-5e3cce17=""
                    stop-color="#0F67B1"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="0.4"
                    stop-color="#0F67B1"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="0.66"
                    stop-color="#EE2F53"
                  ></stop>
                  <stop
                    data-v-5e3cce17=""
                    offset="1"
                    stop-color="#EE2F53"
                  ></stop>
                </linearGradient>
              </defs>
            </svg>
            Войти через Госуслуги
          </button>
        </div>
      </div>
      <b-modal
        id="sms-auth-confirm-modal"
        v-model="isModalVisible"
        hide-footer
        @close="resetForm"
        :centered="true"
        :static="true"
        title="Авторизация"
        content-class="sms-confirm-modal"
      >
        <div
          class="form-container"
          v-if="isModalVisible"
        >
          <b-form id="authForm">
            <label for="phoneNumber">Введите номер телефона</label>
            <input
              :class="phoneNumberClass"
              ref="phoneNumber"
              id="phoneNumber"
              autofocus
              :disabled="isPhoneNumberDisabled"
              @blur="touchPhoneNumber"
              @keydown="preventForNumberInput"
              @keydown.enter="requestSMS"
              @input="phoneNumberUpdated"
              name="phoneNumber"
              placeholder="+7(___)-___-__-__"
              required
              v-model="phoneNumber"
              v-mask="mask"
            />

            <div
              class="error-block d-block mt-1"
              v-if="wrongAuthData"
            >
              {{ smsErrorMessage }}
            </div>

            <label
              for="smsCode"
              class="mt-3"
              >Введите код подтверждения из SMS</label
            >
            <input
              type="number"
              id="smsCode"
              name="smsCode"
              :class="smsCodeClass"
              @blur="touchSMSCode"
              @keydown="preventForNumberInput"
              @keydown.enter="sendAuthData"
              @input="updateSMSCode"
              placeholder="Введите код из СМС"
              :disabled="isAuthInputDisabled"
              required
              v-model="SMSCode"
            />

            <!-- Кнопка запроса СМС -->
            <button
              type="button"
              class="mt-3"
              :class="{
                'btn-primary': isAuthButtonDisabled,
                'btn-secondary': !isAuthButtonDisabled,
              }"
              :disabled="isSMSButtonDisabled"
              id="sendSmsButton"
              @click="requestSMS"
            >
              {{ sendSmsBtnName }}
              <template v-if="isShowTimer">
                (через
                <VerifyTimer
                  :duration="duration"
                  @onFinish="stopSMSRequest"
                  :key="verifyTimerKey"
                />
                секунд)
              </template>
            </button>

            <!-- Кнопка отправки формы с кодом -->
            <button
              type="button"
              class="btn-primary mt-3"
              id="authButton"
              :disabled="isAuthButtonDisabled"
              @click="sendAuthData"
            >
              Авторизация
            </button>
          </b-form>
          <div
            v-if="isFormErrorMessage"
            class="error-block d-block mt-3"
          >
            <transition
              name="fade"
              mode="out-in"
            >
              <p
                :key="currentErrorKey"
                v-html="currentErrorMessage"
              />
            </transition>
          </div>
        </div>
      </b-modal>
    </div>

    <div
      v-if="gosuslugiErrorMessage"
      class="mt-3 error-block"
      id="errorMessage"
    >
      {{ gosuslugiErrorMessage }}
    </div>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import controlAuthorizationHelper from "./controlAuthorizationHelper";
import controlAuthorizationConstants from "./controlAuthorizationConstants";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";

export default {
  name: "ControlAuthorization",
  components: { VerifyTimer },
  directives: { mask },
  props: {
    data: {
      type: Object,
      default: () => ({
        fieldId: "",
        name: "",
        value: "",
      }),
    },
  },
  data: () => ({
    isModalVisible: false,
    isSMSRequested: false,
    phoneNumber: "",
    SMSCode: "",
    isSMSRequestInProgress: false,
    isPhoneNumberTouched: false,
    isSmsCodeTouched: false,
    isAuthDataRequestInProgress: false,
    wrongAuthData: false,
    isPhoneNumberUpdated: false,
    isSendDataInProgress: false,
    placeholder: "+7(___)-___-__-__",
    mask: "+7(9##)-###-##-##",
    duration: 60,
    smsErrorMessage: "Проверьте корректность введенных данных.",
    gosuslugiErrorMessage: null,
    isFormErrorMessage: false,
    verifyTimerKey: 1,
    currentErrorKey: 0,
    saveFormErrorMessages: [
      "Что-то пошло не так &#128557;",
      "Попробуйте повторить попытку позже",
      "Всё обязательно получится!&#128521;",
    ],
  }),
  mounted() {
    this.addLoggedInListener();

    this.gosuslugiErrorMessage = new URLSearchParams(window.location.search).get("error");
  },
  computed: {
    controlAuthorizationConstants() {
      return controlAuthorizationConstants;
    },
    isAuthInputDisabled() {
      return !this.isSMSRequested || this.wrongAuthData || this.isAuthDataRequestInProgress;
    },
    isPhoneNumberDisabled() {
      return this.isAuthDataRequestInProgress;
    },
    sendSmsBtnName() {
      if (this.isSMSRequested) {
        return this.controlAuthorizationConstants.sendSMSAgainBtnName;
      }

      return this.controlAuthorizationConstants.sendSMSBtnName;
    },
    phoneNumberNormalize() {
      return controlAuthorizationHelper.getRestructuredPhoneNumber(this.phoneNumber);
    },

    correctPhoneNumber() {
      if (this.phoneNumberNormalize) {
        return this.phoneNumberNormalize.replace(/^\+./, "");
      }
      return this.phoneNumber;
    },

    isPhoneValid() {
      if (this.phoneNumber.length === this.controlAuthorizationConstants.phoneNumberLength) {
        return true;
      }

      if (this.isPhoneNumberTouched) {
        return false;
      }

      return null;
    },
    phoneNumberClass() {
      const isValid = this.isPhoneValid;

      if (isValid === null) {
        return "";
      }

      return isValid ? "is-valid" : "is-invalid";
    },

    isSmsCodeValid() {
      if (this.SMSCode?.length === this.controlAuthorizationConstants.smsCodeLength) {
        return true;
      }

      if (this.isSmsCodeTouched) {
        return false;
      }

      return null;
    },

    isAuthButtonDisabled() {
      return (
        this.isPhoneNumberUpdated ||
        !this.isSmsCodeValid ||
        this.wrongAuthData ||
        this.isSendDataInProgress ||
        this.isAuthDataRequestInProgress
      );
    },

    smsCodeClass() {
      const isValid = this.isSmsCodeValid;

      if (isValid === null) {
        return "";
      }

      return isValid ? "is-valid" : "is-invalid";
    },
    isShowTimer() {
      return this.isSMSRequestInProgress;
    },
    isSMSButtonDisabled() {
      return this.isSMSRequestInProgress || !this.isPhoneValid || this.isAuthDataRequestInProgress;
    },
    currentErrorMessage() {
      return this.saveFormErrorMessages[this.currentErrorKey];
    },
  },
  methods: {
    addLoggedInListener() {
      window.addEventListener("user-logged-in", (ev) => {
        if (ev.detail) {
          this.afterSaveAction();
        }
      });
    },
    showModal() {
      this.resetForm();
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },

    async requestSMS() {
      const smsData = {
        SPHONE: this.correctPhoneNumber,
        ID: null,
      };

      if (this.isSMSButtonDisabled) {
        return;
      }

      this.startSMSRequest();

      const authResp = await controlAuthorizationHelper.requestSmsCode(smsData);

      if (authResp.error) {
        this.smsErrorMessage = authResp.error?.response.data?.INFO ?? this.smsErrorMessage;
        this.wrongAuthData = true;
      }
    },
    startSMSRequest() {
      this.isPhoneNumberUpdated = false;
      this.wrongAuthData = false;
      this.isSMSRequested = true;
      this.isSMSRequestInProgress = true;
    },
    stopSMSRequest() {
      this.isSMSRequestInProgress = false;
    },
    phoneNumberUpdated(event) {
      this.touchPhoneNumber();
      this.isSMSRequested = false;
      this.isPhoneNumberUpdated = true;
      this.wrongAuthData = false;
      this.phoneNumber = event.target?.value?.substring(0, this.controlAuthorizationConstants.phoneNumberLength);
      this.SMSCode = "";
      this.isFormErrorMessage = false;
    },
    preventForNumberInput(ev) {
      if (ev.key === "-" || ev.key === "+") {
        ev.preventDefault();
      }
    },
    sendAuthData() {
      if (this.isAuthButtonDisabled) {
        return;
      }

      this.isSendDataInProgress = true;
      this.isAuthDataRequestInProgress = true;

      this.updateStoreValue();
      this.$emit("saveCard", "Auth");
    },
    afterSaveAction() {
      const isSaveError = this.$store.getters["data_card/getSavedError"];
      const errorMessage = this.$store.getters["data_card/getErrorMessage"];
      this.isAuthDataRequestInProgress = false;
      this.isSendDataInProgress = false;

      if (isSaveError) {
        this.saveFormErrorMessages = [errorMessage];
        this.isFormErrorMessage = true;

        console.error(`sendAuthData: ${errorMessage}`);

        return true;
      }

      const authSuccessEvent = new window.CustomEvent("auth-success-event", {
        status: true,
      });

      window.dispatchEvent(authSuccessEvent);
      this.closeModal();

      return false;
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data());

      this.verifyTimerKey += 1;
    },
    updateStoreValue() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: { code: this.SMSCode, phone: this.correctPhoneNumber },
      });
    },

    touchSMSCode() {
      this.isSmsCodeTouched = true;
    },

    updateSMSCode() {
      this.touchSMSCode();
      this.SMSCode = this.SMSCode.substring(0, this.controlAuthorizationConstants.smsCodeLength);
      this.isFormErrorMessage = false;
    },

    touchPhoneNumber() {
      this.isPhoneNumberTouched = true;
    },
    updateFormDataErrorMessage() {
      setTimeout(() => {
        this.currentErrorKey += 1;

        if (this.currentErrorKey + 1 < this.saveFormErrorMessages.length) {
          this.updateFormDataErrorMessage();
        }
      }, 3000);
    },
    goESIA() {
      const url = new URL("/sso?auth&type=esia", window.location.origin);
      const currentUrl = new URL(window.location.href);
      url.searchParams.set("ref", encodeURIComponent(currentUrl.pathname + currentUrl.search));
      window.location.href = url.href;
    },
  },
};
</script>

<style scoped>
.bg-auth-success .main-blk {
  background: #edf8ea;
}

.bg-auth-warning .main-blk {
  background: #fff1eb;
}

.bg-auth-error .main-blk {
  background: #ffebeb;
}

.bg-auth-information .main-blk {
  background: #ecf3fa;
}

.bg-auth-grey .main-blk {
  background: #f2f4f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

button {
  text-align: center;
  padding: 0 30px !important;
  border-radius: 15px;
  font-size: 1rem;
  line-height: 50px;
  box-sizing: border-box;
  border: 2px solid #ffffff;
  font-weight: 700;
  white-space: nowrap;
  display: inline-block;
  position: relative;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 54px !important;
  color: #292929;
  width: 100%;
  background: #fff;
}

.bg-auth-grey .main-blk,
.bg-auth-success .main-blk,
.bg-auth-warning .main-blk,
.bg-auth-error .main-blk,
.bg-auth-information .main-blk {
  border-radius: 16px;
  padding: 24px 20px 8px 20px;
}

.mb-minus-3 {
  margin-bottom: -1rem;
}

.error-block {
  background: #ffebeb url(/img/informer-er.svg) left 16px top 12px no-repeat;
  padding: 16px 32px 16px 64px;
  color: #292929;
  border-radius: 16px;
}

button svg {
  margin-right: 10px;
  width: 20px;
  margin-top: -2px;
}

button:hover {
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.08);
  color: #686868;
  transition: 0.3s;
}
</style>
