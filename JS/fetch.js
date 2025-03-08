
document.addEventListener("DOMContentLoaded", () => {
async function fetchRooms() {
    try {
        const response = await fetch('/houses/1/rooms'); // Replace 1 with the house ID
        if (!response.ok) {
            throw new Error('Failed to fetch rooms');
        }
        const rooms = await response.json();

        // Get the rooms container
   /*     const roomsContainer = document.getElementById('boxes');
                        // Add the "Add Room" button
                        const addRoomButton = document.createElement('button');
                        addRoomButton.className = 'roomButton';
                        addRoomButton.id = 'addRoomButton';
                
                        // Add the plus sign
                        const plusSign = document.createElement('span');
                        plusSign.className = 'plus-sign';
                        plusSign.textContent = '+';
                
                        // Add the button text
                        const buttonText = document.createElement('span');
                        buttonText.className = 'button-text';
                        buttonText.textContent = 'Add Room';
                
                        // Append the plus sign and button text to the button
                        addRoomButton.appendChild(plusSign);
                        addRoomButton.appendChild(buttonText);
                
                        // Append the "Add Room" button to the rooms container
                        roomsContainer.appendChild(addRoomButton); */


        // Add a button for each room
        rooms.forEach(room => {
            const button = document.createElement('button');
            button.className = 'roomButton';
            const addRoomButton = document.getElementById("addRoomButton");


            // Add an icon
            const icon = document.createElement('img');
            icon.className = 'icon';
            icon.src = `./images/${room.name.toLowerCase().replace(' ', '-')}.png`; // Dynamic icon path
            icon.alt = `${room.name} Icon`;

            // Add the room name
            const roomName = document.createTextNode(room.name);

            // Append the icon and room name to the button
            button.appendChild(icon);
            button.appendChild(roomName);

            // Append the button to the rooms container
            document.getElementById("boxes").insertBefore(button, addRoomButton);
        });


    } catch (error) {
        console.error('Error fetching rooms:', error);
        const roomsContainer = document.getElementById('boxes');
        roomsContainer.innerHTML = '<p>Error loading rooms. Please try again later.</p>';
    }
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
                name: name
            };
    
            await fetch('/houses/1/rooms', { // Use actual houseId
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRoom)
            });
    
            // Create the new room button element
            const newRoomButton = document.createElement("button");
            newRoomButton.className = "roomButton"; // Add the same class as existing buttons
            newRoomButton.innerHTML = `
                <img class="icon" src="./images/${room.name.toLowerCase().replace(' ', '-')}.png" alt="${name} Icon">
                ${name}
            `;
    
            // Insert the new room button before the "Add Room" button
            document.getElementById("boxes").insertBefore(newRoomButton, addRoomButton);
    
            // Hide the modal and clear the input
            addRoomModal.style.display = "none";
            roomNameInput.value = "";
        } else {
            alert("Please enter a room name.");
        }
    });
});

                // Fetch users from the API and display them
/*async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();

        // Get the user list element
        const userList = document.getElementById('user-list');

        // Clear any existing content
        userList.innerHTML = '';

        // Add each user to the list
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.fname} (${user.Email})`;
            userList.appendChild(li);
        });
                // Re-add the "Add Room" button after all rooms
                const addRoomButton = document.getElementById('addRoomButton');
                roomContainer.appendChild(addRoomButton);
    } catch (error) {
        console.error('Error fetching users:', error);
        const userList = document.getElementById('user-list');
        userList.innerHTML = '<li>Error loading users. Please try again later.</li>';
    }
}

// Fetch users when the page loads
fetchUsers(); */