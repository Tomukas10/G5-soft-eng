document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const user = getUserFromToken();
    if (user.user_type !== "landlord") {
        window.location.href = "login.html";
        return;
    }

    fetchApartments();
    
    document.getElementById("selected").addEventListener("click", fetchApartments);
    document.getElementById("addApartmentButton").addEventListener("click", () => {
        document.getElementById("addApartmentModal").style.display = "block";
    });
    document.getElementById("cancelApartmentButton").addEventListener("click", () => {
        document.getElementById("addApartmentModal").style.display = "none";
    });
    document.getElementById("createApartmentButton").addEventListener("click", createApartment);
});

function getUserFromToken() {
    const token = localStorage.getItem("token");
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
        console.error("Error decoding token:", err);
        return null;
    }
}

async function fetchApartments() {
    try {
        const response = await fetch("/apartments", {
            method: "GET",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (!response.ok) throw new Error("Failed to fetch apartments");
        
        const apartments = await response.json();
        const mainPanel = document.getElementById("apartments");
        mainPanel.innerHTML = "";

        apartments.forEach(apartment => {
            const div = document.createElement("div");
            div.className = "apartmentItem";
            div.textContent = apartment.name;
            div.setAttribute("data-id", apartment.id);
            
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("deleteApartmentButton");
            deleteBtn.addEventListener("click", () => deleteApartment(apartment.id, div));

            div.appendChild(deleteBtn);
            mainPanel.appendChild(div);
        });
    } catch (error) {
        console.error("Error fetching apartments:", error);
    }
}

async function createApartment() {
    const apartmentName = document.getElementById("apartmentName").value.trim();
    if (!apartmentName) {
        alert("Please enter an apartment name.");
        return;
    }

    try {
        const response = await fetch("/apartments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name: apartmentName })
        });
        if (!response.ok) throw new Error("Failed to create apartment");

        fetchApartments();
        document.getElementById("addApartmentModal").style.display = "none";
        document.getElementById("apartmentName").value = "";
    } catch (error) {
        console.error("Error creating apartment:", error);
    }
}

async function deleteApartment(apartmentId, element) {
    if (!confirm("Are you sure you want to delete this apartment?")) return;
    
    try {
        const response = await fetch(`/apartments/${apartmentId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (!response.ok) throw new Error("Failed to delete apartment");
        
        element.remove();
    } catch (error) {
        console.error("Error deleting apartment:", error);
    }
}
