const API_URL = "http://localhost:5000/api/settings";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}

async function loadUser() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/profile",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        const user = data.user;

        const profileName =
            document.querySelector(".profile h2");

        const profileText =
            document.querySelector(".profile p");

        const profileImage =
            document.querySelector(".profile-img");

        if (profileName) {
            profileName.textContent = user.name;
        }

        if (profileText) {
            profileText.textContent = user.email;
        }

        if (profileImage) {
            profileImage.textContent =
                user.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U";
        }

    } catch (error) {
        console.log(error);
        alert("Unable to load user profile");
    }
}

function toggleTheme() {

    document.body.classList.toggle("light-mode");

    const isLight =
        document.body.classList.contains("light-mode");

    localStorage.setItem(
        "theme",
        isLight ? "light" : "dark"
    );

    updateToggler(isLight);
}

function updateToggler(isLight) {

    const toggler =
        document.querySelector(".theme-toggler");

    if (!toggler) return;

    if (isLight) {

        toggler.children[0]
            .classList.remove("active");

        toggler.children[1]
            .classList.add("active");

    } else {

        toggler.children[0]
            .classList.add("active");

        toggler.children[1]
            .classList.remove("active");
    }
}

function loadTheme() {

    const isLight =
        localStorage.getItem("theme") === "light";

    if (isLight) {
        document.body.classList.add("light-mode");
    }

    updateToggler(isLight);
}

async function clearData() {

    const confirmed = confirm(
        "Are you sure? This will permanently delete all your Expenses, Income, Budgets, Categories, Splitwise bills and Friends."
    );

    if (!confirmed) {
        return;
    }

    const secondConfirmation = confirm(
        "This action cannot be undone. Continue?"
    );

    if (!secondConfirmation) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/reset`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert(
            "All financial data has been reset successfully."
        );

        window.location.href = "dashboard.html";

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }
}

function logout() {

    if (
        confirm(
            "Are you sure you want to logout?"
        )
    ) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");

        window.location.href = "login.html";
    }
}

loadTheme();
loadUser();