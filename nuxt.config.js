export default {
  target: "static",
  head: {
    titleTemplate: "%s - Attendance System",
    title: "Attendance management system using nuxt js and firebase",
    htmlAttclearrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  css: ["@/assets/main.css"],
  plugins: [],
  router: {
    middleware: ["authenticated"]
  },
  loading: {
    color: "#F57F17",
    height: "5px",
    throttle: 200,
    duration: 3000
  },
  components: true,
  buildModules: [
    "@nuxtjs/vuetify"
  ],
  modules: [
    "@nuxtjs/axios"
  ],
  axios: {},
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false
      // themes: {
      //   dark: {
      //     primary: colors.red,
      //     accent: colors.grey.darken3,
      //     secondary: colors.amber.darken3,
      //     info: colors.teal.lighten1,
      //     warning: colors.amber.base,
      //     error: colors.deepOrange.accent4,
      //     success: colors.green.accent3,
      //     anchor: "#8c9eff"
      //   },
      //   light: {
      //     primary: "#1976D2",
      //     secondary: "#424242",
      //     accent: "#82B1FF",
      //     error: "#FF5252",
      //     info: "#2196F3",
      //     success: "#4CAF50",
      //     warning: "#FFC107",
      //     anchor: "#8c9eff"
      //   }
      // }
    }
  },
  build: {},
  generate: {
    fallback: true
  }
};
