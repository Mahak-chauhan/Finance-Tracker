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

function renderCategoryChart() {

    const chart =
        document.getElementById("category-chart");

    chart.innerHTML = "";

    if (expenses.length === 0) {
        chart.innerHTML =
            "<p>No expenses recorded.</p>";
        return;
    }

    const categoryTotals = {};

    let totalExpenses = 0;

    expenses.forEach(expense => {

        const amount = Number(expense.amount);

        const category =
            expense.category || "Other";

        categoryTotals[category] =
            (categoryTotals[category] || 0) + amount;

        totalExpenses += amount;
    });

    const sortedCategories =
        Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1]);

    sortedCategories.forEach(
        ([category, amount]) => {

            const percentage =
                totalExpenses > 0
                    ? (amount / totalExpenses) * 100
                    : 0;

            chart.innerHTML += `
                <div class="bar-group">

                    <div class="bar-label">

                        <span>
                            ${category}
                        </span>

                        <span>
                            ₹${amount.toFixed(2)}
                            (${Math.round(percentage)}%)
                        </span>

                    </div>

                    <div class="bar-bg">

                        <div
                            class="bar-fill fill-danger"
                            style="width: ${percentage}%"
                        ></div>

                    </div>

                </div>
            `;
        }
    );
}

function renderIncomeExpenseChart() {

    const chart =
        document.getElementById("compare-chart");

    const totalIncome =
        income.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );

    const totalExpenses =
        expenses.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );

    const maxValue =
        Math.max(totalIncome, totalExpenses);

    const incomePercentage =
        maxValue > 0
            ? (totalIncome / maxValue) * 100
            : 0;

    const expensePercentage =
        maxValue > 0
            ? (totalExpenses / maxValue) * 100
            : 0;

    chart.innerHTML = `

        <div class="bar-group">

            <div class="bar-label">

                <span>
                    Total Income
                </span>

                <span>
                    ₹${totalIncome.toFixed(2)}
                </span>

            </div>

            <div class="bar-bg">

                <div
                    class="bar-fill fill-success"
                    style="width: ${incomePercentage}%"
                ></div>

            </div>

        </div>


        <div class="bar-group">

            <div class="bar-label">

                <span>
                    Total Expenses
                </span>

                <span>
                    ₹${totalExpenses.toFixed(2)}
                </span>

            </div>

            <div class="bar-bg">

                <div
                    class="bar-fill fill-danger"
                    style="width: ${expensePercentage}%"
                ></div>

            </div>

        </div>
    `;
}

async function initAnalytics() {

    await Promise.all([
        loadIncome(),
        loadExpenses()
    ]);

    renderCategoryChart();
    renderIncomeExpenseChart();
}

function logout() {

    if (
        confirm(
            "Are you sure you want to logout?"
        )
    ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    }
}

initAnalytics();