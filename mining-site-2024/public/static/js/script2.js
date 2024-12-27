
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyB2kBEgcUQH2s3b0n1JylU4Ji0KV1sF1_s",
    authDomain: "mining-site-2024.firebaseapp.com",
    projectId: "mining-site-2024",
    storageBucket: "mining-site-2024.appspot.com",
    messagingSenderId: "448522786959",
    appId: "1:448522786959:web:8e641ed59539df7caab8fa"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        showNotification("Login successful!");
        console.log("User ID:", user.uid);
        setTimeout(() => {
            window.location.href = "home.html";
        }, 3000); 
    } catch (error) {
        console.error("Error logging in:", error.message);
        showNotification("Login failed. Please check your credentials.");
    }
});
async function fetchUserData(uid) {
    try {
        const docRef = doc(db, 'user', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("User Data:", data);
            showNotification(`Welcome, ${data.name}!`);
        } else {
            console.log("No such document!");
            showNotification("No user data found.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        showNotification("Error fetching user data.");
    }
}
function showNotification(message) {
    const notificationBox = document.getElementById('notificationBox');
    notificationBox.innerText = message;
    notificationBox.style.display = 'block';
    setTimeout(() => {
        notificationBox.style.display = 'none';
    }, 3000);
}
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user.uid);
        fetchUserData(user.uid);
    } else {
        console.log("No user is signed in.");
    }
});
