const API_URL = "http://localhost:5000/api/categories";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}

let categories = [];

async function loadCategories() {
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

        categories = data;

        renderCategories();

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

function renderCategories() {

    const expenseList =
        document.getElementById("expense-list");

    const incomeList =
        document.getElementById("income-list");

    expenseList.innerHTML = "";
    incomeList.innerHTML = "";

    const expenseCategories =
        categories.filter(
            category => category.type === "expense"
        );

    const incomeCategories =
        categories.filter(
            category => category.type === "income"
        );

    if (expenseCategories.length === 0) {
        expenseList.innerHTML =
            "<li>No expense categories yet.</li>";
    }

    if (incomeCategories.length === 0) {
        incomeList.innerHTML =
            "<li>No income categories yet.</li>";
    }

    expenseCategories.forEach(category => {

        expenseList.innerHTML += `
            <li>
                <span>${category.name}</span>

                <span
                    class="material-icons-sharp delete-btn"
                    onclick="deleteCategory('${category._id}')"
                >
                    delete
                </span>
            </li>
        `;
    });

    incomeCategories.forEach(category => {

        incomeList.innerHTML += `
            <li>
                <span>${category.name}</span>

                <span
                    class="material-icons-sharp delete-btn"
                    onclick="deleteCategory('${category._id}')"
                >
                    delete
                </span>
            </li>
        `;
    });
}

async function addCategory(event, type) {

    event.preventDefault();

    const inputId =
        type === "expense"
            ? "new-expense-cat"
            : "new-income-cat";

    const input =
        document.getElementById(inputId);

    const name = input.value.trim();

    if (!name) {
        return;
    }

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                name,
                type
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Category Added Successfully");

        input.value = "";

        await loadCategories();

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }
}

async function deleteCategory(id) {

    if (!confirm("Remove this category?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
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

        alert("Category Deleted Successfully");

        await loadCategories();

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }
}

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    }
}

loadCategories();