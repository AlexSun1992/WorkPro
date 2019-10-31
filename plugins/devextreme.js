import ruMessages from 'devextreme/localization/messages/ru.json';
import { locale, loadMessages, formatMessage } from "devextreme/localization";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';



export default {
  created () {
    console.log(ruMessages);
    loadMessages(ruMessages);
    locale(navigator.language);
  }
};
