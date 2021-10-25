<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>
          <h3 class="ml-2 mb-2 mr-4">Time Sheet</h3>
          <v-text-field
            solo
            dense
            class="mb-2"
            v-model="search"
            append-icon="mdi-magnify"
            placeholder="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <div class="mt-4 mb-2">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  solo
                  dense
                  v-model="date"
                  label="Select Month"
                  prepend-icon="mdi-calendar"
                  color="primary"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                show-current
                type="month"
                :active-picker.sync="activePicker"
                :max="
                  new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .substr(0, 10)
                "
                min="2000-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>
          </div>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-5"
            item-key="id"
            :loading="loading"
            :search="search"
          >
            <!-- <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template> -->
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import Cookie from "js-cookie";
import moment from "moment";
export default {
  layout: "Dashboard",
  // route protection
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (Cookie.get("uid") == undefined) {
        vm.$router.push("/");
      }
    });
  },
  async mounted() {
    // Get all the record of logged in user only
    let self = this;
    let payload = {
      id: this.id
    };
    await this.$store
      .dispatch("users/checkSheetById", payload)
      .then(e => {
        if (e !== "User Not Found") {
          e.forEach(el => {
            self.items.push({
              // process the data
              date: moment(String(el.date), "MM-DD-YYYY").format(
                "D- dddd, MMMM"
              ),
              work_category:
                moment(String(el.date), "MM-DD-YYYY")
                  .format("D- dddd")
                  .includes("Saturday") ||
                moment(String(el.date), "MM-DD-YYYY")
                  .format("D- dddd")
                  .includes("Sunday")
                  ? "Off Day"
                  : "Working Day",
              start_working: el.start_working,
              end_working: el.end_working,
              start_break: el.start_break,
              end_break: el.end_break,
              total_work: self.totalWork(el.start_working, el.end_working),
              total_break: self.totalBreak(el.start_break, el.end_break)
            });
          });
          // taking a clone of items
          self.cloneItems = self.items;
        }
        self.loading = false;
      })
      .catch(e => {});
    self.loading = false;
  },
  data() {
    return {
      pagination: "",
      headers: [
        {
          text: "Date",
          value: "date",
          align: "start"
        },
        {
          text: "Work Category",
          value: "work_category"
        },
        {
          text: "Start Working",
          value: "start_working"
        },
        {
          text: "End Working",
          value: "end_working"
        },
        {
          text: "Start Break",
          value: "start_break"
        },
        {
          text: "End Break",
          value: "end_break"
        },
        {
          text: "Total Work",
          value: "total_work"
        },
        {
          text: "Total Break",
          value: "total_break"
        }
      ],
      items: [],
      cloneItems: [],
      loading: true,
      search: "",
      searchYear: "",
      searchMonth: "",
      activePicker: null,
      date: moment().format("YYYY-MM-DD"),
      menu: false,
      id: Cookie.get("uid")
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    }
  },
  methods: {
    editItem(item) {
      console.log(item);
    },
    deleteItem(item) {
      console.log(item);
    },
    save(date) {
      this.$refs.menu.save(date);
      // search by month
      let searchDate = moment(String(date), "YYYY-MM").format("MMMM");
      this.items = this.cloneItems.filter(x => x.date.includes(searchDate));
    },
    // processing the total work hours
    totalWork(start, end) {
      if (start !== null && end !== null) {
        var startTime = moment(String(start), "HH:mm");
        var endTime = moment(String(end), "HH:mm");
        var duration = moment.duration(endTime.diff(startTime));
        var hours = parseInt(duration.asHours());
        var minutes = parseInt(duration.asMinutes()) % 60;
        return hours + ":" + minutes;
      } else {
        return 0;
      }
    },
    // processing the total break hours
    totalBreak(start, end) {
      if (start !== null && end !== null) {
        var startTime = moment(String(start), "HH:mm");
        var endTime = moment(String(end), "HH:mm");
        var duration = moment.duration(endTime.diff(startTime));
        var hours = parseInt(duration.asHours());
        var minutes = parseInt(duration.asMinutes()) % 60;
        return hours + ":" + minutes;
      } else {
        return 0;
      }
    }
  }
};
</script>
