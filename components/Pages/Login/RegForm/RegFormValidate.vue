<template>
  <div>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group  label="Name">
        <b-form-input
          v-model="$v.form.name.$model"
          :state="validateState('name')"
        ></b-form-input>
        <b-form-invalid-feedback
        >This is a required field and must be at least 3 characters.</b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
  import { validationMixin } from "vuelidate";
  import { required, minLength } from "vuelidate/lib/validators";

  export default {
    mixins: [validationMixin],
    data() {
      return {
        foods: [
          { value: null, text: "Choose..." },
          { value: "apple", text: "Apple" },
          { value: "orange", text: "Orange" }
        ],
        form: {
          name: null,
          food: null
        }
      };
    },
    validations: {
      form: {
        food: {
          required
        },
        name: {
          required,
          minLength: minLength(3)
        }
      }
    },
    methods: {
      validateState(name) {
        const { $dirty, $error } = this.$v.form[name];
        return $dirty ? !$error : null;
      },
      resetForm() {
        this.form = {
          name: null,
          food: null
        };

        this.$nextTick(() => {
          this.$v.$reset();
        });
      },
      onSubmit() {
        this.$v.form.$touch();
        if (this.$v.form.$anyError) {
          return;
        }

        alert("Form submitted!");
      }
    }
  };
</script>
