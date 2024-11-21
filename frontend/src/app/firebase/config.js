import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGfDvpxztqYXTrXMk5qu7lLPTQqFfiB_k",
  authDomain: "tes-online-ippl.firebaseapp.com",
  projectId: "tes-online-ippl",
  storageBucket: "tes-online-ippl.appspot.com",
  messagingSenderId: "901733415157",
  appId: "1:901733415157:web:80899ed4302338c5966dbc",
  measurementId: "G-5VK1HE0JNB"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);