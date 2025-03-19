function validateEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailPattern.test(email);
    
    }

document.addEventListener("DOMContentLoaded", () => {

    // Ensure all elements exist before using them
    const formTitle = document.getElementById("form-title");
    const form = document.getElementById("auth-form");
    const confirmPasswordGroup = document.getElementById("confirm-password-group");
    const toggleText = document.getElementById("toggle-text");
    const submitBtn = document.querySelector(".btn");
    const emailInput = document.getElementById("email");
    const fnameInput = document.getElementById("name");
    const nameInputID = document.getElementById("nameInputID");
    const lNameInputID = document.getElementById("lNameInputID");
    const lastNameINput = document.getElementById("last_name");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    let isSignup = false;

    function updateToggleForm() {
        const toggleForm = document.getElementById("toggle-form");
    
        toggleForm.addEventListener("click", (e) => {
            e.preventDefault();
            isSignup = !isSignup;
    
            fnameInput.value = "";
            lastNameINput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            confirmPasswordInput.value = "";
            roleSelect.value = "user"; // Reset role to default
    
            formTitle.textContent = isSignup ? "Sign Up" : "Login";
            confirmPasswordGroup.style.display = isSignup ? "block" : "none";
            nameInputID.style.display = isSignup ? "block" : "none";
            lNameInputID.style.display = isSignup ? "block" : "none";
            roleGroup.style.display = isSignup ? "block" : "none";
            submitBtn.textContent = isSignup ? "Sign Up" : "Login";
    
            toggleText.innerHTML = isSignup
                ? 'Already have an account? <a href="#" id="toggle-form">Login</a>'
                : 'Don\'t have an account? <a href="#" id="toggle-form">Sign up</a>';
    
            updateToggleForm(); // Re-bind event listener after modifying innerHTML
        });
    }
    
    updateToggleForm(); // Initial binding
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const fname = fnameInput.value;
        const last_name = lastNameINput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const role = roleSelect.value; 
    
        if (isSignup) {
            if(!validateEmail(email)){
                alert("Invalid Email");
                return;
            }
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            try {
                const response = await fetch("http://localhost:3000/auth/register", {
                   
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fname,
                        last_name,
                        email,
                        password,
                        role
                    })
                });
    
                const data = await response.json();
                alert(data.message);
    
                if (response.ok) {
                    isSignup = false;
                    formTitle.textContent = "Login";
                    confirmPasswordGroup.style.display = "none";
                    nameInputID.style.display =  "none";
                    lNameInputID.style.display =  "none";
                    roleGroup.style.display = "none";
                    submitBtn.textContent = "Login";
                    toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-form">Sign up</a>';
                    updateToggleForm();
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Registration failed!");
            }
    
        } else {
            try {
                const response = await fetch("http://localhost:3000/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({email, password })
                });
    
                const data = await response.json();
                alert(data.message);
    
                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "dashboard.html";
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Login failed!");
            }
        }
    });    
});