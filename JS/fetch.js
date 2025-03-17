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
        console.log("fetching rooms");
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

    // Clean up previous event listeners
    confirmButton.replaceWith(confirmButton.cloneNode(true));
    cancelButton.replaceWith(cancelButton.cloneNode(true));

    // Re-select buttons after cloning (to remove old listeners)
    const newConfirmButton = document.getElementById('confirmDelete');
    const newCancelButton = document.getElementById('cancelDelete');

    // If user confirms, delete the house and unassign devices
    newConfirmButton.addEventListener('click', async () => {
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
    newCancelButton.addEventListener('click', () => {
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

// ################################################################################################# //
// ################################################################################################# //
// ################################################################################################# //

document.addEventListener("DOMContentLoaded", () => {

const user = getUserFromToken();
console.log(user);
if (user) {
    document.getElementById("homeTitle").textContent = `Welcome, ${user.email}`;
    
    if (user.user_type === "landlord") {
        const mainPanel = document.getElementById('mainPanel');
        const sideNav = document.getElementById('sidenav');
    
        sidenav.innerHTML = '';
       fetchHouses();
    } else if (user.user_type === "user") {
        fetchRooms();
    }
}

document.getElementById('selected').addEventListener("click", () => {
    document.getElementById('homeTitle').innerHTML = 'Dashboard';
    fetchRooms();
})

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
	
	
    let energyChart;
    const ctx = document.getElementById("energyChart").getContext("2d");

	
    // Data for different appliances
    let graphData = {
        overview: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        detail: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Bar Lights Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(053, 052, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Oven Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(245, 192, 192, 0.2)',
                    borderColor: 'rgba(245, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Washing Machine Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Hoover Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(175, 192, 92, 0.2)',
                    borderColor: 'rgba(175, 192, 92, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
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
            datasets: [
                {
                    label: 'Bar Lights Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(053, 052, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Oven Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(245, 192, 192, 0.2)',
                    borderColor: 'rgba(245, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Washing Machine Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Hoover Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(175, 192, 92, 0.2)',
                    borderColor: 'rgba(175, 192, 92, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
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
            datasets: [
                {
                    label: 'Bar Lights Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(053, 052, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Oven Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(245, 192, 192, 0.2)',
                    borderColor: 'rgba(245, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Washing Machine Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
				{
                    label: 'Hoover Electricity Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(175, 192, 92, 0.2)',
                    borderColor: 'rgba(175, 192, 92, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        hoover: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'AC Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        washingmachine: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Washing Machine Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
		oven: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Oven Usage (kWh)',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(0, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
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

    // Initialize with the overview graph
    updateChart(graphData.overview);
	
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
		
		// zero overview array
		graphData.overview.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0];
		
		// Display the energy data
        power.forEach(powerstat => {
			try {
			let month = powerstat.month;
			let power = powerstat.power;
			let name = powerstat.name;
			let id = powerstat.id;
			
			
			graphData.detail.datasets[id-1].data[month-1] = power;
			graphData.overview.datasets[0].data[month-1] += power;
			} 
			catch{
				//requested device has yet to be added.
			}
        });
		
		
		response = await fetch(`/totPower/device/day/${userId}`); // get energy per devices for user
        if (!response.ok) {
            throw new Error('Failed to fetch energy');
        }
		power = await response.json();
		
		// zero overview array
		graphData.overviewm.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0];
		
		// Display the energy data
        power.forEach(powerstat => {
			try {
			day = powerstat.day;
			power = powerstat.power;
			name = powerstat.name;
			id = powerstat.id;
			
			
			graphData.detailm.datasets[id-1].data[day-1] = power;
			graphData.overviewm.datasets[0].data[day-1] += power;
			} 
			catch{
				//requested device has yet to be added.
			}
        });
		
		
		response = await fetch(`/totPower/device/hour/${userId}`); // get energy per devices for user
        if (!response.ok) {
            throw new Error('Failed to fetch energy');
        }
		power = await response.json();
		
		// zero overview array
		graphData.overviewd.datasets[0].data = [0,0,0,0,0,0,0,0,0,0,0,0];
		
		// Display the energy data
        power.forEach(powerstat => {
			try {
			hour = powerstat.hour;
			power = powerstat.power;
			name = powerstat.name;
			id = powerstat.id;
			
			
			graphData.detaild.datasets[id-1].data[hour-1] = power;
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


