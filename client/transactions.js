const API_URL = "http://localhost:5000/api/transactions";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}

let transactions = [];

async function loadTransactions() {

    try {

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        transactions = data;

        renderTable(transactions);

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }

}

function renderTable(data) {

    const tbody = document.getElementById("tx-list");

    tbody.innerHTML = "";

    data.forEach(transaction => {

        const row = document.createElement("tr");

        const color =
            transaction.type === "income"
                ? "text-success"
                : "text-danger";

        const sign =
            transaction.type === "income"
                ? "+"
                : "-";

        row.innerHTML = `
            <td>${transaction.title}</td>
            <td>${transaction.category}</td>
            <td>${transaction.type.toUpperCase()}</td>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td class="${color}">
                ${sign}₹${transaction.amount}
            </td>
            <td>-</td>
        `;

        tbody.appendChild(row);

    });

}

function filterData() {

    const search =
        document.getElementById("search").value.toLowerCase();

    const type =
        document.getElementById("type-filter").value;

    const filtered = transactions.filter(transaction => {

        const matchesSearch =
            transaction.title.toLowerCase().includes(search) ||
            transaction.category.toLowerCase().includes(search);

        const matchesType =
            type === "all" ||
            transaction.type === type;

        return matchesSearch && matchesType;

    });

    renderTable(filtered);

}

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";

    }

}

loadTransactions();