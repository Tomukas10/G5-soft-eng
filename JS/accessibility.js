document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("accessibilityBtn");
    const dropdown = document.getElementById("accessibilityDropdown");

    if (!button || !dropdown) {
        console.error("⚠️ Accessibility button or dropdown not found.");
        return;
    }

    // ✅ Toggle dropdown visibility
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdown.classList.toggle("show");
    });

    // ✅ Hide dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!button.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove("show");
        }
    });

    dropdown.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // ✅ High Contrast Mode
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

    // ✅ Text Size Options
    const textSizes = {
        "default": "",
        "1.2x": "larger-text-1-2x",
        "1.5x": "larger-text-1-5x",
        "2x": "larger-text-2x"
    };

    Object.keys(textSizes).forEach(size => {
        const btn = document.getElementById(`textSize-${size.replace('.', '-')}`);
        if (btn) {
            btn.addEventListener("click", () => {
                Object.values(textSizes).forEach(className => document.body.classList.remove(className));
                if (size !== "default") {
                    document.body.classList.add(textSizes[size]);
                }
                localStorage.setItem("textSize", size);
            });
        }
    });

    const savedTextSize = localStorage.getItem("textSize");
    if (savedTextSize && textSizes[savedTextSize]) {
        document.body.classList.add(textSizes[savedTextSize]);
    }

    // ✅ Color Blind Mode
    const colorBlindModes = {
        "protanopia": "protanopia-filter",
        "deuteranopia": "deuteranopia-filter",
        "tritanopia": "tritanopia-filter"
    };

    Object.keys(colorBlindModes).forEach(mode => {
        const btn = document.getElementById(`colorBlind-${mode}`);
        if (btn) {
            btn.addEventListener("click", () => {
                Object.values(colorBlindModes).forEach(className => document.body.classList.remove(className));
                document.body.classList.add(colorBlindModes[mode]);
                localStorage.setItem("colorBlindMode", colorBlindModes[mode]);
            });
        }
    });

    const savedColorBlindMode = localStorage.getItem("colorBlindMode");
    if (savedColorBlindMode) {
        document.body.classList.add(savedColorBlindMode);
    }

    // ✅ Reset Accessibility Settings
    const resetBtn = document.getElementById("resetAccessibility");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            localStorage.removeItem("highContrast");
            localStorage.removeItem("textSize");
            localStorage.removeItem("colorBlindMode");
            document.body.classList.remove("high-contrast", "larger-text-1-2x", "larger-text-1-5x", "larger-text-2x", ...Object.values(colorBlindModes));
            location.reload();
        });
    }
});
