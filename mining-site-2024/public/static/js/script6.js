import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
        import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
        import { getFirestore, doc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

        async function searchAttendanceByDate(dateString) {
            const attendanceRef = collection(db, 'attendance');
            const resultsBody = document.getElementById('results-body');
            resultsBody.innerHTML = ''; // Clear previous results

            // Create a query to fetch records for the specified date
            const attendanceQuery = query(
                attendanceRef,
                where('date', '==', dateString)
            );

            const querySnapshot = await getDocs(attendanceQuery);

            if (querySnapshot.empty) {
                resultsBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No records found</td></tr>';
            } else {
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    resultsBody.innerHTML += `
                        <tr>
                            <td>${data.wid}</td>
                            <td>${data.wname}</td>
                            <td>${data.attended ? 'Yes' : 'No'}</td>
                            <td>${data.date}</td>
                            <td>${data.startTime || 'null'}</td>
                            <td>${data.endTime || 'null'}</td>
                        </tr>
                    `;
                });
            }
        }

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
            document.getElementById('search-button').addEventListener('click', () => {
                const inputDate = document.getElementById('input-date').value;
                searchAttendanceByDate(inputDate);
            });

            const profilePic = document.querySelector('.profile-pic');
            const dropdown = document.querySelector('.dropdown');
            const alertBox = document.querySelector('.alert-box');

            profilePic.addEventListener('click', () => {
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            });

            // Logout function
            document.getElementById('logout').addEventListener('click', async (event) => {
                event.preventDefault(); // Prevent default anchor behavior
                try {
                    await signOut(auth);
                    showAlert('Logged out successfully!');
                    window.location.href = '/index.html'; // Redirect using a relative URL
                } catch (error) {
                    console.error('Logout Error:', error);
                }
            });

            // Hide dropdown when clicking outside
            document.addEventListener('click', (event) => {
                if (!profilePic.contains(event.target) && !dropdown.contains(event.target)) {
                    dropdown.style.display = 'none';
                }
            });

            // Function to show the alert box
            function showAlert(message) {
                alertBox.textContent = message;
                alertBox.style.display = 'block';
                setTimeout(() => {
                    alertBox.style.display = 'none';
                }, 3000);
            }
        });