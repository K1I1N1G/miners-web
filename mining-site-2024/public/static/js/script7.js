import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

    document.addEventListener('DOMContentLoaded', async () => {
        const form = document.getElementById('assignment-form');
        const assignedToSelect = document.getElementById('assignedTo');

        const usersSnapshot = await getDocs(collection(db, 'user'));
        usersSnapshot.forEach((doc) => {
            const user = doc.data();
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            assignedToSelect.appendChild(option);
    });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const assignmentData = {
                assignedBy: form.assignedBy.value,
                assignedTo: form.assignedTo.value,
                assignmentId: form.assignmentId.value,
                title: form.title.value,
                description: form.description.value,
                completedBy: null,
                completionId: null,
                completionStatus: false,
                dateTimeOfAssignment: new Date().toLocaleString()
                };
                try {
                    await setDoc(doc(db, 'assignments', assignmentData.assignmentId), assignmentData);
                    alert('Assignment submitted successfully!');
                    form.reset();
                } catch (error) {
                    console.error('Error adding document:', error);
                    alert('Failed to submit assignment. Please try again.');
                }
            });

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.uid;
                    getUserProfile(uid);
                } else {
                    console.log("No user signed in.");
                }
            });
        });

        async function getUserProfile(uid) {
            try {
                const userDocRef = doc(db, "user", uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    document.getElementById('profilePic').src = userData.profilepic;
                } else {
                    console.error("No such document found!");
                }
            } catch (error) {
                console.error("Error fetching user document:", error);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const logoutLink = document.getElementById('logout');
            const alertBox = document.createElement('div');
            alertBox.className = 'alert';
            document.body.appendChild(alertBox);

            logoutLink.addEventListener('click', async (event) => {
                event.preventDefault();
                try {
                    await signOut(auth);
                    alertBox.textContent = 'Logged out successfully!';
                    alertBox.style.display = 'block';
                    setTimeout(() => {
                        alertBox.style.display = 'none';
                    }, 3000); // Alert will disappear after 3 seconds
                    document.querySelector('.dropdown').style.display = 'none';
                    window.location.href = '/index.html';
                } catch (error) {
                    console.error('Error logging out:', error);
                    alertBox.textContent = 'Failed to log out. Please try again.';
                    alertBox.style.display = 'block';
                    setTimeout(() => {
                        alertBox.style.display = 'none';
                    }, 3000); // Alert will disappear after 3 seconds
                }
            });
        });