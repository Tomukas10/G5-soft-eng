async function fetchHouses() {
    try {
        const response = await fetch('/houses'); // Fetch the houses
        if (!response.ok) {
            throw new Error('Failed to fetch rooms');
        }
        const rooms = await response.json();

        const mainPanel = document.getElementById('mainPanel');
        const title = document.getElementById('homeTitle')
        
        mainPanel.innerHTML = "";

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
        buttonText.textContent = 'Add house';
    
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
            button.className = 'houseButton';
            button.setAttribute('data-id', houses.id);
            button.setAttribute('data-name', houses.adress);


            // Add the room name
            const roomName = document.createElement('span');
            roomName.textContent = houses.name;

            // Add the delete button
            const deleteButton = document.createElement('span');
            deleteButton.className = 'deleteHouseButton';
            deleteButton.innerHTML = '&times;';
            deleteButton.setAttribute('data-id', houses.id);

            // Add delete event listener
            deleteButton.addEventListener('click', async (event) => {
                event.stopPropagation(); 
                const roomId = event.target.getAttribute('data-id');
                deleteRoom(roomId, button);

            });

            // Add event listener to take user to room devices
            button.addEventListener('click', async (event) => {    
                event.stopPropagation(); 
                const housesID = event.currentTarget.getAttribute('data-id');   
                title.innerHTML = event.currentTarget.getAttribute('data-name'); 
                    fetchDevices(housesID);
            });

            button.appendChild(deleteButton);
            button.appendChild(icon);
            button.appendChild(houseName);

            mainPanel.insertBefore(button, addHouseButton);
        });

    } catch (error) {
        console.error('Error fetching houses:', error);
        const mainPanel = document.getElementById('mainPanel');
        mainPanel.innerHTML = '<p>Error loading houses. Please try again later.</p>';
    }
}