const INCOME_API = "http://localhost:5000/api/income";
const EXPENSE_API = "http://localhost:5000/api/expenses";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}

let income = [];
let expenses = [];

async function loadIncome() {
    try {
        const response = await fetch(INCOME_API, {
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

        income = data;

    } catch (error) {
        console.log(error);
        alert("Unable to load income");
    }
}

async function loadExpenses() {
    try {
        const response = await fetch(EXPENSE_API, {
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

        expenses = data;

    } catch (error) {
        console.log(error);
        alert("Unable to load expenses");
    }
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN");
}

function generateReport() {

    const selectedMonth =
        document.getElementById("report-month").value;

    if (!selectedMonth) {
        return;
    }

    document.getElementById("report-date-label").innerText =
        `Period: ${selectedMonth}`;

    const filteredIncome = income.filter(item =>
        item.date &&
        item.date.startsWith(selectedMonth)
    );

    const filteredExpenses = expenses.filter(item =>
        item.date &&
        item.date.startsWith(selectedMonth)
    );

    const totalIncome =
        filteredIncome.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );

    const totalExpenses =
        filteredExpenses.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );

    const netSavings =
        totalIncome - totalExpenses;

    document.getElementById("rep-inc").innerText =
        `₹${totalIncome.toFixed(2)}`;

    document.getElementById("rep-exp").innerText =
        `₹${totalExpenses.toFixed(2)}`;

    document.getElementById("rep-bal").innerText =
        `₹${netSavings.toFixed(2)}`;

    renderCategoryBreakdown(
        filteredIncome,
        filteredExpenses
    );
}

function renderCategoryBreakdown(
    filteredIncome,
    filteredExpenses
) {

    const tbody =
        document.getElementById("report-body");

    tbody.innerHTML = "";

    const categoryBreakdown = {};

    filteredIncome.forEach(item => {

        const category =
            item.category || "Other";

        if (!categoryBreakdown[category]) {
            categoryBreakdown[category] = {
                amount: 0,
                type: "income"
            };
        }

        categoryBreakdown[category].amount +=
            Number(item.amount);
    });

    filteredExpenses.forEach(item => {

        const category =
            item.category || "Other";

        if (!categoryBreakdown[category]) {
            categoryBreakdown[category] = {
                amount: 0,
                type: "expense"
            };
        }

        categoryBreakdown[category].amount +=
            Number(item.amount);
    });

    const entries =
        Object.entries(categoryBreakdown);

    if (entries.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center;">
                    No transactions found for this month.
                </td>
            </tr>
        `;

        return;
    }

    entries
        .sort((a, b) => b[1].amount - a[1].amount)
        .forEach(([category, data]) => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${category}</td>

                <td>
                    ${data.type.toUpperCase()}
                </td>

                <td>
                    ₹${data.amount.toFixed(2)}
                </td>
            `;

            tbody.appendChild(row);
        });
}

async function initReports() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    document.getElementById("report-month").value =
        `${year}-${month}`;

    await Promise.all([
        loadIncome(),
        loadExpenses()
    ]);

    generateReport();
}

function logout() {

    if (
        confirm(
            "Are you sure you want to logout?"
        )
    ) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href =
            "login.html";
    }
}

initReports();