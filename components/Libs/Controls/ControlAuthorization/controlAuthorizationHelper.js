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
};
