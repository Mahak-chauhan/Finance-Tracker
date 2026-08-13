const API_URL = "http://localhost:5000/api/profile";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}

async function loadProfile() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        const user = data.user;

        document.getElementById("p-name").value =
            user.name || "";

        document.getElementById("p-email").value =
            user.email || "";

        document.getElementById("p-joined").value =
            user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN")
                : "Unknown";

        document.getElementById("avatar-initial").innerText =
            user.name
                ? user.name.charAt(0).toUpperCase()
                : "U";

    } catch (error) {
        console.log(error);
        alert("Unable to load profile");
    }
}

document
    .getElementById("profile-form")
    .addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById("p-name").value.trim();

        if (!name) {
            alert("Name cannot be empty");
            return;
        }

        try {

            const response = await fetch(API_URL, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    name
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Profile Updated Successfully");

            document.getElementById("avatar-initial").innerText =
                name.charAt(0).toUpperCase();

        } catch (error) {

            console.log(error);
            alert("Unable to update profile");

        }
    });

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");

        window.location.href = "login.html";
    }
}

loadProfile();