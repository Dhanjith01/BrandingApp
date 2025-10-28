// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ8XiUToggXLlt82fvjLacTslwWgXGgVM",
  authDomain: "brandingapp-4629f.firebaseapp.com",
  projectId: "brandingapp-4629f",
  storageBucket: "brandingapp-4629f.firebasestorage.app",
  messagingSenderId: "454170941487",
  appId: "1:454170941487:web:c54a3b14996248d8240eda"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const InitApp=()=>{
    return app;
}