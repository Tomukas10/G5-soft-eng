// #####################################################################
//                          FETCH ROOMS
// #####################################################################

async function fetchRooms() {
    try {
        const response = await fetch('/houses/1/rooms'); // Replace 1 with the house ID
        if (!response.ok) {
            throw new Error('Failed to fetch rooms');
        }
        const rooms = await response.json();

        const mainPanel = document.getElementById('mainPanel');
        const title = document.getElementById('homeTitle')
        
        mainPanel.innerHTML = "";

        const button = document.createElement('button');
        button.classList.add('roomButton');
        button.id = 'addRoomButton';
    
        // Create the plus-sign span
        const plusSign = document.createElement('span');
        plusSign.classList.add('plus-sign');
        plusSign.textContent = '+';
    
        // Create the button-text span
        const buttonText = document.createElement('span');
        buttonText.classList.add('button-text');
        buttonText.textContent = 'Add Room';
    
        // Append the spans to the button
        button.appendChild(plusSign);
        button.appendChild(buttonText);
    
        // Append the button to the container
        mainPanel.appendChild(button);

        
    const addRoomModal = document.getElementById("addRoomModal");
        addRoomButton.addEventListener("click", () => {
            addRoomModal.style.display = "block"; // Show the modal
        });

        // Add a button for each room
        rooms.forEach(room => {
            const button = document.createElement('div'); // Change to div for better layout control
            button.className = 'roomButton';
            button.setAttribute('data-id', room.id);
            button.setAttribute('data-name', room.name);

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
                event.stopPropagation(); 
                const roomId = event.target.getAttribute('data-id');
                deleteRoom(roomId, button);

            });

            // Add event listener to take user to room devices
            button.addEventListener('click', async (event) => {    
                event.stopPropagation(); 
                const roomId = event.currentTarget.getAttribute('data-id');   
                title.innerHTML = event.currentTarget.getAttribute('data-name'); 
                    fetchDevices(roomId);
            });

            button.appendChild(deleteButton);
            button.appendChild(icon);
            button.appendChild(roomName);

            mainPanel.insertBefore(button, addRoomButton);
        });

    } catch (error) {
        console.error('Error fetching rooms:', error);
        const mainPanel = document.getElementById('mainPanel');
        mainPanel.innerHTML = '<p>Error loading rooms. Please try again later.</p>';
    }
}

// #####################################################################
//                          FETCH DEVICES
// #####################################################################

async function fetchDevices(roomId) {
    try {
        const response = await fetch(`/houses/1/rooms/${roomId}/devices`); // Assuming roomId is passed and using houseId as 1
        if (!response.ok) {
            throw new Error('Failed to fetch devices');
        }

        const devices = await response.json(); // Parse devices JSON from server
        
        const mainPanel = document.getElementById("mainPanel");
        const title = document.getElementById("homeTitle");
        
        mainPanel.innerHTML = ""; // Clears the existing appliance list

        const appliancesContainer = document.createElement('div');
        appliancesContainer.id = 'appliances-container';

        const divider = document.createElement("div");
        divider.id = 'divider';

        const rightPanel = document.createElement("div");
        rightPanel.id = 'right-panel';

        mainPanel.appendChild(appliancesContainer);
        mainPanel.appendChild(divider);
        mainPanel.appendChild(rightPanel);

        // Create add new appliance button
        const button = document.createElement('button');
        button.classList.add('appliance');
        button.id = 'addDeviceButton';
    
        // Create the plus-sign span
        const plusSign = document.createElement('span');
        plusSign.classList.add('plus-sign');
        plusSign.textContent = '+';
    
        // Append the spans to the button
        button.appendChild(plusSign);

        // Append the button to the container
        appliancesContainer.appendChild(button);

        const addDeviceModal = document.getElementById("addDeviceModal");
        addDeviceButton.addEventListener("click", () => {
            addDeviceModal.style.display = "block"; // Show the modal
        });

        // Display the devices
        devices.forEach(device => {
            const deviceButton = document.createElement("button");
            deviceButton.className = 'appliance';
            deviceButton.innerHTML = `
                ${device.name}
            `;
            appliancesContainer.insertBefore(deviceButton, addDeviceButton);
        });

    } catch (error) {
        console.error('Error fetching devices:', error);
    }
}

function handleRoomButtonClick(event) {
    const roomId = event.target.getAttribute('data-id');
}

// #####################################################################
//                          DELETE ROOMS
// #####################################################################

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

// ################################################################################################# //
// ################################################################################################# //
// ################################################################################################# //

document.addEventListener("DOMContentLoaded", () => {


// Fetch rooms when the page loads
fetchRooms();

    // Check if user is logged in
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "login.html"; // Send back to login page
    }

    // Add Room Button Click Event
    const createRoomButton = document.getElementById("createRoomButton");
    const cancelRoomButton = document.getElementById("cancelRoomButton");
    const roomNameInput = document.getElementById("roomName");


    cancelRoomButton.addEventListener("click", () => {
        addRoomModal.style.display = "none"; // Hide the modal
        roomNameInput.value = ""; // Clear input
    });

    createRoomButton.addEventListener("click", async () => {
        const roomName = roomNameInput.value.trim();
        
        if (roomName) {
            // Fetch all rooms under the current house ID (replace 1 with the actual houseId)
            const roomsResponse = await fetch('/houses/1/rooms'); // Fetch rooms for house ID
            const rooms = await roomsResponse.json();
    
            // Check if the room name already exists
            const roomExists = rooms.some(room => room.name.toLowerCase() === roomName.toLowerCase());
            
            if (roomExists) {
                alert("Room name already in use. Please choose a different name.");
                return; // Prevent further execution if room name is taken
            }
    
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
            alert('Please enter a room name.');
        }
    });
});

<<<<<<< HEAD
function swapCSS(cssFile) {
    const linkElement = document.getElementById("theme-link");
    if (linkElement) {
        linkElement.href = cssFile;
    } else {
        console.error("Link element with id 'theme-link' not found.");
    }
}
=======

>>>>>>> d1698d729440daf1faa26ecd4ce479b13301f3b1
