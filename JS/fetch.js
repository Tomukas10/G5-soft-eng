let currentRoomId;

// #####################################################################
//                          Get Token
// #####################################################################

function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html"; // Redirect if not logged in
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload; // Contains { id, name, user_type }
    } catch (err) {
        console.error("Error decoding token:", err);
        return null;
    }
}

// #####################################################################
//                          FETCH ROOMS
// #####################################################################

async function fetchRooms() {
    try {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        const response = await fetch('/houses/rooms', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
            }
        });

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
        currentRoomId = roomId;
        console.log(currentRoomId);
        const response = await fetch(`/houses/1/rooms/${roomId}/devices`); // Assuming roomId is passed and using house_id as 1
        if (!response.ok) {
            throw new Error('Failed to fetch devices');
        }

        const devices = await response.json(); // Parse devices JSON from server
        
        const mainPanel = document.getElementById("mainPanel");
        
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
            loadUnassignedDevices();
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

    // If user confirms, delete the room and update devices
    confirmButton.addEventListener('click', async () => {
        try {
            // Step 1: Set room_id to NULL for all devices in this room
            await fetch(`rooms/${roomId}/devices`, { // Replace 1 with actual house_id
                method: 'PATCH', // Use PATCH for updating
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_id: null }) // Set to null
            });

            // Step 2: Delete the room
            await fetch(`/rooms/${roomId}`, { // Replace 1 with actual house_id
                method: 'DELETE'
            });

            // Close the modal and remove the room button from the UI
            modal.style.display = 'none';
            button.remove();
        } catch (error) {
            console.error('Error deleting room or updating devices:', error);
            alert('Failed to delete room. Please try again.');
        }
    });

    // If user cancels, just close the modal
    cancelButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}


// #####################################################################
//                          LOAD UNASSIGNED DEVICES
// #####################################################################

async function loadUnassignedDevices() {
    try {
        const response = await fetch('/devices/unassigned');
        if (!response.ok) throw new Error('Failed to fetch devices');

        const devices = await response.json();
        const dropdown = document.getElementById('deviceDropdown');

        // Clear existing options except the placeholder
        dropdown.innerHTML = '<option value="">Select a device</option>';

        // Populate the dropdown with unassigned devices

        devices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.id;
            option.textContent = device.name;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading unassigned devices:', error);
    }
}

// #####################################################################
//                              FETCH HOUSES
// #####################################################################

async function fetchHouses() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error("No token found. User might be logged out.");
            return;
        }

        console.log("Fetching houses with token:", token);

        const response = await fetch('/houses', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text(); // Get error details from response
            throw new Error(`Failed to fetch houses: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const houses = await response.json();
        console.log("Fetched houses:", houses);
        return houses;

    } catch (error) {
        console.error('Error fetching houses:', error);
    }
}



// #####################################################################
//                          ASSIGN DEVICE TO ROOM
// #####################################################################

async function assignDeviceToRoom(roomId) {
    const dropdown = document.getElementById('deviceDropdown');
    const selectedDeviceId = dropdown.value;

    if (!selectedDeviceId) {
        alert('Please select a device.');
        return;
    }

    try {
        // Send a request to update the device with the current room_id
        const response = await fetch(`/devices/${selectedDeviceId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room_id: roomId })
        });

        if (!response.ok) throw new Error('Failed to update device');

        fetchDevices(roomId);
        loadUnassignedDevices()
    } catch (error) {
        console.error('Error assigning device to room:', error);
    }
}

// ################################################################################################# //
// ################################################################################################# //
// ################################################################################################# //

document.addEventListener("DOMContentLoaded", () => {

const user = getUserFromToken();
console.log(user);
if (user) {
    document.getElementById("homeTitle").textContent = `Welcome, ${user.email}`;
    
    if (user.user_type === "landlord") {
       fetchHouses();
    } else if (user.user_type === "user") {
        fetchRooms();
    }
}

document.getElementById('selected').addEventListener("click", () => {
    document.getElementById('homeTitle').innerHTML = 'Dashboard';
    if (user.user_type === "landlord") {
        fetchHouses();
     } else if (user.user_type === "user") {
        fetchRooms();
     }
})

// Fetch rooms when the page loads
fetchRooms();

    // Add Room Button Click Event
    const createRoomButton = document.getElementById("createRoomButton");
    const cancelRoomButton = document.getElementById("cancelRoomButton");
    const cancelDeviceButton = document.getElementById("cancelDeviceButton");
    const roomNameInput = document.getElementById("roomName");

    cancelRoomButton.addEventListener("click", () => {
        addRoomModal.style.display = "none"; // Hide the modal
        roomNameInput.value = ""; // Clear input
    });

    cancelDeviceButton.addEventListener("click", () => {
        addDeviceModal.style.display = "none"; // Hide the modal
    });

    createRoomButton.addEventListener("click", async () => {
        const roomName = roomNameInput.value.trim();
        
        if (roomName) {
            try {
                const token = localStorage.getItem('token');  // Retrieve token from localStorage
                const response = await fetch('/houses/rooms', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
                    }
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch rooms');
                }
                const rooms = await response.json();
                console.log(rooms);
    
                // Check if the room name already exists
                const roomExists = rooms.some(room => room.name.toLowerCase() === roomName.toLowerCase());
                
                if (roomExists) {
                    alert("Room name already in use. Please choose a different name.");
                    return; // Prevent further execution if room name is taken
                }
    
                // Send the new room data to the server
                const newRoom = {
                    name: roomName
                };
    
                await fetch('/houses/1/rooms', { // Use actual house_id
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
            } catch (error) {
                console.error('Error fetching rooms:', error);
                const mainPanel = document.getElementById('mainPanel');
                mainPanel.innerHTML = '<p>Error loading rooms. Please try again later.</p>';
            }
        } else {
            alert('Please enter a room name.');
        }
    });

    const deviceInput = document.getElementById('deviceName');

    // Attach event listener to the Add Device button
    document.getElementById('confirmDeviceButton').addEventListener('click', () => {
        assignDeviceToRoom(currentRoomId);
        addDeviceModal.style.display = 'none';
    });

    function swapCSS() {
        const linkElement = document.getElementById("main");
        if (linkElement.href = "../css/home1.css") {
            linkElement.href = "../css/accessability.css";
        } else if (linkElement.href = "../css/accessability.css") {
            linkElement.href = "../css/home1.css";
        }
    }
    
    const swap = document.getElementById('swap');
    swap.addEventListener("click", function(event) {
        swapCSS(); 
    });


 
});




