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
            Cookie.set("name", user.name);
            console.log(user);
            resolve(user);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
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
  async getAllSheet({ commit }, userInfo) {
    return await new Promise((resolve, reject) => {
      db.collection("timeSheet")
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            resolve("User Not Found");
          } else {
            let timeSheet = null;
            let timeSheetList = [];
            querySnapshot.forEach(doc => {
              timeSheet = {
                ...doc.data(),
                sheetId: doc.id
              };
              timeSheetList.push(timeSheet);
            });
            resolve(timeSheetList);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  async checkSheet({ commit }, userInfo) {
    return await new Promise((resolve, reject) => {
      db.collection("timeSheet")
        .where("id", "==", userInfo.id)
        .where("date", "==", userInfo.date)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            resolve("User Not Found");
          } else {
            let timeSheet = null;
            querySnapshot.forEach(doc => {
              timeSheet = {
                ...doc.data(),
                sheetId: doc.id
              };
            });
            resolve(timeSheet);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  async checkSheetById({ commit }, userInfo) {
    return await new Promise((resolve, reject) => {
      db.collection("timeSheet")
        .where("id", "==", userInfo.id)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            resolve("User Not Found");
          } else {
            let timeSheet = null;
            let timeSheetList = [];
            querySnapshot.forEach(doc => {
              timeSheet = {
                ...doc.data(),
                sheetId: doc.id
              };
              timeSheetList.push(timeSheet);
            });
            resolve(timeSheetList);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  async createSheet({ commit }, item) {
    return await new Promise((resolve, reject) => {
      try {
        db.collection("timeSheet")
          .add({
            name: item.name,
            id: item.id,
            date: item.date,
            start_working: item.start_working,
            end_working: item.end_working,
            start_break: item.start_break,
            end_break: item.end_break
          })
          .then(docRef => {
            resolve(docRef.id);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  async updateSheet({ commit }, item) {
    return await new Promise((resolve, reject) => {
      try {
        db.collection("timeSheet")
          .doc(item.sheetId)
          .set({
            date: item.date,
            start_working: item.start_working,
            end_working: item.end_working,
            start_break: item.start_break,
            end_break: item.end_break,
            id: item.id,
            name: item.name
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
