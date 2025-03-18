document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("accessibilityBtn");
    const dropdown = document.getElementById("accessibilityDropdown");

    if (!button || !dropdown) {
        console.error(" Accessibility button or dropdown not found.");
        return;
    }

    button.addEventListener("click", () => {
        dropdown.classList.toggle("show");
    });

    // Get buttons safely
    const contrastBtn = document.getElementById("toggleContrast");
    const textSizeBtn = document.getElementById("toggleTextSize");
    const fontBtn = document.getElementById("toggleFont");

    if (contrastBtn) {
        contrastBtn.addEventListener("click", () => {
            document.body.classList.toggle("high-contrast");
            const isEnabled = document.body.classList.contains("high-contrast");
            localStorage.setItem("highContrast", isEnabled ? "true" : "false");
        });
    } else {
        console.error(" High Contrast button not found.");
    }

    if (textSizeBtn) {
        textSizeBtn.addEventListener("click", () => {
            document.body.classList.toggle("larger-text");
            const isEnabled = document.body.classList.contains("larger-text");
            localStorage.setItem("largerText", isEnabled ? "true" : "false");
        });
    } else {
        console.error(" Text Size button not found.");
    }

    if (fontBtn) {
        fontBtn.addEventListener("click", () => {
            document.body.classList.toggle("dyslexia-friendly");
            const isEnabled = document.body.classList.contains("dyslexia-friendly");
            localStorage.setItem("dyslexiaFriendly", isEnabled ? "true" : "false");
        });
    } else {
        console.error(" Dyslexia-Friendly Font button not found.");
    }

    // Apply saved settings on page load
    if (localStorage.getItem("highContrast") === "true") {
        document.body.classList.add("high-contrast");
    }
    if (localStorage.getItem("largerText") === "true") {
        document.body.classList.add("larger-text");
    }
    if (localStorage.getItem("dyslexiaFriendly") === "true") {
        document.body.classList.add("dyslexia-friendly");
    }
});
