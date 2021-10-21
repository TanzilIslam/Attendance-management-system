<template>
  <div>
    <v-container>
      <v-card class="elevation-5">
        <v-card-text class="pl-10 pr-10 pt-10">
                <h3 v-if="!this.$route.query.id">Add New Product</h3>
      <h3 v-else>Update Product</h3>
      <v-form ref="SurgeryForm" v-model="validForm" lazy-validation>
        <v-row>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-autocomplete
              v-model="category"
              :items="categoryItems"
              prepend-icon="mdi-format-line-spacing"
              label="Category"
              required
              :rules="[v => !!v || 'Category is required']"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-autocomplete
              v-model="audience"
              :items="audienceList"
              prepend-icon="mdi-human-male-female"
              label="Product For"
              required
              :rules="[v => !!v || 'Target Audience is required']"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-autocomplete
              v-model="subCategory"
              :items="subCategoryItems"
              prepend-icon="mdi-menu"
              label="SubCategory"
              required
              :rules="[v => !!v || 'SubCategory is required']"
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-autocomplete
              v-model="brand"
              :items="brandList"
              prepend-icon="mdi-hexagon"
              label="Brand"
              required
              clearable
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-text-field
              prepend-icon="mdi-format-font"
              v-model="name"
              :rules="[v => !!v || 'Name is required']"
              label="Product Name"
              required
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-text-field
              type="number"
              prepend-icon="mdi-cube-outline"
              v-model="availability"
              label="Availability"
              :rules="[v => !!v || 'Availability is required']"
              required
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6"
            ><v-autocomplete
              v-model="size"
              :items="sizeItems"
              prepend-icon="mdi-focus-field"
              label="Size"
              required
              :rules="[v => !!v || 'size is required']"
              clearable
            ></v-autocomplete>
            <!--  -->
            <!-- <div v-show="false">
              <div v-if="size.length > 1">
                <v-row>
                  <v-col
                    v-for="(i, index) in size"
                    :key="index"
                    cols="12"
                    sm="12"
                    md="6"
                    lg="6"
                    xl="6"
                  >
                    <v-text-field
                      v-model="i.quantity"
                      :rules="[(v) => !!v || 'Quantity is required']"
                      :label="i.size"
                      required
                      type="number"
                      clearable
                      prepend-icon="mdi-cube-outline"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </div> -->
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-combobox
              prepend-icon="mdi-invert-colors"
              multiple
              v-model="colors"
              label="Product Colors (write and press enter)"
              chips
              deletable-chips
              class="tag-input"
            >
            </v-combobox>
            <v-checkbox
              v-model="colorPickerEnable"
              label="Enable Color Picker"
            ></v-checkbox>

            <v-color-picker
              v-if="colorPickerEnable"
              dot-size="25"
              mode="hexa"
              swatches-max-height="200"
              hide-mode-switch
            ></v-color-picker>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-text-field
              v-model="price"
              :rules="[v => !!v || 'Price is required']"
              label="Price"
              required
              type="number"
              clearable
              prepend-icon="mdi-cash-usd"
            ></v-text-field
          ></v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-text-field
              type="number"
              prepend-icon="mdi-percent"
              v-model="discountPercent"
              label="Discount(In Percent)"
              required
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-file-input
              :error-messages="fileError"
              accept="image/*"
              label="Product Image"
              ref="fileInput"
              @change="fileUpMethod($event)"
              prepend-icon="mdi-camera"
              multiple
              show-size
              counter
              v-model="imageUp"
              @input="removeError"
            ></v-file-input>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <v-row>
              <template v-if="imageUploading">
                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                  <div class="text-center">
                    <v-progress-circular
                      :size="50"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </v-col>
              </template>
              <template v-if="imageUploaded">
                <v-col
                  cols="12"
                  sm="12"
                  md="6"
                  lg="6"
                  xl="6"
                  v-for="(n, index) in image"
                  :key="index"
                >
                  <v-hover v-slot:default="{ hover }">
                    <v-card height="150" color="grey lighten-4">
                      <v-img :src="n.url" contain height="150">
                        <v-expand-transition>
                          <v-container v-if="hover" fill-height>
                            <v-row justify="center" align="center">
                              <v-col cols="12">
                                <v-btn
                                  v-if="hover"
                                  @click="openDialog(n)"
                                  class=""
                                  >Preview</v-btn
                                >
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-expand-transition>
                      </v-img>
                    </v-card>
                  </v-hover>
                </v-col>
              </template>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-combobox
              v-model="chips"
              :items="items"
              chips
              clearable
              label="Product Tags (select or write and press enter) "
              multiple
              prepend-icon="mdi-book-plus-multiple-outline"
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  @click="select"
                  @click:close="remove(item)"
                  ><span>{{ item }}</span>
                </v-chip>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="12">
            <div class="mt-4 mb-4">
              <vue-editor v-model="description"></vue-editor>
              <p
                class="ml-5 mt-1"
                style="color: red; font-size: 12px"
                v-if="noDescription"
              >
                Description is Required
              </p>
            </div>
          </v-col>
          <v-col cols="12">
            <v-btn
              v-if="!this.$route.query.id"
              :disabled="!validForm"
              color="primary"
              class=""
              @click="addSurgery"
              :loading="loadingButton"
              ><v-icon>mdi-plus</v-icon> Add Product
            </v-btn>
            <v-btn
              v-else
              :disabled="!validForm"
              color="primary"
              class=""
              @click="addSurgery"
              :loading="loadingButton"
              ><v-icon class="mr-2">mdi-pen</v-icon> Update Surgery Category
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
        </v-card-text>
      </v-card>
    </v-container>
    <v-snackbar top right v-model="snackbar" :color="snackbarColor">
      <div class="text-center">{{ snackbarText }}</div>
    </v-snackbar>
    <v-dialog v-model="dialog">
      <v-card>
        <v-container class="p-4">
          <v-img :src="dialogImg.url"></v-img>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="deleteFile"> Delete </v-btn>

          <v-btn color="green darken-1" text @click="dialog = false">
            Keep
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import { VueEditor } from "vue2-editor";
export default {
  // components: {
  //   VueEditor
  // },
  async fetch() {
    if (this.$route.query.id) {
      var self = this;
      await this.$store
        .dispatch("products/getUpdateProduct", this.$route.query.id)
        .then(re => {
          (self.category = re.category),
            (self.name = re.name),
            (self.image = JSON.parse(re.image)),
            (self.imageUploaded = true),
            (self.price = re.price),
            (self.description = re.description);
          self.chips = re.chips;
          (self.availability = re.availability),
            (self.brand = re.brand),
            (self.colors = re.colors),
            (self.discountPercent = re.discountPercent),
            (self.size = re.size),
            (self.subCategory = re.subCategory);
          self.audience = re.audience;
          self.rating = re.rating
          
        });
    }
  },
  data() {
    return {
      // list start
      categoryItems: ["Cloth"],
      audienceList: ["Male", "Female", "Kids", "All"],
      brandList: ["Easy", "Gucci"],
      subCategoryItems: ["Ti-Shirt", "Shirt", "Jeans"],
      sizeItems: ["XS", "S", "M", "L", "XL"],
      // list end
      // store variables start
      category: null,
      audience: null,
      subCategory: null,
      name: null,
      size: null,
      discountPercent: null,
      availability: null,
      colors: [],
      image: [],
      price: null,
      brand: null,
      description: null,
      // store variables end
      imageUploaded: false,
      imageUploading: false,
      colorPickerEnable: false,
      fileError: "",
      imageUp: [],
      dialogImg: "",
      dialog: false,
      noDescription: false,
      loadingButton: false,
      validForm: true,
      nameRules: [v => !!v || "Name is required"],
      categoryRules: [v => !!v || "Category is required"],
      subCategoryRules: [v => !!v || "SubCategory is required"],
      numberRules: [v => !!v || "Surgery Number is required"],
      surgery: {},
      snackbar: false,
      snackbarText: null,
      snackbarColor: null,
      chips: [],
      rating:null,
      items: ["tag1", "tag2", "tag3", "tag4"]
    };
  },
  methods: {
    removeError() {
      this.fileError = "";
    },
    async addSurgery() {
      let self = this;
      if (this.$refs.SurgeryForm.validate()) {
        if (self.description !== null && self.image.length !== 0) {
          self.loadingButton = true;
          if (this.$route.query.id) {
            let updateProduct = {
              id: this.$route.query.id,
              category: this.category,
              audience: this.audience,
              subCategory: this.subCategory,
              name: this.name,
              size: this.size,
              discountPercent: this.discountPercent,
              availability: this.availability,
              image: this.image,
              price: this.price,
              description: this.description,
              chips: this.chips,
              colors: this.colors,
              brand: this.brand,
              rating:this.rating
            };
            await this.$store
              .dispatch("products/updateItem", updateProduct)
              .then(() => {
                self.snackbarText = "Successfully Updated";
                self.snackbarColor = "success";
                self.snackbar = true;
                setTimeout(function() {
                  self.$router.push("/admin");
                }, 2000);
              })
              .catch(e => {
                self.snackbarText = e.code;
                self.snackbarColor = "error";
                self.snackbar = true;
                self.loadingButton = false;
              });
          } else {
            let product = {
              category: self.category,
              audience: self.audience,
              subCategory: self.subCategory,
              name: self.name,
              size: self.size,
              discountPercent: self.discountPercent,
              availability: self.availability,
              image: self.image,
              price: self.price,
              description: self.description,
              chips: self.chips,
              colors: self.colors,
              brand: self.brand
            };
            self.$store
              .dispatch("products/add", product)
              .then(() => {
                self.snackbarText = "Successfully Created";
                self.snackbarColor = "success";
                self.snackbar = true;
                setTimeout(function() {
                  self.$router.push("/admin");
                }, 2000);
              })
              .catch(e => {
                self.snackbarText = e.code;
                self.snackbarColor = "error";
                self.snackbar = true;
                self.loadingButton = false;
              });
          }
        } else {
          self.noDescription = true;
        }
      }
      if (self.description === null) {
        self.noDescription = true;
      }
      if (self.image.length == 0) {
        this.fileError = "Image is required";
      }
    },
    async fileUpMethod(event) {
      let self = this;
      // update mode
      if (this.$route.query.id) {
        if (event.length > 0) {
          if (event.length == 1) {
            self.imageUploading = true;
            let file = event[0];
            let newFile = {
              name: file.name,
              url: "",
              ImageFile: file
            };
            this.$store
              .dispatch("products/fileUpload", newFile)
              .then(e => {
                self.image.push(e);
                self.snackbar = true;
                self.snackbarColor = "success";
                self.snackbarText = "Image Uploaded Successfully";
                self.imageUploading = false;
              })
              .catch(e => {
                self.imageUploading = false;
                self.snackbar = true;
                self.snackbarColor = "error";
                self.snackbarText = "Image Upload was not Successfull";
              });
          } else if (event.length > 1) {
            self.imageUploading = true;
            let file = [];
            file = event;
            let newImageFile = [];
            file.forEach(element => {
              // var tmppath = URL.createObjectURL(element);
              newImageFile.push({
                name: element.name,
                url: "",
                ImageFile: element
              });
            });
            var countImageUpdateLength = newImageFile.length;
            newImageFile.forEach(async element => {
              await this.$store
                .dispatch("products/fileUpload", element)
                .then(e => {
                  self.image.push(e);
                  self.snackbar = true;
                  self.snackbarColor = "success";
                  self.snackbarText = `Image Uploaded Successfully`;
                  countImageUpdateLength = countImageUpdateLength - 1;
                })
                .catch(e => {
                  self.imageUploading = false;
                  self.snackbar = true;
                  self.snackbarColor = "success";
                  self.snackbarText = `Image ${element.name} Upload was not Successfull`;
                });
              if (countImageUpdateLength === 0) {
                self.imageUploading = false;
              }
            });
          }
          this.fileError = "";
        }
      }
      // create mode
      else {
        if (event.length > 0) {
          if (event.length == 1) {
            let file = event[0];
            if (self.image.length === 0) {
              self.imageUploading = true;
              // var tmppath = URL.createObjectURL(file);
              self.image.push({
                name: file.name,
                url: "",
                ImageFile: file
              });
              await this.$store
                .dispatch("products/fileUpload", self.image[0])
                .then(e => {
                  self.snackbar = true;
                  self.snackbarColor = "success";
                  self.snackbarText = "Image Uploaded Successfully";
                  self.imageUploading = false;
                  self.imageUploaded = true;
                })
                .catch(e => {
                  self.snackbar = true;
                  self.snackbarColor = "error";
                  self.snackbarText = "Image Upload was not Successfull";
                  self.imageUploading = false;
                });
            } 
            
            else {
              self.imageUploaded = true;
              self.imageUploading = true;
              let newFile = {
                name: file.name,
                url: "",
                ImageFile: file
              };
              this.$store
                .dispatch("products/fileUpload", newFile)
                .then(e => {
                  self.image.push(e);
                  self.snackbar = true;
                  self.snackbarColor = "success";
                  self.snackbarText = "Image Uploaded Successfully";
                  self.imageUploading = false;
                })
                .catch(e => {
                  self.snackbar = true;
                  self.snackbarColor = "error";
                  self.snackbarText = "Image Upload was not Successfull";
                  self.imageUploading = false;
                });
            }
          } else if (event.length > 1) {
            if (self.image.length === 0) {
              self.imageUploading = true;
              let file = [];
              file = event;
              file.forEach(element => {
                // var tmppath = URL.createObjectURL(element);
                self.image.push({
                  name: element.name,
                  url: "",
                  ImageFile: element
                });
              });
              var countImageLoading = file.length;

              self.image.forEach(async element => {
                await this.$store
                  .dispatch("products/fileUpload", element)
                  .then(e => {
                    self.snackbar = true;
                    self.imageUploaded = true;
                    self.snackbarColor = "success";
                    self.snackbarText = `Image Uploaded Successfully`;
                    countImageLoading = countImageLoading - 1;
                  })
                  .catch(e => {
                    self.snackbar = true;
                    self.snackbarColor = "success";
                    self.snackbarText = `Image ${element.name} Upload was not Successfull`;
                    self.imageUploading = false;
                    self.imageUploaded = true;
                  });
                if (countImageLoading === 0) {
                  self.imageUploading = false;
                }
              });
            } else {
              self.imageUploading = true;
              let file = [];
              let newMultipleFile = [];
              file = event;
              file.forEach(element => {
                // var tmppath = URL.createObjectURL(element);
                newMultipleFile.push({
                  name: element.name,
                  url: "",
                  ImageFile: element
                });
              });
              var countImageLoadingExsisting = file.length;

              newMultipleFile.forEach(async element => {
                await this.$store
                  .dispatch("products/fileUpload", element)
                  .then(e => {
                    self.image.push(element);
                    self.snackbar = true;
                    self.imageUploaded = true;
                    self.snackbarColor = "success";
                    self.snackbarText = `Image Uploaded Successfully`;
                    countImageLoadingExsisting = countImageLoadingExsisting - 1;
                  })
                  .catch(e => {
                    self.snackbar = true;
                    self.snackbarColor = "success";
                    self.snackbarText = `Image ${element.name} Upload was not Successfull`;
                    self.imageUploading = false;
                    self.imageUploaded = true;
                  });
                if (countImageLoadingExsisting === 0) {
                  self.imageUploading = false;
                }
              });
            }
          }
          this.fileError = "";
        }
      }
    },
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
    openDialog(src) {
      this.dialog = true;
      this.dialogImg = src;
    },
    deleteFile() {
      let self = this;

      this.$store
        .dispatch("products/fileDelete", this.dialogImg)
        .then(e => {
          let index = self.image.findIndex(
            item => item.name == self.dialogImg.name
          );
          self.image.splice(index, 1);
          self.snackbarText = "Successfully Deleted";
          self.snackbarColor = "success";
          self.snackbar = true;
          self.dialog = false;
        })
        .catch(e => {
          self.snackbarText = `Unexpected Error\n ${e}`;
          self.snackbarColor = "error";
          self.snackbar = true;
           let index = self.image.findIndex(
            item => item.name == self.dialogImg.name
          );
          self.image.splice(index, 1);

        });
    }
  },
  computed: {
    updatedDataGet() {
      return this.$store.state.products.UpdateData;
    }
  }
};
</script>

<style scoped></style>
