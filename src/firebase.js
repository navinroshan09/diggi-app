import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "xxxxx",
    authDomain: "diggy-33384.firebaseapp.com",
    projectId: "diggy-33384",
    storageBucket: "diggy-33384.appspot.com",
    messagingSenderId: "xxxx",
    appId: "xxxx"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
