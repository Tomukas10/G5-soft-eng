<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link id="main" rel="stylesheet" href="../CSS/home1.css">
    <script src="../JS/fetch.js"></script>
    <script defer src="../JS/accessibility.js"></script>
</head>
<body id="body"> 
    <!-- Accessibility Button -->
    <button id="accessibilityBtn" aria-label="Toggle Accessibility Menu">Accessibility</button>

    <!-- Dropdown Menu -->
    <div id="accessibilityDropdown" class="dropdown-content">
        <button id="toggleContrast">High Contrast</button>

        <!-- Nested Dropdown for Text Size -->
<div class="nested-dropdown">
    <button class="nested-dropdown-btn">Text Size →</button>
    <div class="nested-dropdown-content">
        <button id="textSize-1-2x">Text 1.2x</button>
        <button id="textSize-1-5x">Text 1.5x</button>
        <button id="textSize-2x">Text 2x</button>
        <button id="textSize-reset">Reset Text Size</button> <!-- NEW BUTTON -->
    </div>
</div>


        <!-- Color Blindness Mode -->
        <div class="nested-dropdown">
            <button class="nested-dropdown-btn">Color Blind Mode →</button>
            <div class="nested-dropdown-content">
                <button id="colorBlind-protanopia">Protanopia</button>
                <button id="colorBlind-deuteranopia">Deuteranopia</button>
                <button id="colorBlind-tritanopia">Tritanopia</button>
                <button id="resetAccessibility">Reset</button>
            </div>
        </div>
    </div>

    <header>
        <h1 id="homeTitle">Dashboard</h1> 
        <a class="logout-btn" href="login.html">Log Out</a>
    </header>
</body>


    <!-- MAIN CONTENT -->
    <main>
        <div id="page">
            <div id="sidenavContainer">
                <div id="sidenav">
                    <a id="selected" class="sidenavItems" style="opacity: 100%;">Home</a>
                    <hr>
                    <a class="sidenavItems" href="Heating.html">Heating</a>
                    <hr>
                    <a class="sidenavItems" href="lighting.html">Lighting</a>
                    <hr>
                    <a class="sidenavItems" href="energyUsage.html">Energy Usage</a>
                    <hr>
                    <a class="sidenavItems" href="security.html">Security</a>
                    <hr>
                </div>
            </div>
            <div id="mainPanel">
                <div id="appliances"></div>
                <div id="divider"></div>
                <div id="right-panel"></div>
            </div>
            <div id="addRoomModal" class="addModal" style="display: none;">
                <div class="addForm">
                    <input type="text" class="inputBox" id="roomName" placeholder="Enter room name">
                    <button id="createRoomButton" class="confirmButton">Create</button>
                    <button class="cancelButton" id="cancelRoomButton">Cancel</button>
                </div>
            </div>
            <div id="addDeviceModal" class="addModal" style="display: none;">
                <div class="addForm">
                    <select id="deviceDropdown">
                        <option value="">Select a device</option>
                    </select>
                    <button id="confirmDeviceButton" class="confirmButton">Add</button>
                    <button class="cancelButton" id="cancelDeviceButton">Cancel</button>
                </div>
            </div>
            
            <div id="addHouseModal" class="addModal" style="display: none;">
                <div class="addForm">
                    <input type="text" class="inputBox" id="houseName" placeholder="Enter House name">
                    <input type="text" class="inputBox" id="houseAddress" placeholder="Enter House address">
                    <button id="createHouseButton" class="confirmButton">Create</button>
                    <button class="cancelButton" id="cancelHouseButton">Cancel</button>
                </div>
            </div>
        </div>

<a class="logout-btn" id="logout" href="login.html" style="margin-left: 3%; margin-top: 25%; display: none; width: 5vw; height: 5vh; ">Log Out</a>
<div id="confirmationModal" class="addForm" style="display: none;">
    <div class="modal-content">
        <p id="deleteText">Are you sure you want to delete this room?</p>
        <button id="confirmDelete" class="confirmButton">Yes, delete</button>
        <button id="cancelDelete" class="cancelButton">Cancel</button>
    </div>
</div>
<div id="deviceConfirmationModal" class="addForm" style="display: none; color: black; width: 20vw; height: 18vh;">
    <div class="modal-content">
        <p id="deleteTextDevice">Are you sure you want to delete this Device?</p>
        <button id="confirmDeviceDelete" class="confirmButton">Delete from room</button>
        <button id="confirmPermaDelete" class="confirmButton">Delete permanently</button>
        <button id="cancelDeviceDelete" class="cancelButton">Cancel</button>
    </div>
</div>
<div id = "addDevicearea"></div>
<div id="addNewDeviceModal" class="addModal" style="display: none;">
    <div class="addForm">
        <input type="text" class="inputBox" id="newDeviceInput" placeholder="Enter device name">
        <button id="createNewDeviceButton" class="confirmButton">Create</button>
        <button class="cancelButton" id="cancelNewDeviceButton">Cancel</button>
    </div>
</div> 
<div id = "addFaultArea" style="float: left; width: 5vw; height: 5vh; margin-top: 25vh; "></div>
<div id="addFault" class="addModal" style="display: none;">
</div>
    </main>
</body>
</html>
