

const API_URL = "http://localhost:5000/api/expenses";


const token = localStorage.getItem("token");


if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}
document.getElementById("date").valueAsDate = new Date();

console.log("Expenses Page Loaded Successfully");


const expenseForm = document.getElementById("expense-form");

expenseForm.addEventListener("submit", addExpense);

async function addExpense(event) {

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

        alert("Expense Added Successfully");

        expenseForm.reset();
        document.getElementById("date").valueAsDate = new Date();

        loadExpenses();

    } catch (error) {

        console.log(error);
        alert("Server Error");

    }

}
async function loadExpenses() {

    try {

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const expenses = await response.json();

        if (!response.ok) {

            alert(expenses.message);

            return;

        }

        renderExpenses(expenses);

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

}
function renderExpenses(expenses) {

    const table = document.getElementById("expense-list");

    table.innerHTML = "";

    expenses.forEach(expense => {

        table.innerHTML += `
            <tr>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>₹${expense.amount}</td>
                <td>
                    <button onclick="deleteExpense('${expense._id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });


}
async function loadExpenseCategories() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/categories",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;
        }

        const categorySelect =
            document.getElementById("category");

        categorySelect.innerHTML =
            '<option value="">Select Category</option>';

        const expenseCategories =
            data.filter(
                category => category.type === "expense"
            );

        expenseCategories.forEach(category => {

            const option =
                document.createElement("option");

            option.value = category.name;
            option.textContent = category.name;

            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.log(
            "Unable to load categories:",
            error
        );
    }
}
async function deleteExpense(id) {

    if (!confirm("Delete Expense?")) return;

    await fetch(`${API_URL}/${id}`, {

        method: "DELETE",

        headers: {
            "Authorization": `Bearer ${token}`
        }

    });

    
loadExpenses();

}
loadExpenseCategories();
loadExpenses();