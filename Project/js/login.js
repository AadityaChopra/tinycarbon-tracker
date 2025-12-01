function login() {
    const username = document.getElementById("username").value;

    if (username.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    // Save name to localStorage
    localStorage.setItem("username", username);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
}
