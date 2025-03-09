// plugins/firebase.client.js// Remove the default import; use only named imports.import { defineNuxtPlugin } from '#app'import { initializeApp } from 'firebase/app'import { getAnalytics } from 'firebase/analytics'import {    getAuth,    GoogleAuthProvider,    FacebookAuthProvider,    signInWithPopup,    fetchSignInMethodsForEmail,    signOut,    signInWithEmailAndPassword,    createUserWithEmailAndPassword,    sendEmailVerification,    updateProfile,    sendPasswordResetEmail,    setPersistence,    browserLocalPersistence,    signInAnonymously,} from "firebase/auth";// Import Firestore functionsimport { getFirestore } from 'firebase/firestore'// Your Firebase configuration// const firebaseConfig = {//     apiKey: "AIzaSyBye7vNe4IrJK2txXryWe7tZYOK_aWPM34",//     authDomain: "cyborg-logo-firebase.firebaseapp.com",//     projectId: "cyborg-logo-firebase",//     storageBucket: "cyborg-logo-firebase.firebasestorage.app",//     messagingSenderId: "807095161618",//     appId: "1:807095161618:web:44446030ae72ac7a0c59cb",//     measurementId: "G-L11BDTF5HP"// };const firebaseConfig = {    apiKey: "AIzaSyBVju5vlPyeUWnU40U0j4YEVDC6wki_ij8",    authDomain: "cyborg-logo-llc.firebaseapp.com",    projectId: "cyborg-logo-llc",    storageBucket: "cyborg-logo-llc.firebasestorage.app",    messagingSenderId: "845130277679",    appId: "1:845130277679:web:7874ee8ddf681c711c37da",    measurementId: "G-NVYTZQPDTT"};// Initialize the Firebase appconst app = initializeApp(firebaseConfig)const analytics = getAnalytics(app)const auth = getAuth()const firebaseDatabase = getFirestore(app) // initialize Firestore// Set authentication persistence to local cachingsetPersistence(auth, browserLocalPersistence)    .then(() => {        console.log("Firebase persistence set to local.");    })    .catch((error) => {        console.error("Error setting persistence:", error);    });// log out userconst signUserOut = () => {    return signOut(auth)        .then(() => {            console.log("User signed out.");        })        .catch((error) => {            console.error("Error signing out:", error);        });};// signInAnonymously(auth)//     .then(() => {//         console.log("Signed in anonymously");//     })//     .catch((error) => {//         console.error("Anonymous sign-in failed:", error);//     });// Export the plugin using defineNuxtPluginexport default defineNuxtPlugin(() => {    return {        provide: {            firebase: {                app,                analytics,                auth,                firebaseDatabase,                googleProvider: new GoogleAuthProvider(),                facebookProvider: new FacebookAuthProvider(),                signInWithPopup,                fetchSignInMethodsForEmail,                signOut,                signUserOut, // custom logout function                signInWithEmailAndPassword,                createUserWithEmailAndPassword,                sendEmailVerification,                updateProfile,                sendPasswordResetEmail,                browserLocalPersistence,                signInAnonymously,            }        }    }})