const API_URL = "http://localhost:5000/api/splitwise";
const FRIEND_API_URL = "http://localhost:5000/api/splitwise/friends";

const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}

let friends = [];
let bills = [];

async function loadFriends() {
    try {
        const response = await fetch(FRIEND_API_URL, {
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

        friends = data;

        renderFriends();

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

async function loadBills() {
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

        bills = data;

        renderBills();
        renderFriends();

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

async function addFriend(event) {
    event.preventDefault();

    const name = document
        .getElementById("friend-name")
        .value
        .trim();

    if (!name) {
        return;
    }

    try {
        const response = await fetch(FRIEND_API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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

        alert("Friend Added Successfully");

        document.getElementById("friend-name").value = "";

        await loadFriends();

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

async function removeFriend(id) {

    if (!confirm("Remove this friend?")) {
        return;
    }

    try {
        const response = await fetch(
            `${FRIEND_API_URL}/${id}`,
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

        alert("Friend Removed Successfully");

        await loadFriends();

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

async function addBill(event) {

    if (event) {
        event.preventDefault();
    }

    const description = document
        .getElementById("bill-desc")
        .value
        .trim();

    const amount = parseFloat(
        document.getElementById("bill-amount").value
    );

    const payer = document
        .getElementById("bill-payer")
        .value;

    if (!description || !amount || amount <= 0) {
        alert("Please fill all bill details");
        return;
    }

    if (friends.length === 0) {
        alert("Please add at least one friend");
        return;
    }

    const participants = [
        "You",
        ...friends.map(friend => friend.name)
    ];

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                description,
                amount,
                payer,
                participants
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Bill Added Successfully");

        document.getElementById("bill-desc").value = "";
        document.getElementById("bill-amount").value = "";

        await loadBills();

    } catch (error) {
        console.log(error);
        alert("Server Error");
    }
}

function calculateBalance(friendName) {

    let balance = 0;

    bills.forEach(bill => {

        const participants = bill.participants || [];

        if (!participants.includes(friendName)) {
            return;
        }

        if (!participants.includes("You")) {
            return;
        }

        const splitAmount =
            bill.amount / participants.length;

        if (bill.payer === "You") {

            balance -= splitAmount;

        } else if (bill.payer === friendName) {

            balance += splitAmount;
        }
    });

    return balance;
}

function renderFriends() {

    const friendList =
        document.getElementById("friend-list");

    const payerSelect =
        document.getElementById("bill-payer");

    friendList.innerHTML = "";

    payerSelect.innerHTML =
        `<option value="You">You</option>`;

    friends.forEach(friend => {

        payerSelect.innerHTML += `
            <option value="${friend.name}">
                ${friend.name}
            </option>
        `;

        const balance =
            calculateBalance(friend.name);

        let balanceText;
        let balanceClass = "";

        if (balance > 0) {

            balanceText =
                `You owe ₹${balance.toFixed(2)}`;

            balanceClass = "you-owe";

        } else if (balance < 0) {

            balanceText =
                `Owes you ₹${Math.abs(balance).toFixed(2)}`;

            balanceClass = "owes-you";

        } else {

            balanceText = "Settled";
        }

        friendList.innerHTML += `
            <li>
                <div>
                    <strong>${friend.name}</strong>
                    <span class="owe-text ${balanceClass}">
                        ${balanceText}
                    </span>
                </div>

                <button
                    onclick="removeFriend('${friend._id}')"
                    style="
                        color: var(--color-danger);
                        background: none;
                        cursor: pointer;
                        font-weight: bold;
                    "
                >
                    Remove
                </button>
            </li>
        `;
    });
}

function renderBills() {

    const table =
        document.getElementById("split-table");

    table.innerHTML = "";

    bills.forEach(bill => {

        const participants =
            bill.participants || [];

        const splitAmount =
            bill.amount / participants.length;

        let status = "";

        if (bill.payer === "You") {

            const amountYouLent =
                bill.amount - splitAmount;

            status = `
                <span class="owes-you">
                    You lent ₹${amountYouLent.toFixed(2)}
                </span>
            `;

        } else {

            status = `
                <span class="you-owe">
                    You owe ₹${splitAmount.toFixed(2)}
                </span>
            `;
        }

        table.innerHTML += `
            <tr>

                <td>
                    ${bill.description}
                </td>

                <td>
                    ₹${bill.amount.toFixed(2)}
                </td>

                <td>
                    ${bill.payer}
                </td>

                <td>
                    ${status}
                </td>

                <td>
                    <button
                        onclick="deleteBill('${bill._id}')"
                        style="
                            color: var(--color-danger);
                            background: none;
                            cursor: pointer;
                            font-weight: bold;
                        "
                    >
                        Delete
                    </button>
                </td>

            </tr>
        `;
    });
}

async function deleteBill(id) {

    if (!confirm("Delete this bill?")) {
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

        alert("Bill Deleted Successfully");

        await loadBills();

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

async function init() {
    await loadFriends();
    await loadBills();
}

init();