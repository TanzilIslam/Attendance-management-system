import { db } from "@/services/firebase";
import firebase from "firebase/app";
export const namespaced = true;
export const state = () => ({
  List: [],
  UpdateData: null,
  cartItems:[]
});

export const mutations = {
  GET_LIST(state, category) {
    state.List = category;
  },
  DELETE(state, productId) {
    let index = state.List.findIndex(id => id.id == productId);
    state.List.splice(index, 1);
  },
  GET_UPDATE_DATA(state, item) {
    state.UpdateData = item;
  },
  CARTLIST_UPDATE(state,product){
    state.cartItems.push(product)
  },
  DELETE_FROM_CART(state,product){
    let index = ""
    index = state.cartItems.findIndex(item=>(item.id == product.id))
    state.cartItems.splice(index,1) 
  }
};
export const actions = {
  // Get List
  async getLists({ commit, state }) {
    let productList = [];
    const products = db.collection("products");
    const snapshot = await products.get();
    snapshot.forEach(doc => {
      let item = {
        ...doc.data(),
        id: doc.id
      };
      item.image = JSON.parse(item.image)
      // console.log(item.image);
      productList.push(item);
    });
    // console.log(productList);
    commit("GET_LIST", productList);
  },

  // Add
  add({ commit }, item) {
    try {
      db.collection("products")
        .add({
          category: item.category,
          audience: item.audience,
          subCategory: item.subCategory,
          name: item.name,
          size: item.size,
          discountPercent: item.discountPercent,
          availability: item.availability,
          image: JSON.stringify(item.image),
          price: item.price,
          description: item.description,
          chips: item.chips,
          colors: item.colors,
          brand: item.brand,
          rating:0
        })
        .then(docRef => {
        });
    } catch (error) {
      throw error;
    }
  },
  // Update
  updateItem({ commit }, updateProduct) {
    try {
      var item = db.collection("products");
      item.doc(updateProduct.id).set({
        category: updateProduct.category,
        audience: updateProduct.audience,
        subCategory: updateProduct.subCategory,
        name: updateProduct.name,
        size: updateProduct.size,
        discountPercent: updateProduct.discountPercent,
        availability: updateProduct.availability,
        image: JSON.stringify(updateProduct.image),
        price: updateProduct.price,
        description: updateProduct.description,
        chips: updateProduct.chips,
        colors: updateProduct.colors,
        brand: updateProduct.brand,
        rating:updateProduct.rating
      });
    } catch (error) {
      throw error;
    }
  },
  // Delete
  deleteProduct({ commit }, id) {
    try {
      db.collection("products")
        .doc(id)
        .delete()
        .then(() => {
          commit("DELETE", id);
        })
        .catch(error => {
          throw new Error("Error: Getting document:");
        });
    } catch (error) {
      throw new Error("Error: Getting document:");
    }
  },
  getUpdateProduct({ commit }, id) {
    return new Promise((resolve, reject) => {
      var item = db.collection("products").doc(id);
      item.get().then(
        response => {
          commit("GET_UPDATE_DATA", response.data());
          resolve(response.data());
        },
        error => {
          reject(error);
        }
      );
    });
  },
  async fileUpload({ commit }, file) {
    
      return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref("products/" + file.name);
        let uploadTask =  storageRef.put(file.ImageFile);
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
             uploadTask.snapshot.ref.getDownloadURL().then( downloadURL => {
              file.url = downloadURL;
              delete file.ImageFile
              resolve(file)
            });
          }
        );
        
    }); 
  },
  fileDelete({ commit }, file) {
    return new Promise((resolve, reject) => {
      var storageRef = firebase.storage().ref("products/" + file.name);
      storageRef
        .delete()
        .then(() => {
          resolve("File Delete Successfully");
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  cartListUpdate({commit}, product){
    commit("CARTLIST_UPDATE",product)
  },
  deleteItemFromCart({commit},product){
    commit("DELETE_FROM_CART",product)
  }
};
