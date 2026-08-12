const API_URL = "http://localhost:5000/api/budgets";
const EXPENSE_API_URL = "http://localhost:5000/api/expenses";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}

let budgets = [];
let expenses = [];

async function loadBudgets() {
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

        budgets = data;

        renderBudgets();

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

async function loadExpenses() {
    try {
        const response = await fetch(EXPENSE_API_URL, {
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

        expenses = data;

        renderBudgets();

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

function getSpent(category) {

    return expenses
        .filter(expense => expense.category === category)
        .reduce(
            (total, expense) =>
                total + Number(expense.amount),
            0
        );
}

function renderBudgets() {

    const container =
        document.getElementById("budget-cards");

    container.innerHTML = "";

    if (budgets.length === 0) {

        container.innerHTML =
            `<p>No budgets set yet.</p>`;

        return;
    }

    budgets.forEach(budget => {

        const spent =
            getSpent(budget.category);

        const remaining =
            budget.amount - spent;

        const percentage =
            Math.min(
                (spent / budget.amount) * 100,
                100
            );

        const isOver =
            spent > budget.amount;

        let color =
            "var(--color-primary)";

        if (percentage > 50) {
            color = "var(--color-warning)";
        }

        if (percentage > 90 || isOver) {
            color = "var(--color-danger)";
        }

        container.innerHTML += `
            <div class="budget-card">

                <div class="budget-header">

                    <h3>${budget.category}</h3>

                    <button
                        onclick="deleteBudget('${budget._id}')"
                        style="
                            background:none;
                            color:var(--color-info-dark);
                            cursor:pointer;
                        "
                    >
                        <span class="material-icons-sharp">
                            delete
                        </span>
                    </button>

                </div>

                <div class="budget-amount">

                    <span>
                        ₹${spent.toFixed(0)}
                    </span>

                    /

                    <span>
                        ₹${Number(budget.amount).toFixed(0)}
                    </span>

                </div>

                <div class="progress-container">

                    <div
                        class="progress-bar"
                        style="
                            width:${percentage}%;
                            background:${color};
                        "
                    ></div>

                </div>

                <div class="status-text">

                    <span class="${
                        isOver
                            ? "over-budget"
                            : "under-budget"
                    }">

                        ${
                            isOver
                                ? `Over Budget by ₹${Math.abs(remaining).toFixed(0)}`
                                : `Remaining ₹${remaining.toFixed(0)}`
                        }

                    </span>

                    <span>
                        ${Math.round(percentage)}%
                    </span>

                </div>

            </div>
        `;
    });
}

async function addBudget(event) {

    event.preventDefault();

    const category =
        document.getElementById("b-category").value;

    const amount =
        parseFloat(
            document.getElementById("b-amount").value
        );

    if (!amount || amount <= 0) {

        alert("Enter a valid budget amount");

        return;
    }

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                category,
                amount
            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        alert(data.message);

        document.getElementById("b-amount").value = "";

        await loadBudgets();

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }
}

async function deleteBudget(id) {

    if (!confirm("Remove this budget?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        alert("Budget Deleted Successfully");

        await loadBudgets();

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

document
    .getElementById("budget-form")
    .addEventListener(
        "submit",
        addBudget
    );

async function init() {

    await loadBudgets();

    await loadExpenses();

}

init();