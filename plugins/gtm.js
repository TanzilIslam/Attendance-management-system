import Cookies from "js-cookie";
const gtmKey = "GTM-P3D84LM";
export default () => {
  /*
   ** Only run on client-side and only in production mode
   */
  if (process.env.NODE_ENV !== "production") return;
  /*
   ** Only run if it's not prevented by user
   */
  if (Cookies.get("disable-gtm"))
    return /*
     ** Include Google Tag Manager
     */;
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    const dl = l !== "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", gtmKey);
};
