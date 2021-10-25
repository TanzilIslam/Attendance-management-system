<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="6"
        lg="6"
        xl="6"
        offset-md="3"
        offset-lg="3"
        offset-xl="3"
      >
        <v-toolbar dense dark color="primary mt-4">
          <v-toolbar-title>Login form</v-toolbar-title>
        </v-toolbar>
        <v-card class="px-4 py-4 elevation-12">
          <v-card-text>
            <v-form ref="loginForm" v-model="valid" lazy-validation>
              <v-text-field
                dense
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
                solo
                outlined
              ></v-text-field>
              <v-text-field
                dense
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                hint="At least 8 characters"
                counter
                @click:append="showPassword = !showPassword"
                solo
                outlined
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="pb-4 ">
            <v-btn
              :loading="loading"
              block
              width="240"
              :disabled="!valid"
              color="primary"
              @click="login"
              >Login</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar :color="snackbarColor" v-model="showSnackbar" top centered>
      <div class="text-center">{{ snackbarText }}</div>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  data: () => ({
    valid: true,
    email: "",
    password: "",
    showPassword: false,
    emailRules: [
      v => !!v || "Email is Required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    rules: {
      required: value => !!value || "Password is Required",
      min: v => (v && v.length >= 8) || "Min 8 characters"
    },
    loading: false,
    showSnackbar: false,
    snackbarColor: "error",
    snackbarText: "User Not Found"
  }),
  methods: {
    async login() {
      let self = this;
      if (this.$refs.loginForm.validate()) {
        self.loading = true;
        let userInfo = {
          email: this.email,
          password: this.password
        };

        await this.$store
          .dispatch("users/login", userInfo)
          .then(e => {
            if (e == "User Not Found") {
              self.showSnackbar = true;
            } else {
              self.$router.push("/dashboard")
              
            }
          })
          .catch(e => {
            self.showSnackbar = true;
          });
        self.loading = false;
      }
    }
  }
};
</script>
