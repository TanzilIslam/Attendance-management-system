<template>
  <div>
    <login-form />
    <div class="d-flex mt-4">
      <v-card class="mx-auto" shaped color="#26c6da" dark max-width="290">
        <v-card-title>
          <v-icon large left>
            mdi-google
          </v-icon>
          <span class="text-h6 font-weight-light">Admin</span>
        </v-card-title>

        <v-card-text class="text-h5 font-weight-bold">
          Email: jon@gmail.com <br />Password: 12345678
        </v-card-text>
      </v-card>
      <v-card class="mx-auto" shaped color="#26c6da" dark max-width="290">
        <v-card-title>
          <v-icon large left>
            mdi-twitter
          </v-icon>
          <span class="text-h6 font-weight-light">USER</span>
        </v-card-title>

        <v-card-text class="text-h5 font-weight-bold">
          Email: david@gmail.com <br />Password: 12345678
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import LoginForm from "~/components/LoginForm.vue";
export default {
  components: { LoginForm }
};
</script>

<style></style>
