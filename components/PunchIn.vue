<template>
  <div>
    <div class="text-center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <v-card v-else class="elevation-10" rounded>
      <v-card-title style="align-items: baseline;">
        Punch In
        <v-spacer></v-spacer>
        <p v-if="sw == true && sb == true && fb == true && fw == true">
          You are done for the day
          <v-icon color="primary">mdi-emoticon-happy-outline</v-icon>
        </p>
      </v-card-title>
      <v-card-actions>
        <v-container>
          <v-row class="pb-4">
            <v-col cols="12" sm="6" md="3" lg="3" xl="3">
              <v-btn
                :disabled="sw"
                @click="punchIn('sw')"
                class="elevation-5 mb-2 mr-2"
              >
                <v-icon color="primary" class="mr-2 ">mdi-clock</v-icon>
                Start Working
              </v-btn></v-col
            >
            <v-col cols="12" sm="6" md="3" lg="3" xl="3">
              <v-btn
                :disabled="sb"
                @click="punchIn('sb')"
                class="elevation-5 mb-2 mr-2"
              >
                <v-icon class="mr-2 " color="primary">mdi-coffee</v-icon>
                Start Break
              </v-btn></v-col
            >
            <v-col cols="12" sm="6" md="3" lg="3" xl="3">
              <v-btn
                :disabled="fb"
                @click="punchIn('fb')"
                class="elevation-5 mb-2 mr-1"
              >
                <v-icon class="mr-2 " color="primary">mdi-laptop</v-icon>
                Finish Break
              </v-btn></v-col
            >
            <v-col cols="12" sm="6" md="3" lg="3" xl="3">
              <v-btn
                :disabled="fw"
                @click="punchIn('fw')"
                class="elevation-5 mb-2 mr-1"
              >
                <v-icon class="mr-2" color="primary">mdi-walk</v-icon>
                Finish Work
              </v-btn></v-col
            >
          </v-row>
        </v-container>
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
    // check the status for the day
    let self = this;
    let payload = {
      date: moment().format("MM-DD-YYYY"),
      id: this.id
    };
    await this.$store
      .dispatch("users/checkSheet", payload)
      .then(e => {
        if (e !== "User Not Found") {
          // if any punch in is already done then diseable that punch
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
      .catch(e => {
        console.log(e);
      });

    // clear revious day data if user did not logout
    if (process.client) {
      let date = localStorage.getItem("date");
      if (date !== null) {
        let currentDate = moment().format("MM-DD-YYYY");
        let previousDay = moment(String(date), "MM-DD-YYYY").format(
          "MM-DD-YYYY"
        );
        if (currentDate !== previousDay) {
          localStorage.clear();
        }
      }
    }

    self.loading = false;
  },
  data() {
    return {
      snackbarColor: "success",
      showSnackbar: false,
      snackbarText: "Time is successfully recorded",
      loading: true,
      // punch in button diseable variable
      sw: false,
      sb: false,
      fw: false,
      fb: false,
      id: Cookie.get("uid"),
      name: Cookie.get("name")
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
        sheetId: localStorage.getItem("sheetId"),
        name: this.name
      };
      let self = this;
      // check if this record is already exist
      await this.$store
        .dispatch("users/checkSheet", payload)
        .then(e => {
          if (e == "User Not Found") {
            // creating a new one
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
            // updating the exist
            self.$store
              .dispatch("users/updateSheet", payload)
              .then(e => {
                self.showSnackbar = true;
              })
              .catch(e => {
                self.errorThrow();
              });
          }
          // diseable punch that hit the api
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
        })
        .catch(e => {
          self.errorThrow();
        });
    }
  }
};
</script>
