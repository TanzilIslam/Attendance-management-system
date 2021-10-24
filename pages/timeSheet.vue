<template>
  <div>
    <div class="d-flex">
      <div>
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
              v-model="date"
              label="Select Month"
              prepend-icon="mdi-calendar"
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
    </div>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-5"
      item-key="id"
      :loading="loading"
      :search="search"
    >
    </v-data-table>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import moment from "moment";
export default {
  layout: "Dashboard",
  async mounted() {
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
              date: moment(String(el.date), "MM-DD-YYYY").format("D- dddd"),
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
        }
        self.loading = false;
      })
      .catch(e => {});
    self.loading = false;

    // let self = this;
    // var schedule = this.getDaysArrayByMonth();
    // schedule.reverse().forEach(function(item) {
    //   let date = item.format("D - dddd");
    //   self.items.push({
    //     date: date,
    //     work_category:
    //       date.includes("Saturday") || date.includes("Sunday")
    //         ? "Off Day"
    //         : "Working Day",
    //     start_working: "",
    //     end_working: "",
    //     start_break: "",
    //     end_break: "",
    //     total_work: "",
    //     total_break: ""
    //   });
    // });
  },
  data() {
    return {
      pagination: "",
      headers: [
        { text: "Actions", value: "actions", sortable: false },
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
    save(date) {
      this.$refs.menu.save(date);
    },
    getDaysArrayByMonth() {
      var daysInMonth = moment().daysInMonth();
      var arrDays = [];
      while (daysInMonth) {
        var current = moment().date(daysInMonth);
        arrDays.push(current);
        daysInMonth--;
      }

      return arrDays;
    },
    totalWork(start, end) {
      var startTime = moment(String(start), "HH:mm");
      var endTime = moment(String(end), "HH:mm");
      var duration = moment.duration(endTime.diff(startTime));
      var hours = parseInt(duration.asHours());
      var minutes = parseInt(duration.asMinutes()) % 60;
      return hours + ":" + minutes;
    },
    totalBreak(start, end) {
      var startTime = moment(String(start), "HH:mm");
      var endTime = moment(String(end), "HH:mm");
      var duration = moment.duration(endTime.diff(startTime));
      var hours = parseInt(duration.asHours());
      var minutes = parseInt(duration.asMinutes()) % 60;
      return hours + ":" + minutes;
    }
  },
  computed: {}
};
</script>

<style></style>
