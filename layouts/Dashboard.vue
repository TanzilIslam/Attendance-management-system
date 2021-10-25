<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      mobile-breakpoint="960"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-toolbar-title
        ><v-btn to="/dashboard">
          <v-icon color="primary">mdi-home</v-icon>
        </v-btn></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-switch
        class="mt-5"
        @change="toggleTheme()"
        v-model="goDark"
      ></v-switch>
      <v-btn dense @click="logout">
        LogOut
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import Cookie from "js-cookie";
export default {
  mounted(){
    if (Cookie.get("role") !== undefined) {
      if (Cookie.get("role") == 'user') {
        this.items = this.itemsUser
      }
      else if(Cookie.get("role") == 'admin'){
        this.items = this.itemsAdmin

      }
      // this.items = Cookie.get("role") == 'admin' ? this.itemsAdmin : this.itemsUse;      
    }

  },
  data() {
    return {
      goDark: false,
      clipped: true,
      drawer: true,
      fixed: false,
      items:[],
      itemsUser: [
        {
          icon: "mdi-chart-bubble",
          title: "Time Sheet",
          to: "/timeSheet"
        }
      ],
      itemsAdmin: [
        {
          icon: "mdi-apps",
          title: "Users",
          to: "/users"
        },
        {
          icon: "mdi-chart-bubble",
          title: "Time Sheet",
          to: "/timeSheet"
        }
      ],
      
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js"
    };
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = this.goDark;
    },
    logout() {
      localStorage.clear();
      Cookie.remove("uid");
      Cookie.remove("role");
      this.$router.push("/");
    }
  }
};
</script>
