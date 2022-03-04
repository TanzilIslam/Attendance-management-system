export default {
  target: "static",
  head: {
    titleTemplate: "%s - Attendance System",
    title: "Attendance management system using nuxt js and firebase",
    htmlAttclearrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  css: ["@/assets/main.css"],
  plugins: [{ src: "~/plugins/gtm.js", ssr: false }],
  router: {
    // middleware: ["authenticated"]
  },
  loading: {
    color: "#F57F17",
    height: "5px",
    throttle: 200,
    duration: 3000,
  },
  components: true,
  buildModules: ["@nuxtjs/vuetify", "@nuxtjs/google-analytics"],
  modules: ["@nuxtjs/axios"],
  axios: {},
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: "#0093E9",
        },
        light: {
          primary: "#0093E9",
        },
      },
    },
  },
  build: {},
  generate: {
    fallback: true,
  },
  googleAnalytics: {
    id: "G-F73B104ER2",
  },
};
