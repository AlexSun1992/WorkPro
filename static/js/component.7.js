(window["component_jsonp"] = window["component_jsonp"] || []).push([[7],{

/***/ "1f9f":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
var ___CSS_LOADER_AT_RULE_IMPORT_0___ = __webpack_require__("93bf");
var ___CSS_LOADER_AT_RULE_IMPORT_1___ = __webpack_require__("425e");
exports = ___CSS_LOADER_API_IMPORT___(false);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_0___);
exports.i(___CSS_LOADER_AT_RULE_IMPORT_1___);
// Module
exports.push([module.i, "", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "5695":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"9b34972c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Login/LoginButton.vue?vue&type=template&id=63eff8f1&scoped=true&shadow
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"LoginButton"},[_c('div',[(_vm.isAuthentificated)?_c('b-dropdown',{staticClass:"m-md-2",attrs:{"variant":"success","id":"dropdown-1","text":_vm.userName}},_vm._l((_vm.navigationList),function(item,index){return _c('b-dropdown-item',{key:index,on:{"click":function($event){return _vm.applyAction(index)}}},[_vm._v(" "+_vm._s(item)+" ")])}),1):_c('b-button',{attrs:{"variant":"success"},on:{"click":_vm.redirectToLoginPage}},[_vm._v("ЛИЧНЫЙ КАБИНЕТ")])],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/Login/LoginButton.vue?vue&type=template&id=63eff8f1&scoped=true&shadow

// EXTERNAL MODULE: ./node_modules/axios/index.js
var axios = __webpack_require__("bc3a");
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);

// EXTERNAL MODULE: ./node_modules/js-cookie/src/js.cookie.js
var js_cookie = __webpack_require__("a78e");
var js_cookie_default = /*#__PURE__*/__webpack_require__.n(js_cookie);

// EXTERNAL MODULE: ./node_modules/bootstrap-vue/esm/components/dropdown/dropdown.js + 7 modules
var dropdown = __webpack_require__("dd9a");

// EXTERNAL MODULE: ./node_modules/bootstrap-vue/esm/components/button/button.js
var button_button = __webpack_require__("1947");

// EXTERNAL MODULE: ./node_modules/bootstrap-vue/esm/components/dropdown/dropdown-item.js
var dropdown_item = __webpack_require__("9eaa");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/Login/LoginButton.vue?vue&type=script&lang=js&shadow
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



const TOKEN_NAME = "auth._token.local";
const REFRESH_TOKEN_NAME = "auth._refresh_token.local";
const URL_GET_USER_NAME = "/am/main/v2/userinfo";
/* harmony default export */ var LoginButtonvue_type_script_lang_js_shadow = ({
  name: "LoginButton",
  components: {
    BDropdown: dropdown["a" /* BDropdown */],
    BButton: button_button["a" /* BButton */],
    BDropdownItem: dropdown_item["a" /* BDropdownItem */]
  },

  data() {
    return {
      personsData: null,
      navigationList: ["Личный кабинет", "Выход"]
    };
  },

  methods: {
    applyAction(index) {
      if (index === 0) {
        window.location.href = "http://new.reso.ru/cabinet";
      } else {
        this.personsData = null;
        js_cookie_default.a.set(TOKEN_NAME, null);
        js_cookie_default.a.set(REFRESH_TOKEN_NAME, null);
      }
    },

    redirectToLoginPage() {
      window.location.href = "http://new.reso.ru/login";
    },

    getPersonsData() {
      const token = js_cookie_default.a.get(TOKEN_NAME);

      if (token) {
        axios_default.a.defaults.headers.common["Authorization"] = token;
      }

      axios_default()({
        url: URL_GET_USER_NAME,
        method: "GET"
      }).then(resp => {
        this.personsData = resp.data[0]._data[0];
      }).catch(err => {
        this.personsData = null;
      });
    }

  },
  computed: {
    isAuthentificated() {
      return Boolean(this.personsData);
    },

    userName() {
      return this.personsData["SFIRSTNAME"] + " " + this.personsData["SSECONDNAME"];
    }

  },

  created() {
    this.getPersonsData();
  }

});
// CONCATENATED MODULE: ./src/components/Login/LoginButton.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var Login_LoginButtonvue_type_script_lang_js_shadow = (LoginButtonvue_type_script_lang_js_shadow); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("2877");

// CONCATENATED MODULE: ./src/components/Login/LoginButton.vue?shadow



function injectStyles (context) {
  
  var style0 = __webpack_require__("9a90")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Login_LoginButtonvue_type_script_lang_js_shadow,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "63eff8f1",
  null
  ,true
)

/* harmony default export */ var LoginButtonshadow = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "7909":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("1f9f");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("38813247", content, shadowRoot)
};

/***/ }),

/***/ "9a90":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginButton_vue_vue_type_style_index_0_id_63eff8f1_scoped_true_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7909");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginButton_vue_vue_type_style_index_0_id_63eff8f1_scoped_true_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginButton_vue_vue_type_style_index_0_id_63eff8f1_scoped_true_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginButton_vue_vue_type_style_index_0_id_63eff8f1_scoped_true_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoginButton_vue_vue_type_style_index_0_id_63eff8f1_scoped_true_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ })

}]);
//# sourceMappingURL=component.7.js.map