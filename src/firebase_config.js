var firebase = require('firebase')

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDVzfeFifxT1NSbc3wKVXL_M01eHE7HpX0",
  authDomain: "almacen-roborregos.firebaseapp.com",
  databaseURL: "https://almacen-roborregos.firebaseio.com",
  projectId: "almacen-roborregos",
  storageBucket: "almacen-roborregos.appspot.com",
  messagingSenderId: "644694768812"
};
firebase.initializeApp(config)

export default firebase
