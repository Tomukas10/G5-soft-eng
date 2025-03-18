let currentRoomId;

// #####################################################################
//                          GET TOKEN
// #####################################################################

function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html"; // Redirect if not logged in
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            alert("Token is expired, please log in again")
            window.location.href = "login.html"; // Redirect if not logged in
            return null;
        }
        return payload; // Contains { id, name, user_type }
    } catch (err) {
        console.error("Error decoding token:", err);
        return null;
    }
}

// #####################################################################
//                          VALIDATE EMAIL
// #####################################################################

function validateEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailPattern.test(email);
    
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
        
        mainPanel.innerHTML = "<div id=roomContainer></div>";
        const roomContainer = document.getElementById("roomContainer");

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
        roomContainer.appendChild(button);

        // Create add new appliance button
        const Devbutton = document.createElement('button');
        Devbutton.textContent = 'Add Device';
        Devbutton.style.fontSize = '2vh';
        Devbutton.style.display = 'block';
        Devbutton.style.height = '10vh';
        Devbutton.style.width = '10vw';
        Devbutton.style.float = 'right';
        Devbutton.style.marginTop = '10vh';
        Devbutton.classList.add('appliance');
        Devbutton.id = 'addNewDeviceButton';
        if(addDevicearea.childElementCount == 0) {   
             addDevicearea.appendChild(Devbutton);
        }
        const addNewDeviceModal = document.getElementById("addNewDeviceModal");
        Devbutton.addEventListener("click", () => {
            addNewDeviceModal.style.display = "block"; // Show the modal
        });

        
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

            roomContainer.insertBefore(button, addRoomButton);
        });

    } catch (error) {
        console.error('Error fetching rooms:', error);
        const mainPanel = document.getElementById('mainPanel');
        mainPanel.innerHTML = '<p>Error loading rooms. Please try again later.</p>';
    }
}

// #####################################################################
//                              FETCH HOUSES
// #####################################################################

