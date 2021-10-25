<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>
          <h3 class="ml-2 mb-2 mr-4">Report</h3>
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
          <div class="mt-4 mb-2 ml-3">
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
          <v-spacer></v-spacer>
          <div class="text-right mb-2">
            <v-btn
              color="primary"
              :disabled="cloneItems.length == 0"
              @click="generateReport"
            >
              Generate CSV
            </v-btn>
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
import XLSX from "xlsx";
import { saveAs } from "file-saver";
export default {
  layout: "Dashboard",
  // route protecting
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (Cookie.get("uid") == undefined) {
        vm.$router.push("/");
      }
    });
  },
  async mounted() {
    // get all records of all user
    let self = this;
    let payload = {
      id: this.id
    };
    await this.$store
      .dispatch("users/getAllSheet", payload)
      .then(e => {
        if (e !== "User Not Found") {
          // process the data
          e.forEach(el => {
            self.items.push({
              name: el.name,
              date: moment(String(el.date), "MM-DD-YYYY").format(
                "D- dddd, MMMM YYYY"
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
          self.cloneItems = self.items;
        }
        self.loading = false;
      })
      .catch(e => {});
    self.loading = false;
  },
  data() {
    return {
      headers: [
        { text: "Employee Name", value: "name" },
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
    // generate csv
    generateReport() {
      let self = this;
      // csv labels
      let lables = [
        [
          "Date",
          "Name",
          "Total Work",
          "Total Break",
          "Start Work",
          "End Work",
          "Start Break",
          "End Break"
        ]
      ];
      // process the csv's data
      this.cloneItems.forEach(el => {
        let Date = "";
        let Name = "";
        let total_work = "";
        let total_break = "";
        let start_working = "";
        let end_working = "";
        let start_break = "";
        let end_break = "";
        Date = el.date;
        Name = el.name;
        total_work = el.total_work;
        total_break = el.total_break;
        start_working = el.start_working;
        end_working = el.end_working;
        start_break = el.start_break;
        end_break = el.end_break;
        let data = [
          Date,
          Name,
          total_work,
          total_break,
          start_working,
          end_working,
          start_break,
          end_break
        ];
        lables.push(data);
      });
      // creating csv instance
      var wb = XLSX.utils.book_new();
      wb.Props = {
        Title: "Consumer Summary Report",
        Subject: "Information of consumer",
        Author: "Tanzil"
      };
      // creating Sheet
      wb.SheetNames.push("Attendance Sheet");
      var ws_data = lables;

      // assigning data to sheet
      var ws = XLSX.utils.aoa_to_sheet(ws_data);
      wb.Sheets["Attendance Sheet"] = ws;
      var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      // download the csv
      saveAs(
        new Blob([self.binaryToOctetStream(wbout)], {
          type: "application/octet-stream"
        }),
        `Attendance Sheet.xlsx`
      );
    },
    editItem(item) {
      console.log(item);
    },
    deleteItem(item) {
      console.log(item);
    },
    // binary digig to octet
    binaryToOctetStream(s) {
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf); //create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
      return buf;
    },
    save(date) {
      this.$refs.menu.save(date);
      let searchDate = moment(String(date), "YYYY-MM").format("MMMM");
      this.items = this.cloneItems.filter(x => x.date.includes(searchDate));
      console.log(this.items);
    },
    // process total work
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
    // process Total break
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

<style></style>
