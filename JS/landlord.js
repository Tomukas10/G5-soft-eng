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