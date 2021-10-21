<template>
  <div class="category-table px-4 py-4">
    <div class="text-right">
      <v-btn to="/admin/addProduct" color="primary"
        ><v-icon>mdi-plus</v-icon>Add New Product</v-btn
      >
    </div>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>

    <v-data-table
      class="elevation-5 mt-4"
      :items-per-page="5"
      :loading="loading"
      loading-text="Loading... Please wait"
      :search="search"
    >
      <template v-slot:header="{ props: { headers } }">
        <thead>
          <tr>
            <th :sorted="true">Category</th>
            <th>Taret Audience</th>
            <th>Name</th>
            <th style="text-align:center">Image</th>
            <!-- <th>Description</th> -->
            <th>Price</th>
            <!-- <th>Tags</th> -->
            <th>Availability</th>
            <th>Brand</th>
            <th>Colors</th>
            <th>Discount %</th>
            <th>Size</th>
            <th>SubCategory</th>
            <th>Action</th>
          </tr>
        </thead>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
          <tr v-for="(item, index) in List" :key="index">
            <td >{{ item.category }}</td>
            <td >{{ item.audience }}</td>
            <td>{{ item.name }}</td>
            <td>
              <v-img contain
                width="200"
                height="100"
                :src="item.image[0].url"
              ></v-img>
            </td>
            <!-- <td v-html="item.description"></td> -->
            <td>{{ item.price }}</td>
            <!-- <td>{{ item.chips }}</td> -->
            <td>{{ item.availability }}</td>
            <td>{{ item.brand }}</td>
            <td>{{ item.colors[0] }}</td>
            <td>{{ item.discountPercent }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.subCategory }}</td>            
            <td>
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
      headers: [
        {
          text: "Category",
          sortable: false,
          value: "category",
        },
        {
          text: "Name",
          sortable: false,
          value: "name",
        },
        {
          text: "Image",
          sortable: false,
        },
        {
          text: "Description",
          sortable: false,
          value: "description",
        },
        {
          text: "Price",
          sortable: true,
          value: "price",
        },
        {
          text: "Tags",
          sortable: true,
          value: "chips",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  computed: {
    List() {
      return this.$store.state.products.List;
    },
  },
  async fetch() {
    await this.$store.dispatch("products/getLists");
    this.loading = false;
  },
     activated() {
      // Call fetch again if last fetch more than 30 sec ago
      if (this.$fetchState.timestamp <= Date.now() - 30000) {
        this.$fetch()
      }
    },
  methods: {
    editItem(item) {
      this.$router.push({
        path: "/admin/addProduct",
        query: { id: item.id },
      });
    },
    async dialogConfirm() {
      let self = this;
      await this.$store
        .dispatch("products/deleteProduct", this.productId.id)
        .then((e) => {
          self.dialog = false;
          (self.snackbar = true),
            (self.snackbarColor = "success"),
            (self.snackbarText = "Product Deleted Successfully");
        })
        .catch((e) => {
          self.dialog = false;
          (self.snackbar = true),
            (self.snackbarColor = "error"),
            (self.snackbarText = e.code);
        });
    },
    async deleteItem(item) {
      this.dialog = true;
      this.productId = item;
    },
  },
};
</script>
<style scoped>
</style>