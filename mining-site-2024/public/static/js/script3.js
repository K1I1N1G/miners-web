// Import the necessary Firebase functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAccPicT6fs-QnJHidL8K327WlpcWVohzk",
  authDomain: "mining-site-2024.firebaseapp.com",
  projectId: "mining-site-2024",
  storageBucket: "mining-site-2024.appspot.com",
  messagingSenderId: "448522786959",
  appId: "1:448522786959:web:a766bde8d38b3beeaab8fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Handle user authentication and profile fetching
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("User's UID:", uid);
    getUserProfile(uid);
  } else {
    console.log("No user signed in.");
  }
});

// Fetch the user profile from Firestore (you can customize this part based on your Firestore structure)
async function getUserProfile(uid) {
  try {
    // Here you can replace this with actual Firestore logic to get user profile info
    // Example: Fetching user data from Firestore based on UID
    console.log(`Fetching profile for user ID: ${uid}`);
    // Let's assume you have a placeholder image URL in user profile
    const profilePicUrl = "https://example.com/profile-pic.jpg"; // Replace this with actual data fetching logic

    // Update the profile picture (if available)
    document.getElementById('profilePic').src = profilePicUrl;
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

// Handling file uploads to Firebase Storage
document.getElementById('uploadFileButton').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const storageRef = ref(storage, 'profile_pics/' + file.name);
    try {
      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      console.log('File uploaded successfully', snapshot);

      // Get the download URL after upload
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File available at', downloadURL);
      
      // You can use this URL to display the uploaded image
      document.getElementById('profilePic').src = downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
});

// Logout functionality
document.getElementById('logout').addEventListener('click', async () => {
  try {
    await signOut(auth);
    console.log('Logged out successfully!');
    window.location.href = '/index.html'; // Redirect to home or login page
  } catch (error) {
    console.error('Logout Error:', error);
  }
});
