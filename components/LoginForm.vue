<template>
  <div>
    <v-row style="margin: 0px">
      <v-col
        cols="12"
        sm="4"
        md="4"
        lg="4"
        xl="4"
        offset-sm="4"
        offset-md="4"
        offset-lg="4"
        offset-xl="4"
      >
        <v-card class="mt-5 px-4 py-4 elevation-12">
          <v-card-text class="text-center">
            <v-img
              :src="require('@/assets/brand.png')"
              height="120"
              contain
              class="mb-5"
            ></v-img>
            <h1 class="mb-5">Log In</h1>
            <v-form ref="loginForm" v-model="valid" lazy-validation>
              <v-text-field
                dense
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
                solo
                outlined
                prepend-inner-icon="mdi-gmail"
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
                prepend-inner-icon="mdi-lock"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="pb-4">
            <v-row>
              <v-col cols="12">
                <v-btn
                  :loading="loading"
                  block
                  :disabled="!valid"
                  color="primary"
                  @click="login"
                  >Login</v-btn
                >
                <hr class="mt-3" />
                <p class="text-center pt-2">Or login as</p>
                <hr />
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  block
                  color="primary"
                  @click="defaultLogin('jon@gmail.com', '12345678')"
                  ><v-icon>mdi-account</v-icon> Admin</v-btn
                >
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  block
                  color="primary"
                  @click="defaultLogin('david@gmail.com', '12345678')"
                  ><v-icon>mdi-account-group</v-icon> User</v-btn
                >
              </v-col>
            </v-row>
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
      (v) => !!v || "Email is Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    rules: {
      required: (value) => !!value || "Password is Required",
      min: (v) => (v && v.length >= 8) || "Min 8 characters",
    },
    loading: false,
    showSnackbar: false,
    snackbarColor: "error",
    snackbarText: "User Not Found",
  }),
  methods: {
    async login() {
      let self = this;
      if (this.$refs.loginForm.validate()) {
        self.loading = true;
        let userInfo = {
          email: this.email,
          password: this.password,
        };
        await this.$store
          .dispatch("users/login", userInfo)
          .then((e) => {
            if (e == "User Not Found") {
              self.showSnackbar = true;
            } else {
              self.$router.push("/dashboard");
            }
          })
          .catch((e) => {
            self.showSnackbar = true;
          });
        self.loading = false;
      }
    },
    async defaultLogin(e, p) {
      this.email = e;
      this.password = p;
      this.login();
    },
  },
};
</script>
