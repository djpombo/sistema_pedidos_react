import firebase from 'firebase/app';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyB1Ax5u7nfTtoyArF2QCvnXnjGKbc4bErQ",
    authDomain: "sistema-e0e04.firebaseapp.com",
    projectId: "sistema-e0e04",
    storageBucket: "sistema-e0e04.appspot.com",
    messagingSenderId: "364350871858",
    appId: "1:364350871858:web:eb57c54daf34a2d5289f2b",
    measurementId: "G-9XNC659SRY"
};
if (!firebase.apps.length) {

    firebase.initializeApp(firebaseConfig);

}

export default firebase;