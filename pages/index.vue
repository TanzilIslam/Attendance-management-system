<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12" md="3" lg="3" xl="3">
        <Clock class="mb-2" />
      </v-col>
      <v-col cols="12" sm="12" md="9" lg="9" xl="9">
        <punch-in />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Clock from "~/components/Clock.vue";
import PunchIn from "~/components/PunchIn.vue";
export default {
  layout: "Dashboard",
  components: {
    Clock,
    PunchIn
  }
};
</script>
<style></style>
