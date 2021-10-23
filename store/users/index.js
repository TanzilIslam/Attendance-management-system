import { auth } from "@/services/firebase";
import { db } from "@/services/firebase";
import firebase from "firebase/app";
import Cookie from "js-cookie";

export const state = () => ({
  user: null,
  userInfo: {},
  UserList: []
});
export const mutations = {
  SET_USER(state, userInfo) {
    state.user = userInfo;
  },
  SET_USER_INFO(state, payload) {
    state.userInfo = userInfo;
  },
  GET_LIST(state, category) {
    state.UserList = category;
  }
};

export const actions = {
  async login({ commit }, userInfo) {
    return await new Promise((resolve, reject) => {
      db.collection("users")
        .where("email", "==", userInfo.email)
        .where("password", "==", userInfo.password)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            resolve("User Not Found");
          } else {
            let user = null;
            querySnapshot.forEach(doc => {
              user = {
                ...doc.data(),
                id: doc.id
              };
            });
            Cookie.set("uid", user.id);
            Cookie.set("role", user.role);
            console.log(user);
            commit("SET_USER", user);
            resolve(user);
          }
        })
        .catch(error => {
          reject(error);
        });
    });

    // try {
    //   await auth.signInWithEmailAndPassword(userInfo.email, userInfo.password);
    //   const token = await auth.currentUser.getIdToken();
    //   const { email, uid , emailVerified } = auth.currentUser;
    //   Cookie.set("access_token", token);

    // } catch (error) {
    //   throw error;
    // }
  },
  async addUser({ commit }, item) {
    return await new Promise((resolve, reject) => {
      try {
        db.collection("users")
          .add({
            name: item.name,
            entryDate: item.entryDate,
            email: item.email,
            password: item.password,
            address: item.address,
            phone: item.phone,
            role: item.role,
            status: item.status,
            leavingDate: item.leavingDate
          })
          .then(docRef => {
            resolve(docRef.id);
          });
      } catch (error) {
        reject(error);
      }
    });
  },

  async updateSheet({ commit }, item) {
    return await new Promise((resolve, reject) => {
      try {
        db.collection("timeSheet")
          .doc(item.id)
          .set({
            date: item.date,
            start_working: item.start_working,
            end_working: item.end_working,
            start_break: item.start_break,
            end_break: item.end_break
          })
          .then(docRef => {
            resolve(item);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },

  async updateUser({ commit }, item) {
    return await new Promise((resolve, reject) => {
      try {
        db.collection("users")
          .doc(item.id)
          .set({
            name: item.name,
            entryDate: item.entryDate,
            leavingDate: item.leavingDate,
            email: item.email,
            password: item.password,
            address: item.address,
            phone: item.phone,
            role: item.role,
            status: item.status
          })
          .then(docRef => {
            resolve(item);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  async deleteUser({ commit }, id) {
    return await new Promise((resolve, reject) => {
      try {
        console.log(id);
        db.collection("users")
          .doc(id)
          .delete()
          .then(() => {
            resolve(id);
          })
          .catch(error => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  },
  getUserProfile({ commit }, id) {
    return new Promise((resolve, reject) => {
      var item = db.collection("user_profiles").doc(id);
      item.get().then(
        response => {
          resolve(response.data());
        },
        error => {
          reject(error);
        }
      );
    });
  },
  async getUserLists({ commit }) {
    return await new Promise((resolve, reject) => {
      let allUsers = [];
      db.collection("users")
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            resolve("User Not Found");
          } else {
            querySnapshot.forEach(doc => {
              let user = {
                ...doc.data(),
                id: doc.id
              };
              allUsers.push(user);
            });
            resolve(allUsers);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
