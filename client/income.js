
const API_URL = "http://localhost:5000/api/income";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}

document.getElementById("date").valueAsDate = new Date();

const incomeForm = document.getElementById("income-form");

incomeForm.addEventListener("submit", addIncome);

async function addIncome(event) {

    event.preventDefault();

    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({

                amount,
                category,
                description: title,
                date

            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        alert("Income Added Successfully");

        incomeForm.reset();

        document.getElementById("date").valueAsDate = new Date();

        loadIncome();

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

}

async function loadIncome() {

    try {

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const income = await response.json();

        if (!response.ok) {

            alert(income.message);

            return;

        }

        renderIncome(income);

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

}
// ===============================
// Render Income
// ===============================

function renderIncome(income) {

    const table = document.getElementById("income-list");

    table.innerHTML = "";

    income.forEach(item => {

        table.innerHTML += `
            <tr>
                <td>${item.description}</td>
                <td>${item.category}</td>
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td class="text-success">₹${item.amount}</td>
                <td>
                    <button onclick="deleteIncome('${item._id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

}
// ===============================
// Delete Income
// ===============================

async function deleteIncome(id) {

    if (!confirm("Delete Income?")) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        alert("Income Deleted Successfully");

        loadIncome();

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

}
loadIncome();