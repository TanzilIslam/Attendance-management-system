<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12" md="3" lg="3" xl="3">
        <Clock class="mb-2" />
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12" xl="12">
     
           <punch-in />

      </v-col>
    </v-row>
  </div>
</template>

<script>
import Clock from "~/components/Clock.vue";
import PunchIn from "~/components/PunchIn.vue";
import Cookie from "js-cookie";
export default {
  layout: "Dashboard",
  components: {
    Clock,
    PunchIn
  },
  beforeRouteEnter (to, from, next) {
  next(vm => {
    if (Cookie.get("uid") == undefined) {
      vm.$router.push("/login");
    }
  })
}
};
</script>
<style></style>
