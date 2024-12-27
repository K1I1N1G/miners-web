import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
        import { getFirestore, getDocs, collection, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

        const firebaseConfig = {
            apiKey: "AIzaSyB2kBEgcUQH2s3b0n1JylU4Ji0KV1sF1_s",
            authDomain: "mining-site-2024.firebaseapp.com",
            projectId: "mining-site-2024",
            storageBucket: "mining-site-2024.appspot.com",
            messagingSenderId: "448522786959",
            appId: "1:448522786959:web:8e641ed59539df7caab8fa"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Global variable to hold assignments
        let allAssignments = [];

        // Function to fetch assignments and display them
        async function fetchAssignments() {
            try {
                const assignmentsSnapshot = await getDocs(collection(db, 'assignments'));
                const assignmentList = document.getElementById('assignment-list');
                assignmentList.innerHTML = ''; // Clear the list before adding new items

                if (assignmentsSnapshot.empty) {
                    assignmentList.innerHTML = '<p>No assignments found in the collection.</p>';
                    return;
                }

                allAssignments = []; // Reset global assignments array
                assignmentsSnapshot.forEach(doc => {
                    const assignment = { id: doc.id, ...doc.data() }; // Store the document ID with the data
                    allAssignments.push(assignment);
                    displayAssignment(assignment);
                });
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        }

        // Function to display a single assignment
        function displayAssignment(assignment) {
            const assignmentList = document.getElementById('assignment-list');
            const listItem = document.createElement('div');
            listItem.classList.add('assignment', assignment.completionStatus ? 'completed' : 'incomplete');

            listItem.innerHTML = ` 
                <h3>Assignment ID: ${assignment.assignmentId}</h3>
                <p>Assigned To: ${assignment.assignedTo}</p>
                <p>Title: ${assignment.title}</p>
                <p>Description: ${assignment.description}</p>
                ${assignment.completionStatus ? ` 
                    <p>Completed By: ${assignment.completedBy}</p>
                    <p>Completion ID: ${assignment.completionId}</p>
                ` : ` 
                    <label for="completedBy-${assignment.id}">Completed By:</label>
                    <input type="text" id="completedBy-${assignment.id}" placeholder="Enter completed by" />
                    <label for="completionId-${assignment.id}">Completion ID:</label>
                    <input type="text" id="completionId-${assignment.id}" placeholder="Enter completion ID" />
                `}
                <label>
                    <input type="checkbox" id="completionStatus-${assignment.id}" ${assignment.completionStatus ? 'checked' : ''} /> Completion Status
                </label>
                <button onclick="updateAssignment('${assignment.id}')">Update Assignment</button>
            `;

            assignmentList.appendChild(listItem);
        }

        // Function to update assignment details
        window.updateAssignment = async function(id) {
            const completedBy = document.getElementById(`completedBy-${id}`)?.value || null;
            const completionId = document.getElementById(`completionId-${id}`)?.value || null;
            const completionStatus = document.getElementById(`completionStatus-${id}`).checked;

            try {
                await updateDoc(doc(db, 'assignments', id), {
                    completedBy: completionStatus ? completedBy : null,
                    completionId: completionStatus ? completionId : null,
                    completionStatus: completionStatus
                });
                alert('Assignment updated successfully!');
                window.location.reload(); // Refresh to see changes
            } catch (error) {
                console.error('Error updating assignment:', error);
                alert('Failed to update assignment. Please try again.');
            }
        };

        // Function to filter assignments by the current user
        window.filterByCurrentUser = function() {
            const currentUserId = "USER_UID"; // Replace with logic to get the current user's UID
            const currentUserAssignments = allAssignments.filter(assignment => assignment.assignedTo === currentUserId);
            displayFilteredAssignments(currentUserAssignments);
        };

        // Function to filter assignments and show only pending ones for the current user
        window.filterPendingAssignments = function() {
            const currentUserId = "USER_UID"; // Replace with logic to get the current user's UID
            const pendingAssignments = allAssignments.filter(assignment => 
                assignment.assignedTo === currentUserId && !assignment.completionStatus
            );
            displayFilteredAssignments(pendingAssignments);
        };

        // Function to display filtered assignments
        function displayFilteredAssignments(assignments) {
            const assignmentList = document.getElementById('assignment-list');
            assignmentList.innerHTML = ''; // Clear the list before adding new items

            if (assignments.length === 0) {
                assignmentList.innerHTML = '<p>No assignments found based on the filter.</p>';
                return;
            }

            assignments.forEach(assignment => {
                displayAssignment(assignment);
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            fetchAssignments(); // Fetch assignments on page load
        });