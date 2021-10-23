<template>
  <div>
    <v-card height="140">
      <v-card-title>
        Punch In
      </v-card-title>
      <v-card-actions class="d-flex flex-wrap">
        <div>
          <v-btn
            :disabled="sw"
            @click="punchIn('sw')"
            class="elevation-5 mb-2 mr-2"
          >
            <v-icon class="mr-2 ">mdi-clock</v-icon>
            Start Working
          </v-btn>
        </div>
        <div>
          <v-btn
            :disabled="sb"
            @click="punchIn('sb')"
            class="elevation-5 mb-2 mr-2"
          >
            <v-icon class="mr-2 ">mdi-coffee</v-icon>
            Start Break
          </v-btn>
        </div>

        <div>
          <v-btn
            :disabled="fb"
            @click="punchIn('fb')"
            class="elevation-5 mb-2 mr-1"
          >
            <v-icon class="mr-2 ">mdi-laptop</v-icon>
            Finish Break
          </v-btn>
        </div>
        <div>
          <v-btn
            :disabled="fw"
            @click="punchIn('fw')"
            class="elevation-5 mb-2 mr-1"
          >
            <v-icon class="mr-2">mdi-walk</v-icon>
            Finish Work
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
    <v-snackbar :color="snackbarColor" v-model="showSnackbar" top centered>
      <div class="text-center">{{ snackbarText }}</div>
    </v-snackbar>
  </div>
</template>

<script>
import moment from "moment";
import Cookie from "js-cookie";
import cookieparser from "cookieparser";
export default {
  data() {
    return {
      snackbarColor: "success",
      showSnackbar: false,
      snackbarText: "Work start time is successfully recorded",
      sw: false,
      sb: false,
      fw: false,
      fb: false,
      id: Cookie.get("uid")
    };
  },
  methods: {
    punchIn(type) {
      localStorage.setItem("date", moment().format("MM-DD-YYYY"));
      localStorage.setItem(type, moment().format("HH:mm"));
      console.log(this.id);
      let payload = {
        date: localStorage.getItem("date"),
        start_working: localStorage.getItem("sw"),
        start_break: localStorage.getItem("sb"),
        end_break: localStorage.getItem("fb"),
        end_working: localStorage.getItem("fw"),
        id: this.id
      };

      if (type == "sw") {
        this.sw = true;
      }
      if (type == "sb") {
        this.sb = true;
      }
      if (type == "fb") {
        this.fb = true;
      }
      if (type == "fw") {
        this.fw = true;
      }
      let self = this;
      this.$store.dispatch("users/updateSheet", payload).then(() => {
        self.showSnackbar = true;
      });
    }
  },
  computed: {
    // disabledSW() {
    //   return localStorage.getItem("sw") !== null;
    // }
  }
};
</script>

<style></style>
