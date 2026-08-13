const INCOME_API = "http://localhost:5000/api/income";
const EXPENSE_API = "http://localhost:5000/api/expenses";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let income = [];
let expenses = [];

async function fetchData(url) {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to load data");
    }

    return data;
}

function isCurrentMonth(date) {
    if (!date) return false;

    const transactionDate = new Date(date);
    const today = new Date();

    return (
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
    );
}

function calculateTotal(data) {
    return data.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
    );
}

function updateSummary() {
    const currentIncome = income.filter(item =>
        isCurrentMonth(item.date)
    );

    const currentExpenses = expenses.filter(item =>
        isCurrentMonth(item.date)
    );

    const totalIncome = calculateTotal(currentIncome);
    const totalExpense = calculateTotal(currentExpenses);
    const balance = totalIncome - totalExpense;

    document.getElementById("total-income").innerText =
        `₹${totalIncome.toFixed(2)}`;

    document.getElementById("total-expense").innerText =
        `₹${totalExpense.toFixed(2)}`;

    document.getElementById("total-balance").innerText =
        `₹${balance.toFixed(2)}`;
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN");
}

function renderRecentActivity() {
    const tbody =
        document.getElementById("recent-transactions-body");

    tbody.innerHTML = "";

    const allTransactions = [
        ...income.map(item => ({
            title: item.title || "Income",
            category: item.category || "Other",
            date: item.date,
            amount: Number(item.amount || 0),
            type: "income"
        })),

        ...expenses.map(item => ({
            title: item.title || "Expense",
            category: item.category || "Other",
            date: item.date,
            amount: Number(item.amount || 0),
            type: "expense"
        }))
    ];

    allTransactions.sort(
        (a, b) =>
            new Date(b.date) - new Date(a.date)
    );

    const recent =
        allTransactions.slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No recent activity
                </td>
            </tr>
        `;
        return;
    }

    recent.forEach(item => {

        const row =
            document.createElement("tr");

        const amountClass =
            item.type === "income"
                ? "text-success"
                : "text-danger";

        const amountPrefix =
            item.type === "income"
                ? "+"
                : "-";

        row.innerHTML = `
            <td>${item.title}</td>

            <td>${item.category}</td>

            <td>${formatDate(item.date)}</td>

            <td class="${amountClass}">
                ${amountPrefix}₹${item.amount.toFixed(2)}
            </td>

            <td class="${amountClass}">
                ${item.type === "income"
                    ? "Income"
                    : "Expense"}
            </td>
        `;

        tbody.appendChild(row);
    });
}

async function loadDashboard() {
    try {

        const [incomeData, expenseData] =
            await Promise.all([
                fetchData(INCOME_API),
                fetchData(EXPENSE_API)
            ]);

        income = Array.isArray(incomeData)
            ? incomeData
            : [];

        expenses = Array.isArray(expenseData)
            ? expenseData
            : [];

        updateSummary();
        renderRecentActivity();

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Unable to load dashboard"
        );
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

        window.location.href =
            "login.html";
    }
}

loadDashboard();