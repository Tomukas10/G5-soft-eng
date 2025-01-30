
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC9zFwknQs-G5wBLAYLpfnH6fZ7hXjuhXo",
    authDomain: "easy-cribs.firebaseapp.com",
    projectId: "easy-cribs",
    storageBucket: "easy-cribs.firebasestorage.app",
    messagingSenderId: "706055631487",
    appId: "1:706055631487:web:574f04cd6355497abcc54a",
    measurementId: "G-QB941CTKR3"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
