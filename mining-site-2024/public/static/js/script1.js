import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signupForm');
    const alertBox = document.getElementById('alert');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); 

        const email = form.email.value;
        const password = form.password.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alertBox.style.display = 'block';
                form.reset();
                setTimeout(() => {
                    alertBox.style.display = 'none';
                    window.location.href = 'profile.html'; 
                }, 1000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error:", errorCode, errorMessage);
                alert("Error: " + errorMessage);
            });
    });
});
