<template>
  <div>
    <v-card height="140">
      <v-card-title>
        Punch In
        <v-spacer></v-spacer>
        <p v-if="sw == true && sb == true && fb == true && fw == true">
          You are done for the day
          <v-icon color="primary">mdi-emoticon-happy-outline</v-icon>
        </p>
      </v-card-title>
      <v-card-actions class="d-flex flex-wrap">
        <div>
          <v-btn
            :loading="loadingSw"
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
            :loading="loadingSb"
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
            :loading="loadingFb"
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
            :loading="loadingFw"
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
export default {
  async created() {
    let self = this;
    let payload = {
      date: moment().format("MM-DD-YYYY"),
      id: this.id
    };
    await this.$store
      .dispatch("users/checkSheet", payload)
      .then(e => {
        if (e !== "User Not Found") {
          if (e.start_working !== null) {
            self.sw = true;
          }
          if (e.start_break !== null) {
            self.sb = true;
          }
          if (e.end_break !== null) {
            self.fb = true;
          }
          if (e.end_working !== null) {
            self.fw = true;
          }
        }
      })
      .catch(e => {});
  },
  data() {
    return {
      snackbarColor: "success",
      showSnackbar: false,
      snackbarText: "Time is successfully recorded",
      sw: false,
      sb: false,
      fw: false,
      fb: false,
      id: Cookie.get("uid"),
      loadingSw: false,
      loadingSb: false,
      loadingFw: false,
      loadingFb: false
    };
  },
  methods: {
    errorThrow() {
      this.snackbarColor = "error";
      this.snackbarText = "Can not execute at this moment, please try again";
      this.showSnackbar = true;
    },
    async punchIn(type) {
      localStorage.setItem("date", moment().format("MM-DD-YYYY"));
      localStorage.setItem(type, moment().format("HH:mm"));
      let payload = {
        date: localStorage.getItem("date"),
        start_working: localStorage.getItem("sw"),
        start_break: localStorage.getItem("sb"),
        end_break: localStorage.getItem("fb"),
        end_working: localStorage.getItem("fw"),
        id: this.id,
        sheetId: localStorage.getItem("sheetId")
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
      await this.$store
        .dispatch("users/checkSheet", payload)
        .then(e => {
          if (e == "User Not Found") {
            self.$store
              .dispatch("users/createSheet", payload)
              .then(e => {
                localStorage.setItem("sheetId", e);
                self.showSnackbar = true;
              })
              .catch(e => {
                self.errorThrow();
              });
          } else {
            self.$store
              .dispatch("users/updateSheet", payload)
              .then(e => {
                self.showSnackbar = true;
              })
              .catch(e => {
                self.errorThrow();
              });
          }
        })
        .catch(e => {
          self.errorThrow();
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
