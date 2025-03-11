
document.addEventListener("DOMContentLoaded", () => {
    async function fetchRooms() {
        try {
            const response = await fetch('/houses/1/rooms'); // Replace 1 with the house ID
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const rooms = await response.json();
    
            const addRoomButton = document.getElementById("addRoomButton");
            const roomsContainer = document.getElementById("boxes");
    
            // Clear existing rooms (to avoid duplicates on reload)
            roomsContainer.innerHTML = "";
            roomsContainer.appendChild(addRoomButton); // Re-add "Add Room" button
    
            // Add a button for each room
            rooms.forEach(room => {
                const button = document.createElement('div'); // Change to div for better layout control
                button.className = 'roomButton';
                button.setAttribute('data-id', room.id);
    
                // Add an icon
                const icon = document.createElement('img');
                icon.className = 'icon';
                icon.src = `./images/${room.name.toLowerCase().replace(' ', '-')}.png`; // Dynamic icon path
                icon.alt = `${room.name} Icon`;
    
                // Add the room name
                const roomName = document.createElement('span');
                roomName.textContent = room.name;
    
                // Add the delete button
                const deleteButton = document.createElement('span');
                deleteButton.className = 'deleteRoom';
                deleteButton.innerHTML = '&times;';
                deleteButton.setAttribute('data-id', room.id);
    
                // Add delete event listener
                deleteButton.addEventListener('click', async (event) => {
                    event.stopPropagation(); // Prevent triggering other button events
                    const roomId = event.target.getAttribute('data-id');
                    deleteRoom(roomId, button);

                });
    
                // Append elements to the button
                button.appendChild(deleteButton);
                button.appendChild(icon);
                button.appendChild(roomName);
    
                // Insert the new room button before the "Add Room" button
                roomsContainer.insertBefore(button, addRoomButton);
            });
    
        } catch (error) {
            console.error('Error fetching rooms:', error);
            const roomsContainer = document.getElementById('boxes');
            roomsContainer.innerHTML = '<p>Error loading rooms. Please try again later.</p>';
        }
    }
    
    async function deleteRoom(roomId, button) {
    
        // Show the confirmation modal
        const modal = document.getElementById('confirmationModal');
        const confirmButton = document.getElementById('confirmDelete');
        const cancelButton = document.getElementById('cancelDelete');

        modal.style.display = 'flex'; // Show the modal

        // If user confirms, delete the room
        confirmButton.addEventListener('click', async () => {
            await fetch(`/houses/1/rooms/${roomId}`, { // Replace 1 with actual houseId
                method: 'DELETE'
            });

            // Close the modal and remove the room button from the UI
            modal.style.display = 'none';
            button.remove();
        });

        // If user cancels, just close the modal
        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

// Fetch rooms when the page loads
fetchRooms();

    // Check if user is logged in
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "login.html"; // Send back to login page
    }

    // Add Room Button Click Event
    const addRoomButton = document.getElementById("addRoomButton");
    const addRoomModal = document.getElementById("addRoomModal");
    const createRoomButton = document.getElementById("createRoomButton");
    const cancelRoomButton = document.getElementById("cancelRoomButton");
    const roomNameInput = document.getElementById("roomName");

    addRoomButton.addEventListener("click", () => {
        addRoomModal.style.display = "block"; // Show the modal
    });

    cancelRoomButton.addEventListener("click", () => {
        addRoomModal.style.display = "none"; // Hide the modal
        roomNameInput.value = ""; // Clear input
    });

    createRoomButton.addEventListener("click", async () => {
        const roomName = roomNameInput.value.trim();
        if (roomName) {
            // Fetch the next available room ID from the server
            const response = await fetch('/houses/1/nextRoomId'); // Use actual houseId
            const data = await response.json();
            const id = data.nextRoomId;
    
            // Send the new room data to the server
            const newRoom = {
                id: id,
                name: roomName
            };
    
            await fetch('/houses/1/rooms', { // Use actual houseId
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRoom)
            });
    
        fetchRooms();
    
            // Hide the modal and clear the input
            addRoomModal.style.display = "none";
            roomNameInput.value = "";
        } else {
            alert("Please enter a room name.");
        }
    });
});
