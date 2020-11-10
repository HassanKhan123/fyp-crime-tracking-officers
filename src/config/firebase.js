import * as firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyCsRBeC7LFa1oKDGbni3EUDwGeZ0x-Kxfo",
  authDomain: "rn-hackaton-i.firebaseapp.com",
  databaseURL: "https://rn-hackaton-i.firebaseio.com",
  projectId: "rn-hackaton-i",
  storageBucket: "",
  messagingSenderId: "715613103262",
  appId: "1:715613103262:web:c9f74f8f8883460ce8078f"
};

const fire = firebase.initializeApp(firebaseConfig)
// Initialize Firebase
export default fire;