<template>
  <v-container class="mt-4">
    <div v-if="showLoadingIcon" class="text-center mt-4 pt-4">
      <v-progress-circular indeterminate :size="50"></v-progress-circular>
    </div>

    <div v-else>
      <v-row>
        <v-col cols="12" sm="12" md="5" lg="5" xl="5">
          <client-only>
            <v-carousel>
              <v-carousel-item
                v-for="(item, i) in image"
                :key="i"
                reverse-transition="slide-x-reverse-transition"
                transition="slide-x-transition"
              >
                <zoom-on-hover :img-normal="item.url" :scale="1.5">
                </zoom-on-hover>
              </v-carousel-item>
            </v-carousel>
          </client-only>
        </v-col>

        <v-col cols="12" sm="12" md="7" lg="7" xl="7">
          <div class="pl-6">
            <p class="display-1 mb-4">{{ name }}</p>
            <div class="d-flex">
              <template>
                <p v-if="haveDiscount" class="headline font-weight-light">
                  ${{ lessPrice }}
                  <del style="" class="subtitle-1 font-weight-thin"
                    >${{ price }}</del
                  >
                </p>

                <p v-else class="headline font-weight-light">${{ price }}</p>
              </template>
              <v-spacer></v-spacer>
              <!-- <template class="ml-auto">
                <v-rating
                  :readonly="true"
                  v-model="rating"
                  class=""
                  background-color="warning lighten-3"
                  color="warning"
                  dense
                ></v-rating>
                <span class="body-2 mt-1"> 25 REVIEWS</span>
              </template> -->
            </div>
            <p>
              <v-icon>mdi-image-filter-vintage</v-icon>{{ category }} :
              {{ subCategory }}
            </p>
            <p><v-icon>mdi-hexagon</v-icon>Brand : {{ brand }}</p>
            <p>
              <v-icon>mdi-human-male-female</v-icon>Product For : {{ audience }}
            </p>
            <p><v-icon>mdi-axis-arrow</v-icon>SIZE : {{ size }}</p>
            <div class="d-flex">
              <div class="mt-2"><v-icon>mdi-invert-colors</v-icon>Colors :</div>
              <v-chip
                class="ma-2"
                :color="color === 'black' ? 'gray' : color"
                :outlined="color == 'white' ? false : true"
                v-for="(color, index) in colors"
                :key="index"
                >{{ color }}</v-chip
              >
            </div>
            <div class="d-flex">
              <div class="mt-2">
                <v-icon>mdi-tag-multiple-outline</v-icon>Tags :
              </div>
              <v-chip
                class="ma-2"
                outlined
                v-for="(chip, index) in chips"
                :key="index"
                >#{{ chip }}</v-chip
              >
            </div>
            <p>
              <v-icon>mdi-cart-arrow-down</v-icon>In Stock : {{ availability }}
            </p>
            <div class="mt-4 d-flex">
              <div class="width:100px">
                <v-text-field
                  label="ITEMS"
                  outlined
                  type="number"
                  v-model.number="askedQuantity"
                  dense
                  min="1"
                  style="width:120px;"
                  @blur="checkQuantity"
                  color="primary"
                ></v-text-field>
              </div>
              <v-btn @click="AddToCart" outlined tile dense class="ml-4" color="primary"
                ><v-icon>mdi-cart</v-icon> ADD TO CART</v-btn
              >
            </div>
            <!-- <v-btn class="ml-4" outlined tile>ADD TO WISHLIST</v-btn> -->
          </div>
        </v-col>
      </v-row>
      <v-row class="mt-2">
        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
          <v-tabs>
            <v-tab>Description</v-tab>
            <!-- <v-tab>Materials</v-tab> -->
            <!-- <v-tab>REVIEWS</v-tab> -->
            <v-tab-item>
            <div v-html="description"></div>
            </v-tab-item>
            <!-- <v-tab-item>
              <p class="pt-10 subtitle-1 font-weight-thin">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ultricies mi eget mauris pharetra et. Vel pretium lectus quam id
                leo in vitae turpis massa. Orci dapibus ultrices in iaculis
                nunc. At auctor urna nunc id cursus metus. Integer feugiat
                scelerisque varius morbi enim nunc. Aliquam sem et tortor
                consequat id porta nibh venenatis cras. Pellentesque pulvinar
                pellentesque habitant morbi tristique senectus et netus.
                Malesuada nunc vel risus commodo viverra maecenas. Neque
                volutpat ac tincidunt vitae semper quis.
              </p>
            </v-tab-item>
            <v-tab-item>
              <v-list three-line="true" avatar="true">
                <v-list-item-group color="primary">
                  <v-list-item
                    v-for="(item, i) in reviews"
                    :key="i"
                    inactive="true"
                  >
                    <v-list-item-avatar>
                      <v-img :src="item.avatar"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="item.title"></v-list-item-title
                      ><v-rating
                        v-model="rating"
                        :readonly="true"
                        class=""
                        background-color="warning lighten-3"
                        color="warning"
                        dense
                      ></v-rating>
                      <v-list-item-subtitle
                        v-html="item.subtitle"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-tab-item> -->
          </v-tabs>
        </v-col>
      </v-row>
      <v-row class="mt-3">
        <v-col cols="12">
          <p class="subtitle-1 font-weight-light pt-3 text-center">
            YOU MIGHT ALSO LIKE
          </p>
          <v-divider></v-divider>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
          lg="2"
          xl="2"
          v-for="(item, index) in list.filter(item=>{ return  item.id != $route.params.index})"
          :key="index"
        >
        <div>
          <v-hover v-slot:default="{ hover }" open-delay="200">
            <v-card :elevation="hover ? 16 : 2">
              <v-img
                contain
                class="white--text align-end"
                height="200px"
                :src="item.image[0].url"
              >
                <v-card-title class=" bg-text">{{ item.brand }}</v-card-title>
              </v-img>

              <v-card-text class="text--primary text-center">
                <div>{{ item.name.substring(0,30)  }}...</div>
                <div>{{ item.price }}</div>
              </v-card-text>

              <div class="text-center">
                <v-btn
                  class="ma-2"
                  outlined
                 color="primary"
                  :to="'/product/' + item.id"
                >
                  Explore
                </v-btn>
              </div>
            </v-card>
          </v-hover>
        </div>
        </v-col>
      </v-row>
    </div>
    <v-snackbar top right v-model="snackbar" :color="snackbarColor">
      <div class="text-center">
        <v-icon v-if="snackbarColor == 'success'">mdi-check</v-icon>
        {{ snackbarText }}
      </div>
    </v-snackbar>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    askedQuantity: 1,
    snackbar: false,
    snackbarColor: "success",
    snackbarText: "",
    cart: [],
    lessPrice: 0,
    haveDiscount: false,
    imageKey: 0,
    mainCard: null,
    showLoadingIcon: true,
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
    rating: null,
    chips: [],
    list: [],
    backUpList: [],
    reviews: [
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        title: "Lorem ipsum dolor?",
        subtitle:
          "<span class='text--primary'>Ali Connors</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Tincidunt arcu non sodales neque sodales ut etiam. Lectus arcu bibendum at varius vel pharetra. Morbi tristique senectus et netus et malesuada.\n" +
          "\n"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        title:
          'Lorem ipsum dolor <span class="grey--text text--lighten-1">4</span>',
        subtitle:
          "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        title: "Lorem ipsum dolor",
        subtitle:
          "<span class='text--primary'>Sandra Adams</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        title: "Lorem ipsum dolor",
        subtitle: ""
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
        title: "Lorem ipsum dolor",
        subtitle:
          "<span class='text--primary'>Britta Holt</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      }
    ]
  }),
  async fetch() {
    if (this.$route.params.index) {
      var self = this;
      await this.$store
        .dispatch("products/getUpdateProduct", this.$route.params.index)
        .then(re => {
          (self.category = re.category),
            (self.name = re.name),
            (self.image = JSON.parse(re.image)),
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
          self.rating = re.rating;
          self.showLoadingIcon = false;
          if (self.discountPercent > 0) {
            self.haveDiscount = true;
          }
          self.lessPrice = (self.price / 100) * self.discountPercent;

          self.lessPrice = self.price - self.lessPrice;
        })
        .catch(error => {
          console.log(error);
        });

      await self.$store.dispatch("products/getLists");
      self.list = self.$store.state.products.List;
      self.backUpList = self.list;
    }
  },
  methods: {
    checkQuantity() {
      if (this.askedQuantity == 0) {
        this.askedQuantity = 1;
      } else {
        if (this.askedQuantity > this.availability) {
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarText = "Out of range";
        }
      }
    },
    setMaincardImage(item) {
      this.mainCard = null;
      this.mainCard = item.url;
      this.imageKey = this.imageKey + 1;
    },
    AddToCart() {
      if (this.askedQuantity <= this.availability) {
        let product = {
          id: this.$route.params.index,
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
          rating: this.rating,
          askedQuantity: this.askedQuantity
        };
        let CartItems = [];
        CartItems = [...this.cartItem];
        var foundItems = false;
        for (let index = 0; index < CartItems.length; index++) {
          var element = CartItems[index];
          if (element.id === this.$route.params.index) {
            foundItems = true;
          }
        }
        if (foundItems == false) {
          this.$store.dispatch("products/cartListUpdate", product);
          this.snackbar = true;
          (this.snackbarColor = "success"),
            (this.snackbarText = "Added To The Cart");
        } else {
          this.snackbar = true;
          (this.snackbarColor = "success"),
            (this.snackbarText = "Already Added To The Cart");
        }
      } else {
        this.snackbar = true;
        this.snackbarColor = "error";
        this.snackbarText = "Out of range";
      }
    }
  },
  computed: {
    cartItem() {
      return this.$store.state.products.cartItems;
    }
  },
  watch: {}
};
</script>
<style scoped>
.full-height {
  height: 100% !important ;
}
</style>
