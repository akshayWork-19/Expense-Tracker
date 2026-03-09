# 💰 Expense Tracker API

A **RESTful API** for managing personal expenses. Built with **Node.js**, **Express**, and **MongoDB**, this API allows users to register, login, manage profiles, and track expenses efficiently. Images and media can be handled using **Cloudinary**.

---

## 🗂 Folder Structure

<img width="297" height="402" alt="image" src="https://github.com/user-attachments/assets/3478f0d6-4e28-4c31-9334-410ff98b6379" />



## ⚡ Features

- User authentication with **JWT**
- Create, read, update, and delete expenses
- View all expenses
- Update user profile and password
- Cloud-based image handling via **Cloudinary**

---

## 🔌 API Endpoints

### **Authentication**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user and get JWT token |

### **User Profile**

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| GET | `/profile` | `auth` | Get logged-in user profile |
| PUT | `/updateProfile` | `auth` | Update user profile details |
| PUT | `/changePassword` | `auth` | Change user password |

### **Expenses**

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| POST | `/create` | — | Create a new expense |
| POST | `/allExpenses` | — | Fetch all expenses |
| PUT | `/:id` | — | Update expense by ID |
| DELETE | `/:id` | — | Delete expense by ID |

---

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Install dependencies:
```
npm install
```

3. Create a .env file with the following variables
```
PORT
MONGO_URI
```

4. Start the server
```
npm run dev
```

## 🛠 Tech Stack

- Node.js & Express

- MongoDB & Mongoose

- JWT for authentication

 

   
