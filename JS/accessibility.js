document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("accessibilityBtn");
    const dropdown = document.getElementById("accessibilityDropdown");

    if (!button || !dropdown) {
        console.error(" Accessibility button or dropdown not found.");
        return;
    }

    // Show/Hide Dropdown
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdown.classList.toggle("show");
    });

    // Close Dropdown when Clicking Outside
    document.addEventListener("click", (event) => {
        if (!button.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove("show");
        }
    });

    dropdown.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // =========== HIGH CONTRAST MODE ===========
    const contrastBtn = document.getElementById("toggleContrast");
    if (contrastBtn) {
        contrastBtn.addEventListener("click", () => {
            document.body.classList.toggle("high-contrast");
            localStorage.setItem("highContrast", document.body.classList.contains("high-contrast"));
        });
    }

    if (localStorage.getItem("highContrast") === "true") {
        document.body.classList.add("high-contrast");
    }

    // =========== TEXT SIZE (Matches Your Nested Dropdown) ===========
    const textSizes = {
        "1.2x": "larger-text-1-2x",
        "1.5x": "larger-text-1-5x",
        "2x": "larger-text-2x"
    };

    function updateTextSize(size) {
        Object.values(textSizes).forEach(className => document.body.classList.remove(className));
        if (size !== "reset") {
            document.body.classList.add(textSizes[size]);
            localStorage.setItem("textSize", size);
        } else {
            localStorage.removeItem("textSize");
        }
    }

    document.querySelectorAll(".nested-dropdown-content button").forEach(button => {
        button.addEventListener("click", () => {
            const size = button.id.replace("textSize-", "").replace("-", ".");
            updateTextSize(size);
            location.reload(); //Ensures text size updates instantly
        });
    });

    const savedTextSize = localStorage.getItem("textSize");
    if (savedTextSize && textSizes[savedTextSize]) {
        document.body.classList.add(textSizes[savedTextSize]);
    }
        // =========== COLOR BLINDNESS MODE ===========
    const colorBlindModes = {
        "protanopia": "protanopia-mode",
        "deuteranopia": "deuteranopia-mode",
        "tritanopia": "tritanopia-mode"
    };

    function applyColorBlindMode(mode) {
        Object.values(colorBlindModes).forEach(className => document.body.classList.remove(className));
        if (mode in colorBlindModes) {
            document.body.classList.add(colorBlindModes[mode]);
            localStorage.setItem("colorBlindMode", mode);
        } else {
            localStorage.removeItem("colorBlindMode");
        }
    }

    Object.keys(colorBlindModes).forEach(mode => {
        const btn = document.getElementById(`colorBlind-${mode}`);
        if (btn) {
            btn.addEventListener("click", () => applyColorBlindMode(mode));
        }
    });

    const resetColorBlindBtn = document.getElementById("resetAccessibility");
    if (resetColorBlindBtn) {
        resetColorBlindBtn.addEventListener("click", () => {
            localStorage.removeItem("colorBlindMode");
            localStorage.removeItem("highContrast");
            localStorage.removeItem("textSize");

            Object.values(colorBlindModes).forEach(className => document.body.classList.remove(className));
            document.body.classList.remove("high-contrast", "larger-text-1-2x", "larger-text-1-5x", "larger-text-2x");

            location.reload();
        });
    }

    const savedColorBlindMode = localStorage.getItem("colorBlindMode");
    if (savedColorBlindMode) {
        applyColorBlindMode(savedColorBlindMode);
    }
});
