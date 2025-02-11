import axios from "axios";

export default {
  commonHeader: {
    "content-type": "application/json",
  },
  async sentSmsCode(data) {
    await axios.post("/am/authw/v2/authorize", data, {
      headers: this.commonHeader,
    });

    return "";
  },

  async auth(data) {
    await axios.post("/am/free/v2/authorregist", data, {
      headers: this.commonHeader,
    });
  },

  getRestructuredPhoneNumber(inputPastedValue) {
    const getOnlyNumbers = this.removeNotNumberElements(inputPastedValue);
    const isPastedNumber = this.isPhoneNumberValid(inputPastedValue);

    if (isPastedNumber) {
      return this.bringToUniverseType(getOnlyNumbers);
    }

    return isPastedNumber;
  },

  removeNotNumberElements(phoneNumber) {
    return phoneNumber.replace(/\D/g, "");
  },

  isPhoneNumberValid(phoneNumber) {
    const onlyNumbersInPhoneNumber = removeNotNumberElements(phoneNumber);
    const testPhone =
      /^(\+7|7|8)?[\s\-]?\(?[9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

    return testPhone.test(onlyNumbersInPhoneNumber);
  },

  bringToUniverseType(pastedValue) {
    const firstSymbol = getFirstSymbol(pastedValue);
    const pureNumber = pastedValue.replace(/[\(\)+-.\s]/g, "");
    let universeTypeForm;

    const plus = "+";
    const plusSeven = "+7";

    if (firstSymbol === "7") {
      universeTypeForm = plus.concat("", pureNumber);
      return universeTypeForm;
    }

    if (firstSymbol === "8") {
      universeTypeForm = pureNumber.replace("8", "+7");
      return universeTypeForm;
    }

    if (firstSymbol !== "7" && firstSymbol !== "8") {
      universeTypeForm = plusSeven.concat("", pureNumber);
      return universeTypeForm;
    }

    return pureNumber;
  }
};
