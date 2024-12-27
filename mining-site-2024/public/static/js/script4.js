import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

async function getUserProfile(uid) {
    try {
        const userDocRef = doc(db, "user", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Data:", userData);
            document.getElementById('profilePic').src = userData.profilepic;
        } else {
            console.error("No such document found!");
        }
    } catch (error) {
        console.error("Error fetching user document:", error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log("User's UID:", uid);
        getUserProfile(uid);
    } else {
        console.log("No user signed in.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.querySelector('.profile-pic');
    const dropdown = document.querySelector('.dropdown');
    const alertBox = document.querySelector('.alert-box');

    if (profilePic && dropdown && alertBox) {
        profilePic.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('logout').addEventListener('click', async () => {
            try {
                await signOut(auth);
                showAlert('Logged out successfully!');
                window.location.href = '/index.html';
            } catch (error) {
                console.error('Logout Error:', error);
                showAlert('Logout failed. Please try again.');
            }
        });

        document.addEventListener('click', (event) => {
            if (!profilePic.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    function showAlert(message) {
        alertBox.textContent = message;
        alertBox.style.display = 'block';
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
    }
});
