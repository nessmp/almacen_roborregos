Warehouse of robotics team RoBorregos - ITESM.
Hosted [here](https://nessmp.github.io/)

After cloning the repository run

```
npm install
```
And create a new js file on src/ called "firebase_config.js". Add the snippet to add firebase to the project, the code should look like this:
```
var firebase = require('firebase')

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    projectId: "<PROJECT_ID>",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
};
firebase.initializeApp(config);


export default firebase
```