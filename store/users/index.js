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
  async signup({ commit }, userInfo) {
    try {
      await auth
        .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
        .then(userCredential => {
          var user = auth.currentUser;

          user
            .sendEmailVerification()
            .then(function() {
              // Email sent.
            })
            .catch(function(error) {
              throw error;
            });
        });
    } catch (error) {
      throw error;
    }
  },

  async fileUpload({ commit }, file) {
    return new Promise(function(resolve, reject) {
      var storageRef = firebase.storage().ref("profile_pictures/" + file.name);
      let uploadTask = storageRef.put(file);
      uploadTask.on(
        "state_changed",
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("Upload is running");
              break;
          }
        },
        error => {
          reject(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            file.url = downloadURL;
            resolve(file);
          });
        }
      );
    });
  },
  updateUserInfo({ commit }, userInfo) {
    try {
      db.collection("user_profiles")
        .doc(userInfo.uuid)
        .set({
          country: userInfo.country,
          state: userInfo.state,
          city: userInfo.city,
          currency: userInfo.currency,
          address: userInfo.address,
          postalCode: userInfo.postalCode,
          countryFlag: userInfo.countryFlag,
          phoneNumber: userInfo.phoneNumber,
          uuid: userInfo.uuid
        })
        .then(docRef => {});
    } catch (error) {
      throw error;
    }
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
    const UserList = db.collection("user_profiles");
    const snapshot = await UserList.get();
    snapshot.forEach(doc => {
      let item = {
        ...doc.data(),
        id: doc.id
      };
      item.image = JSON.parse(item.image);
      // console.log(item.image);
      UserList.push(item);
    });
    commit("GET_LIST", UserList);
  }
};
