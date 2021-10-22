import cookieparser from "cookieparser";

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    // if (process.server && process.static) return;
    // if (!req.headers.cookie) return;
    // if (req.headers.cookie !== undefined) {
    //   const parsed = cookieparser.parse(req.headers.cookie);
    //   commit("users/SET_USER", {
    //     uid: parsed.uid,
    //     role: parsed.role
    //   });
    // }
  }
};