async function fetchHouses() {
    try {
        const cancelButton = document.getElementById('cancelHouseButton');
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error("No token found. User might be logged out.");
            return;
        }

        const response = await fetch('/houses', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get error details from response
            throw new Error(`Failed to fetch houses: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const houses = await response.json();

        const mainPanel = document.getElementById('mainPanel');
        mainPanel.innerHTML = '';

        const button = document.createElement('button');
        button.classList.add('houseButton');
        button.id = 'addHouseButton';

        // Create the plus-sign span
        const plusSign = document.createElement('span');
        plusSign.classList.add('plus-sign');
        plusSign.textContent = '+';

        // Create the button-text span
        const buttonText = document.createElement('span');
        buttonText.classList.add('button-text');
        buttonText.textContent = 'Add House';

        //add logout button
        const logout = document.getElementById("logout");
        logout.style.display = "block";
        
        // Append the spans to the button
        button.appendChild(plusSign);
        button.appendChild(buttonText);

        // Append the button to the container
        mainPanel.appendChild(button);
const addHouseButton = document.getElementById('addHouseButton');
    
const addHouseModal = document.getElementById("addHouseModal");
    addHouseButton.addEventListener("click", () => {
        addHouseModal.style.display = "block"; // Show the modal
    });

    cancelButton.addEventListener('click', () => {
        addHouseModal.style.display = 'none';
    });

    const houseNameInput = document.getElementById("houseName")
    const houseAddressInput = document.getElementById("houseAddress")
    
    createHouseButton.addEventListener("click", async () => {
        const houseName = houseNameInput.value.trim();
        const address = houseAddressInput.value.trim();
       addHouse(houseName, address);
       houseNameInput.value = "";
       houseAddressInput.value = "";
    });

    // Add a button for each room
    houses.forEach(house => {
        const button = document.createElement('div'); // Change to div for better layout control
        button.className = 'houseButton';
        button.setAttribute('data-id', house.id);
        button.setAttribute('data-name', house.name);

        // Add an icon
        const icon = document.createElement('img');
        icon.className = 'icon';
        icon.src = `./images/house_icon.png`;
        icon.alt = `House Icon`;

        // Add the room name
        const houseName = document.createElement('span');
        houseName.textContent = house.name;

        // Add the delete button
        const deleteButton = document.createElement('span');
        deleteButton.className = 'deleteRoom';
        deleteButton.innerHTML = '&times;';
        deleteButton.setAttribute('data-id', house.id);

        // Add delete event listener
        deleteButton.addEventListener('click', async (event) => {
            event.stopPropagation(); 
            const houseId = event.target.getAttribute('data-id');
            deleteHouse(houseId, button);

        });

        // Add event listener to take user to house information
        button.addEventListener('click', async (event) => {    
            event.stopPropagation(); 
            const houseId = event.currentTarget.getAttribute('data-id');   
            document.getElementById('homeTitle').innerHTML = event.currentTarget.getAttribute('data-name'); 
                fetchCurrentHouse(houseId);
        });

        button.appendChild(deleteButton);
        button.appendChild(icon);
        button.appendChild(houseName);

        mainPanel.insertBefore(button, addHouseButton);
        
   
    });

    } catch (error) {
        console.error('Error fetching houses:', error);
    }
}

// #####################################################################
//                              FETCH CURRENT HOUSE
// #####################################################################

async function fetchCurrentHouse(houseId) {

try {
    const token = localStorage.getItem('token');  // Retrieve token from localStorage
    const houseResponse = await fetch(`/houses/${houseId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
        }
    });

    if (!houseResponse.ok) {
        throw new Error('Failed to fetch house');
    }
        const userResponse = await fetch(`/houses/${houseId}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    
        if (!userResponse.ok) {
            throw new Error('Failed to fetch users');
        }

        const house = await houseResponse.json(); // Parse devices JSON from server
        const users = await userResponse.json(); // Parse devices JSON from server

    
    const mainPanel = document.getElementById("mainPanel");
    
    mainPanel.innerHTML = ""; // Clears the existing appliance list

    mainPanel.innerHTML=`
                            <div id="appliances-container">
                                <h3>List of Tenants</h3>
                            </div>
                            <div id="divider"></div>
                            <div id="right-panel"></div>`

    document.getElementById("right-panel").innerHTML=`<h1>${house.address}</h1><br><br>
                                                        Invite tenant to house:
                                                        <input type="text" id="tenantEmail" class="inputBox" placeholder="Tenant Email">
                    <button id="inviteTenantButton" class="confirmButton">Invite</button>`;

                inviteTenantButton.addEventListener("click", async () => {
                    const tenantEmailInput = document.getElementById("tenantEmail").value.trim().toLowerCase();
                    if (!validateEmail(tenantEmailInput)) {
                    document.getElementById("tenantEmail").value = "";
                    } 
                    const result = await inviteTenant(tenantEmailInput);
                    if (result) {
                      alert("Tenant Invited");
                    }
           });

    const appliancesContainer = document.getElementById(`appliances-container`);


    // Display the users
        users.forEach( user => {
        const userTab = document.createElement("button");
        userTab.className = 'appliance';
        userTab.innerHTML = `${user.name} <br> ${user.email}`;

        // Add the delete button
        const deleteButton = document.createElement('span');
        deleteButton.className = 'deleteRoom';
        deleteButton.innerHTML = '&times;';
        deleteButton.setAttribute('data-id', user.id);

        // Add delete event listener
        deleteButton.addEventListener('click', async (event) => {
            event.stopPropagation(); 
            const userId = event.target.getAttribute('data-id');
            removeUser(userId, userTab);

        });
        userTab.appendChild(deleteButton);
        appliancesContainer.appendChild(userTab);

        });

} catch (error) {
    console.error('Error fetching users:', error);
}
}

function handleHouseButtonClick(event) {
const roomId = event.target.getAttribute('data-id');
}

// #####################################################################
//                          INVITE TENANT
// #####################################################################

async function inviteTenant(tenantEmail) {
    try {
        const response = await fetch(`/users/${tenantEmail}`, {
            method: 'GET',
        })
    const tenant = await response.json(); 

    if (tenant.user_type === 'landlord') {
        alert("User not a tenant");
        return false;
    } 

    if (tenant.house_id) {
        alert("User already assigned to a house");
        return false;
    }

    const token = localStorage.getItem(`token`);
    await fetch(`/users/${tenantEmail}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return true;

    } catch (error) {
        console.error('Error inviting tenant:', error);
        alert("Email not found");
    }
}

