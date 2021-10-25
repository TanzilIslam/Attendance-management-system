<template>
  <div>
    <v-card class="elevation-10">
      <v-card-title>
        <h3 class="ml-2 my-4 mr-4">User List</h3>
        <v-text-field
          solo
          class="mb-1"
          v-model="search"
          append-icon="mdi-magnify"
          placeholder="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="addNewUser" class="mb-2">
          + Add New User
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="userList"
          class="elevation-10"
          :loading="loading"
          :search="search"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            No Users Found
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-row justify="center">
      <v-dialog v-model="dialog" fullscreen persistent>
        <v-card :loading="formLoading">
          <v-card-title class="ml-4">
            <span class="text-h5 ml-5">{{ modeTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-row>
                  <v-col cols="12">
                    <v-toolbar dense color="primary" dark>
                      Employee Information
                    </v-toolbar>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                    <v-text-field
                      v-model.trim="name"
                      prepend-icon="mdi-account-circle"
                      solo
                      dense
                      placeholder="Employee Name"
                      :rules="[v => !!v || 'Name is required']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          :rules="[v => !!v || 'Entry Date is required']"
                          required
                          solo
                          dense
                          v-model="dateFormatted"
                          placeholder="Entry Date"
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          @blur="date = parseDate(dateFormatted)"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date"
                        no-title
                        @input="menu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col v-if="mode === 'update'" cols="12">
                    <v-menu
                      ref="menu2"
                      v-model="menu2"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          solo
                          dense
                          v-model="dateFormatted2"
                          placeholder="Leaving Date"
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          @blur="date2 = parseDate(dateFormatted2)"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date2"
                        no-title
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                    <v-text-field
                      v-model.trim="address"
                      dense
                      solo
                      prepend-icon="mdi-home"
                      placeholder="Address"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                    <v-text-field
                      placeholder="Phone Number"
                      v-model.trim="phone"
                      dense
                      solo
                      prepend-icon="mdi-phone"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                    <v-select
                      v-model="status"
                      solo
                      dense
                      :rules="[v => !!v || 'Status  is required']"
                      prepend-icon="mdi-shield-account"
                      :items="['active', 'inactive']"
                      placeholder="Status"
                      required
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-toolbar dense color="primary" class="mt-4" dark>
                      Login Information
                    </v-toolbar>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                    <v-text-field
                      dense
                      v-model.trim="email"
                      prepend-icon="mdi-gmail"
                      placeholder="Email Address"
                      solo
                      :rules="[
                        v => !!v || 'Email is required',
                        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
                      ]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                    <v-text-field
                      v-model.trim="password"
                      dense
                      solo
                      prepend-icon="mdi-lock"
                      placeholder="Password"
                      type="password"
                      :rules="[passwordRules.required, passwordRules.min]"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-toolbar dense color="primary" class="mt-4" dark>
                      Role Permission
                    </v-toolbar>
                  </v-col>
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                    <v-select
                      v-model="role"
                      solo
                      dense
                      :rules="[v => !!v || 'Role  is required']"
                      prepend-icon="mdi-shield-account"
                      :items="['admin', 'user']"
                      placeholder="Role"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn centered color="error" width="155" dense @click="cancle">
              Cancle
            </v-btn>
            <v-btn
              width="155"
              color="primary"
              dense
              :loading="buttonLoading"
              @click="addUser"
            >
              {{ modeButton }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          Confirm
        </v-card-title>
        <v-card-text> Are you sure to remove {{ name }} ? </v-card-text>
        <v-card-actions>
          <v-btn color="error" dense @click="deleteDialog = false">
            No
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            :loading="deleteButtonLoading"
            @click="deleteUser"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar :color="snackbarColor" v-model="showSnackbar" top centered>
      <div class="text-center">{{ snackbarText }}</div>
    </v-snackbar>
  </div>
</template>
<script>
import Cookie from "js-cookie";
export default {
  layout: "Dashboard",
    beforeRouteEnter (to, from, next) {
  next(vm => {
    if (Cookie.get("uid") == undefined) {
      vm.$router.push("/login");
    }
  })
},
  data: () => ({
    deleteDialog: false,
    mode: "add",
    modeButton: "+ Add User",
    snackbarColor: "success",
    showSnackbar: false,
    snackbarText: "User created successfully",
    valid: true,
    menu: "",
    menu2: "",
    buttonLoading: false,
    modeTitle: "Add User",
    formLoading: false,
    search: "",
    userList: [],
    loading: true,
    dialog: false,
    dialogDelete: false,
    deleteButtonLoading: false,
    passwordRules: {
      required: value => !!value || "Password is required",
      min: v => (v && v.length >= 8) || "Min 8 characters"
    },
    headers: [
      {
        text: "Name",
        align: "start",
        value: "name"
      },
      { text: "Email", value: "email" },
      { text: "Address", value: "address" },
      { text: "Phone Number", value: "phone" },
      { text: "Role", value: "role" },
      { text: "Status", value: "status" },
      { text: "Actions", value: "actions", sortable: false }
    ],

    // form field
    name: "",
    date: "",
    date2: "",
    dateFormatted: "",
    dateFormatted2: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    role: "",
    status: "",
    add: "users/addUser",
    update: "users/updateUser",
    userid: ""
  }),
  computed: {},

  async created() {
    let self = this;
    await self.getUserList();
    this.loading = false;
  },

  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}-${day}-${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    async addUser() {
      if (this.$refs.form.validate()) {
        let self = this;
        self.buttonLoading = true;
        let user = {
          name: this.name,
          entryDate: this.dateFormatted,
          email: this.email,
          password: this.password,
          address: this.address,
          phone: this.phone,
          role: this.role,
          status: this.status,
          leavingDate: this.dateFormatted2
        };
        if (self.mode == "update") {
          user.id = this.userid;
        }

        await this.$store
          .dispatch(self.mode === "update" ? self.update : self.add, user)
          .then(e => {
            user.id = e;
            if (self.mode === "update") {
              self.getUserList();
            } else {
              self.userList.push(user);
            }
            self.buttonLoading = false;
            self.$refs.form.reset();
            self.dialog = false;
            setTimeout(function() {
              self.showSnackbar = true;
            }, 1000);
          })
          .catch(e => {
            self.snackbarText =
              "Can not excute at this moment, please try again";
            self.snackbarColor = "error";
            self.snackbar = true;
            self.buttonLoading = false;
          });
      }
    },
    cancle() {
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
      this.dialog = false;
    },
    async getUserList() {
      let self = this;
      await this.$store.dispatch("users/getUserLists").then(e => {
        self.userList = e;
      });
    },
    editItem(item) {
      this.mode = "update";
      this.modeTitle = "Update User";
      this.modeButton = "Update User";
      this.snackbarText = "User updated successfully";
      this.userid = item.id;
      this.name = item.name;
      this.dateFormatted = item.entryDate;
      this.dateFormatted2 = item.leavingDate;
      this.email = item.email;
      this.password = item.password;
      this.address = item.address;
      this.phone = item.phone;
      this.role = item.role;
      this.status = item.status;
      this.dialog = true;
    },

    deleteItem(item) {
      this.userid = item.id;
      this.deleteDialog = true;
      this.name = item.name;
    },

    async deleteUser() {
      let self = this;
      this.deleteButtonLoading = true;
      await this.$store
        .dispatch("users/deleteUser", this.userid)
        .then(e => {
          self.getUserList();
          self.deleteButtonLoading = false;
          self.deleteDialog = false;
          self.snackbarText = "User Deleted Successfully";
          setTimeout(function() {
            self.showSnackbar = true;
          }, 1000);
        })
        .catch(error => {
          self.deleteButtonLoading = false;
          self.deleteDialog = false;
          self.snackbarText = "Can not excute at this moment, please try again";
          self.snackbarColor = "error";
          self.snackbar = true;
        });
      self.$refs.form.resetValidation();
      self.$refs.form.reset();
    },

    addNewUser() {
      this.dialog = true;
    }
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
    date2(val) {
      this.dateFormatted2 = this.formatDate(this.date2);
    }
  }
};
</script>
