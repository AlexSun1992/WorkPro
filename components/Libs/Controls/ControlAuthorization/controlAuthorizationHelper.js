import axios from "axios";

export default {
  commonHeader: {
    "content-type": "application/json",
  },
  async requestSmsCode(data) {
    const result = { success: null, error: null };
    try {
      result.success = await axios.post("/am/free/v2/SendSmsForAuth", data, {
        headers: this.commonHeader,
      });
    } catch (e) {
      result.error = e;
    }

    return result;
  },

  async auth(data) {
    await axios.post("/am/free/v2/authorregist", data, {
      headers: this.commonHeader,
    });
  },

  async saveCard() {
    await this.$emit("saveCard");
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
    const onlyNumbersInPhoneNumber = this.removeNotNumberElements(phoneNumber);
    const testPhone =
      /^(\+7|7|8)?[\s\-]?\(?[9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

    return testPhone.test(onlyNumbersInPhoneNumber);
  },

  bringToUniverseType(pastedValue) {
    const firstSymbol = this.getFirstSymbol(pastedValue);
    const pureNumber = this.getPureNumber(pastedValue);

    const plus = "+";
    const plusSeven = "+7";

    if (firstSymbol === "7") {
      return plus.concat("", pureNumber);
    }

    if (firstSymbol === "8") {
      return pureNumber.replace("8", "+7");
    }

    if (firstSymbol !== "7" && firstSymbol !== "8") {
      return plusSeven.concat("", pureNumber);
    }

    return pureNumber;
  },

  getFirstSymbol(pastedValue) {
    const getArray = this.transformValueToArray(pastedValue);
    const [firstSymbol] = getArray;

    return firstSymbol;
  },

  transformValueToArray(pastedValue) {
    const purePhoneNumber = this.getPureNumber(pastedValue);

    return purePhoneNumber.split("");
  },

  getPureNumber(value = "") {
    return value.replace(/[\(\)+-.\s]/g, "");
  }
};
