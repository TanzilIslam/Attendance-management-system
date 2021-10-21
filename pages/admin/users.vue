<template>
  <div class="category-table px-4 py-4">
    <v-row>
      <v-col cols="12" sm="12" md="4" lg="4" xl="4" offset="8">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <v-data-table
      class="elevation-5 mt-4"
      :items-per-page="5"
      :search.sync="search"
    >
      <template v-slot:header="{ props: { headers } }">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Purches</th>
          </tr>
        </thead>
      </template>
      <template slot="body">
        <tbody>
          <tr v-for="(item, index) in List" :key="index">
            <td>{{ item.name }}</td>
            <td>
              <v-img
                contain
                width="200"
                height="100"
                :src="item.image[0].url"
              ></v-img>
            </td>
            <td>{{ item.email }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.address }}</td>
            <td>
              <v-switch
                v-model="item.status"
                :label="item.status == true? 'Active' : 'Deactive'"
              ></v-switch>
            </td>
            <td>
              <v-icon  class="mr-2" @click="viewPurches(item)">
               mdi-eye
              </v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>

    <v-dialog
      transition="dialog-bottom-transition"
      max-width="400"
      persistent
      v-model="dialog"
    >
      <v-card>
        <v-card-text>
          <div class="text-h5 pt-4 text-center">
            Are you sure to delete this?
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog = false">Close</v-btn>
          <v-btn color="error" text @click="dialogConfirm">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar top right v-model="snackbar" :color="snackbarColor">
      <div class="text-center">{{ snackbarText }}</div>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      snackbar: false,
      snackbarColor: "success",
      snackbarText: "",
      search: "",
      productId: "",
      confirmDelete: false,
      loading: true,
      dialog: false,
    };
  },
  computed: {
    List() {
      return this.$store.state.users.userList;
    }
  },
  async fetch() {
    await this.$store.dispatch("users/getUserLists");
    this.loading = false;
  },
  activated() {
    // Call fetch again if last fetch more than 30 sec ago
    if (this.$fetchState.timestamp <= Date.now() - 30000) {
      this.$fetch();
    }
  },
  methods: {
    viewPurches(item){
      console.log(item);
    },
    editItem(item) {
      this.$router.push({
        path: "/admin/addProduct",
        query: { id: item.id }
      });
    },
    async dialogConfirm() {
      let self = this;
      await this.$store
        .dispatch("products/deleteProduct", this.productId.id)
        .then(e => {
          self.dialog = false;
          (self.snackbar = true),
            (self.snackbarColor = "success"),
            (self.snackbarText = "Product Deleted Successfully");
        })
        .catch(e => {
          self.dialog = false;
          (self.snackbar = true),
            (self.snackbarColor = "error"),
            (self.snackbarText = e.code);
        });
    },
    async deleteItem(item) {
      this.dialog = true;
      this.productId = item;
    }
  }
};
</script>
<style scoped></style>
