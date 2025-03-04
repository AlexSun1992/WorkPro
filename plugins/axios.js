import { axiosErrorHelper } from "./axios/axiosError.helper";

export default ({ $axios, store }) => {
  $axios.onError((err) => {
    store.commit("custom_error_message/addError", axiosErrorHelper.getErrorMessage(err));
  });
};
