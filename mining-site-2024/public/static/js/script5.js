import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
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

function displayUserData(name, designation, email, profilePic) {
    const userInfoDiv = document.getElementById('userInfo');
    userInfoDiv.innerHTML = `
        <img src="${profilePic}" alt="Profile Picture">
        <h2>${name}</h2>
        <p><strong>Designation:</strong> ${designation}</p>
        <p><strong>Email:</strong> ${email}</p>
    `;
}

function showNotification(message) {
    const notificationBox = document.getElementById('notificationBox');
    notificationBox.innerText = message;
    notificationBox.style.display = 'block';
    setTimeout(() => {
        notificationBox.style.display = 'none';
    }, 3000);
}

async function fetchUserData(uid) {
    try {
        const docRef = doc(db, 'user', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("User Data:", data);
            displayUserData(data.name, data.designation, data.email, data.profilepic);
            showNotification("User data loaded successfully!");
        } else {
            console.log("No such document!");
            document.getElementById('userInfo').innerText = "No user data found.";
            showNotification("No user data found.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        showNotification("Error fetching user data.");
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log("UID:", uid);
        fetchUserData(uid);
    } else {
        console.log("No user is signed in.");
        document.getElementById('userInfo').innerText = "Please sign in to view your profile.";
        showNotification("Please sign in.");
    }
});
