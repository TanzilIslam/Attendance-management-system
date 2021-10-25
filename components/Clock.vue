<template>
  <v-card>
    <v-toolbar color="primary" dark dense>
      Current Time
    </v-toolbar>
    <v-card-title color="primary"> </v-card-title>
    <v-card-text>
      <h3>
        <v-icon color="primary">mdi-calendar</v-icon> Date : {{ currentDate }}
      </h3>
      <p><v-icon color="primary">mdi-clock</v-icon> Time : {{ currentTime }}</p>
    </v-card-text>
  </v-card>
</template>
<script>
import moment from "moment";
export default {
  mounted() {
    let self = this;
    setInterval(function() {
      self.currentTime = moment().format("HH : mm : ss");
    }, self.timeout);
  },
  destroyed() {
    self.timeout = 0;
  },
  data() {
    return {
      timeout: 1000,
      currentDate: moment().format("MM-DD-YYYY"),
      currentTime: moment().format("hh : mm : ss")
    };
  }
};
</script>
