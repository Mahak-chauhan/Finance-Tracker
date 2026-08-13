# 💰 Finance Tracker

A full-stack personal finance management web application that helps users track income and expenses, manage budgets, organize categories, analyze spending, generate reports, and split expenses with friends.

---

## 🚀 Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected API routes
- Secure user-specific data

### 💰 Income Management
- Add income
- View income history
- Delete income
- Dynamic income categories
- MongoDB persistence

### 💸 Expense Management
- Add expenses
- View expense history
- Delete expenses
- Dynamic expense categories
- MongoDB persistence

### 🧾 Transaction Management
- View income and expense transactions
- Track transaction dates and categories
- Centralized transaction history

### 📊 Budget Management
- Create category-based budgets
- Track spending against budgets
- Monitor budget status
- Delete budgets

### 👥 Splitwise
- Add friends
- Remove friends
- Create shared bills
- Split expenses between friends
- Track amounts and settlements

### 🏷️ Category Management
- Create custom income categories
- Create custom expense categories
- Delete categories
- Prevent duplicate categories
- Categories dynamically appear in Income and Expense forms

### 📈 Analytics
- Income analysis
- Expense analysis
- Spending by category
- Financial overview
- Visual representation of financial data

### 📄 Reports
- Financial reports
- Income and expense summaries
- Category-based information

### 👤 Profile
- View profile information
- Update profile name
- Profile data loaded from MongoDB

### ⚙️ Settings
- View account information
- Dark/Light theme
- INR currency support
- Account data reset option

### 🏠 Dashboard
- Total income
- Total expenses
- Current balance
- Recent activity
- Live data from MongoDB

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap
- Material Icons

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication

### Database
- MongoDB
- Mongoose
- MongoDB Atlas

### Development Tools
- Git
- GitHub
- Thunder Client
- VS Code

---

## 📁 Project Structure

```text
Finance-Tracker/
│
├── client/
│   ├── dashboard.html
│   ├── dashboard.js
│   ├── expenses.html
│   ├── expenses.js
│   ├── income.html
│   ├── income.js
│   ├── transactions.html
│   ├── budget.html
│   ├── splitwise.html
│   ├── splitwise.js
│   ├── categories.html
│   ├── analytics.html
│   ├── reports.html
│   ├── profile.html
│   ├── profile.js
│   ├── settings.html
│   └── settings.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── package.json
├── package-lock.json
└── README.md