// #####################################################################
//                              LOAD TENANT INVITE
// #####################################################################

async function loadInvitedTenant(inviteId) {

const inviteResponse = await fetch(`/users/landlordName/${inviteId}`);
const invite = await inviteResponse.json();
return invite;

}

// #####################################################################
//                              HANDLE INVITE
// #####################################################################

async function handleInvite(accept) {
    try {
        const token = localStorage.getItem('token');
        const user = getUserFromToken();
        const landlordId = user.invite;

        const response = await fetch(`/users/invite/${landlordId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accept })

        });
        const { token: newToken } = await response.json();
        localStorage.setItem('token', newToken);

        user.invite = null;
    } catch (error) {
        console.error("Error handling invite", error);
    }
}


// #####################################################################
//                              ADD HOUSE
// #####################################################################

async function addHouse(houseName, houseAddress) {
    if (houseName.trim() && houseAddress.trim()) {
        try {
            const token = localStorage.getItem('token');  // Retrieve token from localStorage
            if (!token) {
                alert('User is not authenticated.');
                return;
            }

            // Fetch existing houses
            const response = await fetch('/houses', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch houses');
            }

            const houses = await response.json();

            // Check if the house name already exists 
            const houseExists = houses.some(house => 
                house.name.toLowerCase() === houseName.toLowerCase() ||
                house.address.toLowerCase() === houseAddress.toLowerCase()
            );

            if (houseExists) {
                alert("House name or address already in use. Please choose different values.");
                return; // Exit if house name or address is taken
            }

            // Prepare the new house data
            const newHouse = {
                name: houseName,
                address: houseAddress
            };

            // Send the new house data to the server
            const addResponse = await fetch('/houses', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newHouse)
            });

            if (!addResponse.ok) {
                throw new Error('Failed to add new house');
            }

            // Refresh the house list
            await fetchHouses();

            // Hide the modal and clear the input
            const addHouseModal = document.getElementById("addHouseModal");
            addHouseModal.style.display = "none";
            document.getElementById('houseName').value = '';
            document.getElementById('houseAddress').value = '';

        } catch (error) {
            console.error('Error adding house:', error);
            const mainPanel = document.getElementById('mainPanel');
            mainPanel.innerHTML = '<p>Error loading houses. Please try again later.</p>';
        }
    } else {
        alert('Please enter a house name and address.');
    }
}

// #####################################################################
//                              ADD DEVICE
// #####################################################################

async function addDevice(DeviceName) {
    if (DeviceName.trim()) {
        try {
            const token = localStorage.getItem('token');  // Retrieve token from localStorage
            if (!token) {
                alert('User is not authenticated.');
                return;
            }

            // Fetch existing devices
            const response = await fetch('/devices', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch device');
            }

            const devices = await response.json();

            // Check if the device name already exists 
            const deviceExists = devices.some(devices => 
                devices.name.toLowerCase() === DeviceName.toLowerCase()
            );

            if (deviceExists) {
                alert("device name already in use.");
                return; 
            }

            // Prepare the new device data
            const newDevice = {
                name: DeviceName,
                type: "device",
                room_id: null,
                powerUsage: 20,
                state: 0,
            };

            // Send the new device data to the server
            const addResponse = await fetch('/devices', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDevice)
            });
           

            if (!addResponse.ok) {
                throw new Error('Failed to add new device');
            } else {
                alert("device added successfully");
            }


            // Hide the modal and clear the input
            const addNewDeviceModal = document.getElementById("addNewDeviceModal");
            addNewDeviceModal.style.display = "none";
            document.getElementById('newDeviceInput').value = '';

        } catch (error) {
            console.error('Error adding device:', error);
            document.getElementById('addDevicearea').innerHTML = '<p>Error loading device. Please try again later.</p>';
        }
    } else {
        alert('Please enter a device');
    }
}


// #####################################################################
//                          FETCH DEVICES
// #####################################################################

async function fetchDevices(roomId) {
    try {
        currentRoomId = roomId;
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        const response = await fetch(`/houses/houseId/rooms/${roomId}/devices`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch rooms');
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
        devices.forEach( device => {
            const deviceButton = document.createElement("button");
            deviceButton.className = 'appliance';
            deviceButton.innerHTML = `${device.name}`;
    
            // Add the delete button
            const deleteButton = document.createElement('span');
            deleteButton.className = 'deleteRoom';
            deleteButton.innerHTML = '&times;';
            deleteButton.setAttribute('data-id', device.id);
    
            // Add delete event listener
            deleteButton.addEventListener('click', async (event) => {
                event.stopPropagation(); 
                const deviceId = event.target.getAttribute('data-id');
                deleteDevice(deviceId, deviceButton);
    
            });
            deviceButton.appendChild(deleteButton);
            appliancesContainer.insertBefore(deviceButton, button);
    
            });

    } catch (error) {
        console.error('Error fetching devices:', error);
    }
}

function handleRoomButtonClick(event) {
    const roomId = event.target.getAttribute('data-id');
}

// #####################################################################
//                          DELETE DEVICES
// #####################################################################
 
async function deleteDevice(deviceId, button) {
 
    // Show the confirmation modal
    const deviceConfirmationModal = document.getElementById('deviceConfirmationModal');
    const confirmButton = document.getElementById('confirmDeviceDelete');
    const confirmPermaButton = document.getElementById('confirmPermaDelete');
    const cancelButton = document.getElementById('cancelDeviceDelete');
    const deleteTextDevice = document.getElementById('deleteTextDevice');
 
    deleteTextDevice.innerHTML = 'Are you sure you want to delete this device?';
    deviceConfirmationModal.style.display = 'block';
    // If user confirms, delete the device and update devices
    confirmButton.addEventListener('click', async () => {
        try {
            // Delete the device
            await fetch(`/rooms/${deviceId}`, {
                method: 'PATCH'
            });
            // Close the modal and remove the room button from the UI
            deviceConfirmationModal.style.display = 'none';
            button.remove();
        } catch (error) {
            console.error('Error deleting room or updating devices:', error);
            alert('Failed to delete room. Please try again.');
        }
        
    });
 
    confirmPermaButton.addEventListener('click', async () => {
        try {
            // Delete the device permamnently 
            await fetch(`/devices/${deviceId}`, {
                method: 'DELETE'
            });
 
            // Close the modal and remove the room button from the UI
            deviceConfirmationModal.style.display = 'none';
            button.remove();
        } catch (error) {
            console.error('Error deleting device', error);
            alert('Failed to delete device. Please try again.');
        }
    });

    // If user cancels, just close the modal
    cancelButton.addEventListener('click', () => {
        deviceConfirmationModal.style.display = 'none';
    });

}

// #####################################################################
//                          DELETED HOUSE
// #####################################################################

async function deleteHouse(houseId, button) {
    // Show the confirmation modal
    const modal = document.getElementById('confirmationModal');
    const confirmButton = document.getElementById('confirmDelete');
    const cancelButton = document.getElementById('cancelDelete');
    const deleteText = document.getElementById('deleteText');

    deleteText.innerHTML = 'Are you sure you want to delete this house?';
    modal.style.display = 'flex'; // Show the modal

    // If user confirms, delete the house and unassign devices
    confirmButton.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication error. Please log in again.');
                return;
            }

            // Delete the house
            const deleteResponse = await fetch(`/houses/${houseId}`, {
                method: 'DELETE',
            });

            if (!deleteResponse.ok) {
                throw new Error('Failed to delete house');
            }

            // Step 3: Update UI - remove house button and hide modal
            modal.style.display = 'none';
            button.remove();
        } catch (error) {
            console.error('Error deleting house or unassigning devices:', error);
            alert('Failed to delete house. Please try again.');
        }
    });

    // If user cancels, just close the modal
    cancelButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}


// #####################################################################
//                          ADD ROOMS
// #####################################################################

async function addRoom(roomName) {
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

        await fetch(`/houses/houseId/rooms`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRoom)
        });
            
           await fetchRooms();

            // Hide the modal and clear the input
            addRoomModal.style.display = "none";
        } catch (error) {
            console.error('Error fetching rooms:', error);
            const mainPanel = document.getElementById('mainPanel');
            mainPanel.innerHTML = '<p>Error loading rooms. Please try again later.</p>';
        }
    } else {
        alert('Please enter a room name.');
    }
}

// #####################################################################
//                          DELETE ROOMS
// #####################################################################

async function deleteRoom(roomId, button) {
    // Show the confirmation modal
    const modal = document.getElementById('confirmationModal');
    const confirmButton = document.getElementById('confirmDelete');
    const cancelButton = document.getElementById('cancelDelete');

    const deleteText = document.getElementById('deleteText');

    deleteText.innerHTML = 'Are you sure you want to delete this room?';
    modal.style.display = 'flex'; // Show the modal

    // If user confirms, delete the room and update devices
    confirmButton.addEventListener('click', async () => {
        try {
            // Step 1: Set room_id to NULL for all devices in this room
            await fetch(`/rooms/${roomId}/devices`, {
                method: 'PATCH', // Use PATCH for updating
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_id: null }) // Set to null
            });

            // Step 2: Delete the room
            await fetch(`/rooms/${roomId}`, {
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
//                          REMOVE USER FROM HOUSE
// #####################################################################

async function removeUser(userId, button) {
    // Show the confirmation modal
    const modal = document.getElementById('confirmationModal');
    const confirmButton = document.getElementById('confirmDelete');
    const cancelButton = document.getElementById('cancelDelete');

    const deleteText = document.getElementById('deleteText');

    deleteText.innerHTML = 'Are you sure you want to remove this user?';
    confirmButton.innerHTML = 'Yes, remove';
    modal.style.display = 'flex'; // Show the modal

    // If user confirms, delete the room and update devices
    confirmButton.addEventListener('click', async () => {
        try {
            modal.style.display = 'none';
            await fetch(`/house/${userId}`, {
                method: 'PATCH'
            });

            // Close the modal and remove the room button from the UI
            button.remove();
        } catch (error) {
            console.error('Error removing user:', error);
            alert('Failed to remove user. Please try again.');
        }
    });

    // If user cancels, just close the modal
    cancelButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// #####################################################################
//                          START Session
// #####################################################################
async function startses(deviceId, userId) {
	try {

            await fetch(`/sessions/${deviceId}`, {
            	headers: { 'Content-Type': 'application/json' }, 
		body: JSON.stringify({ userId: userId })
	    	}
		);

        } catch (error) {
            console.error('Error removing user:', error);
            alert('Failed to start session. Please try again.');
        }
    }





// #####################################################################
//                          END Session
// #####################################################################
async function endses(deviceId, userId) {
	try {

            await fetch(`/sessions/${deviceId}/end`);

        } catch (error) {
            console.error('Error removing user:', error);
            alert('Failed to end session. Please try again.');
        }
    }

// #####################################################################
//                          FETCH Total Power Usage Per user
// #####################################################################


async function fetchTotPowerDevice() {
    try {
 		const response = await fetch(`/totPower/user/month`); // get power
        if (!response.ok) {
            throw new Error('Failed to fetch power');
        }

        const power = await response.json(); // Parse devices JSON from server
		
		        
        power.forEach(powerstat => {
		// powerstat.id is the user.id
        // powerstat.name is the user name
        // powerstat.month is the month of the power usage
        // powerstat.power is the total power used in that month by that user
		//put code here
        })
    } catch (error) {
        console.error('Error loading energy data:', error);
    }}
		
// #####################################################################
//                          FETCH Total Power Usage Per device
// #####################################################################


async function fetchTotPowerUser() {
    try {
 		const response = await fetch(`/totPower/device/month`); // get power
        if (!response.ok) {
            throw new Error('Failed to fetch power');
        }

        const power = await response.json(); // Parse devices JSON from server
		

        power.forEach(powerstat => {
		// powerstat.id is the device.id
        // powerstat.name is the device name
        // powerstat.month is the month of the power usage
        // powerstat.power is the total power used in that month by that device
		//put code here
        })
    } catch (error) {
        console.error('Error loading energy data:', error);
    }}


// #####################################################################
//                          LOAD UNASSIGNED DEVICES
// #####################################################################

async function loadUnassignedDevices() {

        try {
            const token = localStorage.getItem('token');  // Retrieve token from localStorage
            const response = await fetch('/houses/devices/unassigned', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch devices');
            }
    
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


// #####################################################################
//                          START APP
// #####################################################################

async function startApp() {

    const user = getUserFromToken();
    const mainPanel = document.getElementById('mainPanel');
    const sideNav = document.getElementById('sidenavContainer');
    console.log(user);

    if (user) {
        document.getElementById("homeTitle").textContent = `Welcome, ${user.email}`;
        
        if (user.user_type === "landlord") {
            sideNav.remove();
        fetchHouses();
        } else if (user.house_id !== null) {
            fetchRooms();

            document.getElementById('selected').addEventListener("click", () => {
                document.getElementById('homeTitle').innerHTML = 'Dashboard';
                fetchRooms();
            })
        } else if (user.invite === null) {
            sideNav.innerHTML = ``;
            mainPanel.innerHTML=`No house associated with user. Please ask a landlord to invite you`;
        } else {
            sideNav.innerHTML = ``;
            const userInvite = await loadInvitedTenant(user.invite);
            mainPanel.innerHTML=`<h3>${userInvite.name} has invited you to join their house</h3>
                                <div id="inviteButtons"><button id="acceptInvite" class="confirmButton">Accept</button>
                                <button id="declineInvite" class="cancelButton">Decline</button></div>`
            acceptInvite.addEventListener("click", async () => {
                await handleInvite(true);
                window.location.href = "dashboard.html";
            });
            
            declineInvite.addEventListener("click", async () => {
                await handleInvite(false);
                window.location.href = "dashboard.html";
            });
        }
    }
}

// ################################################################################################# //
// ################################################################################################# //
// ################################################################################################# //

document.addEventListener("DOMContentLoaded", async () => {

    startApp();

    // Add Room Button Click Event
    const createRoomButton = document.getElementById("createRoomButton");
    const cancelRoomButton = document.getElementById("cancelRoomButton");
    const cancelDeviceButton = document.getElementById("cancelDeviceButton");
    const cancelNewDeviceButton = document.getElementById("cancelNewDeviceButton");
    const createNewDeviceButton = document.getElementById("createNewDeviceButton");
    const roomNameInput = document.getElementById("roomName");
    const newDeviceInput = document.getElementById("newDeviceInput");

    cancelRoomButton.addEventListener("click", () => {
        addRoomModal.style.display = "none"; // Hide the modal
        roomNameInput.value = ""; // Clear input
    });

    cancelDeviceButton.addEventListener("click", () => {
        addDeviceModal.style.display = "none"; // Hide the modal
    });

    cancelNewDeviceButton.addEventListener("click", () => {
        addNewDeviceModal.style.display = "none"; // Hide the modal
    });

    createNewDeviceButton.addEventListener("click", async () => {
        const newDevice = newDeviceInput.value.trim();
        addDevice(newDevice);
        newDeviceInput.value = "";
    });


    createRoomButton.addEventListener("click", async () => {
        const roomName = roomNameInput.value.trim();
       addRoom(roomName);
       roomNameInput.value = "";
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




// #####################################################################
//                          FETCH Data For Energy Chart
// #####################################################################

if (location.href.split("/").slice(-1)[0] == "energyUsage.html") {
document.addEventListener("DOMContentLoaded", () => {
	let user = 0;
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html"; // Redirect if not logged in
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        user =  payload.id; // Contains { id, name, user_type }
    } catch (err) {
        console.error("Error decoding token:", err);
    }


	
	let cGraph = null;
	//simple delay function to repeat the request every 1000ms
	const delay = ms => new Promise(res => setTimeout(res, ms));
	async function getDevices(userId){
	while (true) {
		let response = await fetch(`/totPower/device/month/${userId}`); // get energy per devices for user
        if (!response.ok) {
            throw new Error('Failed to fetch energy');
        }
		let power = await response.json();
		
				
		let energyChart;
		const ctx = document.getElementById("energyChart").getContext("2d");

			    // Data for different appliances
    let graphData = {
        overview: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Total Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(175, 92, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
			
        },
        detail: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: []
        },
		overviewm: {
            labels: Array.from({length: 31}, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(175, 92, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
			
        },
        detailm: {
            labels: Array.from({length: 31}, (_, i) => i + 1),
            datasets: []
        },
		overviewd: {
            labels: Array.from({length: 24}, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(175, 92, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
			
        },
        detaild: {
            labels: Array.from({length: 24}, (_, i) => i + 1),
            datasets: []
        }
    };
		
		    // Function to update the chart
    const updateChart = (data) => {
        if (energyChart) {
            energyChart.destroy(); // Destroy existing chart
        }

        energyChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'white' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'white' }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: 'white' } }
                }
            }
        });
    };
	
			// zero overview array
		graphData.overview.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0];
		
		let idStore = [];
		// Display the energy data
        power.forEach(powerstat => {
			try {
			let month = powerstat.month;
			let power = powerstat.power/(3600*1000);
			let name = powerstat.name;
			let id = powerstat.id;
			if (!(idStore.includes(id))) {
				
			function random_rgba() {
				var o = Math.round, r = Math.random, s = 255;
				return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
				}
				idStore.push(id);
				graphData.detail.datasets[idStore.indexOf(id)] =                 {
                    label: name + ' Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: random_rgba(),
                    borderColor: random_rgba(),
                    borderWidth: 2,
                    tension: 0.4
                }
				graphData.detailm.datasets[idStore.indexOf(id)] =                 {
                    label: name + ' Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: random_rgba(),
                    borderColor: random_rgba(),
                    borderWidth: 2,
                    tension: 0.4
                }
				graphData.detaild.datasets[idStore.indexOf(id)] =                 {
                    label: name + ' Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: random_rgba(),
                    borderColor: random_rgba(),
                    borderWidth: 2,
                    tension: 0.4
                }
			}
							
		

			
			graphData.detail.datasets[idStore.indexOf(id)].data[month-1] = power;
			graphData.overview.datasets[0].data[month-1] += power;
			} 
			catch{
				//requested device has yet to be added.
			}
        });
		
		// zero overview array
		graphData.overviewm.datasets[0].data = Array.from({length: 31}, (_, i) => 0);
		
		response = await fetch(`/totPower/device/day/${userId}`); // get energy per devices for user
        if (!response.ok) {
            throw new Error('Failed to fetch energy');
        }
		power = await response.json();
		

		
		// Display the energy data
        power.forEach(powerstat => {
			try {
			day = powerstat.day;
			power = powerstat.power/(3600*1000);
			name = powerstat.name;
			id = powerstat.id;
			
			graphData.detailm.datasets[idStore.indexOf(id)].data[day-1] = power;
			graphData.overviewm.datasets[0].data[day-1] += power;
			} 
			catch{
				//requested device has yet to be added.
			}
        });
		
		// zero overview array
		graphData.overviewd.datasets[0].data = Array.from({length: 24}, (_, i) => 0);
		
		response = await fetch(`/totPower/device/hour/${userId}`); // get energy per devices for user
        if (!response.ok) {
            throw new Error('Failed to fetch energy');
        }
		power = await response.json();
	
		
		// Display the energy data
        power.forEach(powerstat => {
			try {
			hour = powerstat.hour;
			power = powerstat.power/(3600*1000);
			name = powerstat.name;
			id = powerstat.id;
			
			
			graphData.detaild.datasets[idStore.indexOf(id)].data[hour-1] = power;
			graphData.overviewd.datasets[0].data[hour-1] += power;
			} 
			catch{
				//requested device has yet to be added.
			}
        });

	if( cGraph == null) {
		updateChart(graphData.overview);
	}
	else{
		updateChart(graphData[cGraph]);
	}
		    // Event listeners for graph buttons
    document.querySelectorAll(".graphButton").forEach(button => {
        button.addEventListener("click", () => {
            const graphType = button.getAttribute("data-graph");
			cGraph = graphType;
            updateChart(graphData[cGraph]);
        });
    });
	await delay(60000); //delay function call (update graph once a minute)
	}
}
	getDevices(user);
});}


