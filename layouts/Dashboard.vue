<template>
  <v-app>
    <v-navigation-drawer
      width="200"
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
          dense
        >
          <v-list-item-action>
            <v-icon color="primary">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon color="primary" @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon color="primary"
          >mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon
        >
      </v-btn>
      <v-toolbar-title
        ><v-btn to="/dashboard">
          <v-icon color="primary">mdi-home</v-icon>
        </v-btn></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-switch
        color="primary"
        class="mt-5"
        @change="toggleTheme()"
        v-model="goDark"
      ></v-switch>
      <v-btn dense icon @click="logout">
        <v-icon color="primary">
          mdi-logout
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-fade-transition>
          <Nuxt />
        </v-fade-transition>
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
  mounted() {
    // check the user type
    if (Cookie.get("role") !== undefined) {
      if (Cookie.get("role") == "user") {
        this.items = this.itemsUser;
      } else if (Cookie.get("role") == "admin") {
        this.items = this.itemsAdmin;
      }
    }
  },
  data() {
    return {
      goDark: false,
      clipped: true,
      drawer: true,
      fixed: false,
      items: [],
      itemsUser: [
        {
          icon: "mdi-account-clock",
          title: "Time Sheet",
          to: "/timeSheet"
        }
      ],
      itemsAdmin: [
        {
          icon: "mdi-account-group",
          title: "Users",
          to: "/users"
        },
        {
          icon: "mdi-account-clock",
          title: "Time Sheet",
          to: "/timeSheet"
        },
        {
          icon: "mdi-chart-box",
          title: "Report",
          to: "/report"
        }
      ],
      miniVariant: false,
      right: true
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
