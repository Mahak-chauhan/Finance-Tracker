const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const splitwiseFriendRoutes = require("./routes/splitwiseFriendRoutes");
const splitwiseRoutes = require("./routes/splitwiseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const profileRoutes = require("./routes/profileRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
dotenv.config();
console.log("MONGO_URI =", process.env.MONGO_URI);

connectDB();

const app = express();

    app.use(cors());
    app.use(express.json());
    
    app.use("/api/auth", authRoutes);
    app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
    app.use("/api/expenses", expenseRoutes);
    app.use("/api/income", incomeRoutes);
    app.use("/api/profile", profileRoutes);
    app.use("/api/splitwise", splitwiseRoutes);
    app.use("/api/splitwise/friends", splitwiseFriendRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Finance Tracker Backend Running 🚀"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});