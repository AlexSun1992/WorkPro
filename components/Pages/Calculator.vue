<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <LoginModal :on-auth="regPolicy" ref="refLogin" />
      <b-row>
        <b-col lg="12">
          <b-card>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label>A</label>
                  <b-form-input v-model="form.a" type="number"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label>B</label>
                  <b-form-input v-model="form.b" type="number"></b-form-input>
                </b-form-group>
                <b-form-group v-show="result">
                  <label>Результат</label>
                  <b-form-input
                    v-model="result"
                    disabled
                    type="number"
                  ></b-form-input>
                </b-form-group>
                <div>
                  <b-button
                    :disabled="isDisabledCalculate"
                    v-on:click="calculate"
                    type="submit"
                    size="md"
                    variant="primary"
                    >Рассчитать</b-button
                  >
                  <b-button
                    :disabled="isDisabledApply"
                    v-on:click="regPolicy"
                    type="submit"
                    size="md"
                    variant="primary"
                    >Оформить</b-button
                  >
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LoginModal from "./Login/LoginModal";
export default {
  name: "Calculator",
  components: { LoginModal },
  data() {
    return {
      user: {},
      form: {},
      calcId: null,
      result: null,
    };
  },
  computed: {
    isDisabledCalculate() {
      return !this.form.a || !this.form.b;
    },
    isDisabledApply() {
      return !this.calcId;
    },
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    calculate() {
      const min = Math.ceil(5000);
      const max = Math.floor(1000);
      this.calcId = Math.floor(Math.random() * (max - min)) + min;
      this.result = Number(this.form.a) + Number(this.form.b);
    },
    regPolicy() {
      if (!this.isAuthenticated) {
        this.$router.push("/login");
      } else {
        this.$router.push(`/cabinet/reg-policy/${this.calcId}`);
      }
    },
  },
};
</script>

<style scoped></style>
