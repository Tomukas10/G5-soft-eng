document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("accessibilityBtn");

    if (!button) {
        console.error("Accessibility button not found.");
        return;
    }


    button.addEventListener("click", () => {
        console.log("🔄 Toggling accessibility modes...");
        document.body.classList.toggle("high-contrast");
        document.body.classList.toggle("larger-text");
    });
});
