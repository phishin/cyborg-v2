// plugins/firebase.client.js// Remove the default import; use only named imports.import { defineNuxtPlugin } from '#app'import { initializeApp } from 'firebase/app'import { getAnalytics } from 'firebase/analytics'import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, fetchSignInMethodsForEmail, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, sendPasswordResetEmail } from "firebase/auth";// Your Firebase configurationconst firebaseConfig = {    apiKey: "AIzaSyBye7vNe4IrJK2txXryWe7tZYOK_aWPM34",    authDomain: "cyborg-logo-firebase.firebaseapp.com",    projectId: "cyborg-logo-firebase",    storageBucket: "cyborg-logo-firebase.firebasestorage.app",    messagingSenderId: "807095161618",    appId: "1:807095161618:web:44446030ae72ac7a0c59cb",    measurementId: "G-L11BDTF5HP"};// Initialize the Firebase appconst app = initializeApp(firebaseConfig)const analytics = getAnalytics(app)const auth = getAuth()// Export the plugin using defineNuxtPluginexport default defineNuxtPlugin(() => {    return {        provide: {            firebase: {                app,                analytics,                auth,                googleProvider: new GoogleAuthProvider(),                facebookProvider: new FacebookAuthProvider(),                signInWithPopup,                fetchSignInMethodsForEmail,                signOut,                signInWithEmailAndPassword,                createUserWithEmailAndPassword,                sendEmailVerification,                updateProfile,                sendPasswordResetEmail,            }        }    }})