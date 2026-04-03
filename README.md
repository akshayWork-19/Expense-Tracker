# 💰 Finance Dashboard & Expense Tracker (Hardened Backend)

A professional-grade **MERN stack** application for managing financial records. This project has been significantly upgraded from a basic tracker into a secure, role-based financial dashboard system with advanced analytics and hardened security layers.

---

## ⚡ Key Features (Latest Updates)

### **🔐 Role-Based Access Control (RBAC)**
- **Viewer**: Standard users who can only view and manage their own financial records.
- **Analyst**: Power users who can view global system summaries, trends, and analytics but cannot modify records.
- **Admin**: Full system control, including user role/status management and bulk record operations.

### **🛡️ Security Hardening**
- **Helmet**: Secured HTTP headers to prevent common web vulnerabilities.
- **Rate Limiting**: Brute-force protection on all `/api` routes (100 requests / 15 mins).
- **NoSQL Injection Guard**: Sanitization of all incoming request bodies against MongoDB operator injection.
- **Payload Constraints**: JSON body limits to prevent large-payload DoS attacks (10kb).

### **📊 Interactive API Documentation**
- **Live Dashboard**: The root route (`/`) now serves a professional, interactive HTML documentation page.
- **Expandable Examples**: Click any endpoint to see real-world **Request Body** and **Response JSON** examples.

### **📈 Advanced Analytics**
- **Global Summaries**: Dynamic aggregation pipelines that switch between personal and global data based on user roles.
- **CSV Export**: Securely download transaction histories for personal or administrative auditing.

---

## 📋 Project Status

### ✅ Recently Completed
- [x] **Role-Based Access Control**: Implemented `authorizeRoles` middleware.
- [x] **Security Layer**: Integrated Helmet, Mongo-Sanitize, and Express-Rate-Limit.
- [x] **Interactive Docs**: Built a custom, interactive API dashboard on the home route.
- [x] **Admin Suite**: Added bulk-delete, user list management, and role-update endpoints.
- [x] **Dynamic Pipelines**: Refactored all aggregation logic for role-scoped data visibility.

---

## 🗂 Backend Architecture

```text
backend/
├── config/             # DB connection (Atlas Whitelisting Required)
├── controllers/        # Business logic with Dynamic RBAC Scoping
├── middleware/         # Auth, Role Authorization, and Security Headers
├── models/             # User (Role/Status) & Expense Schemas
├── routes/             # Protected API route definitions
├── utils/              # Custom Error handling
└── server.js           # Server entry point with Security Middlewares
```

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS V4, Shadcn/ui, Recharts
- **Backend**: Node.js, Express, Helmet, Express-Rate-Limit, Mongo-Sanitize
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: JWT (JSON Web Tokens), Bcrypt
- **Documentation**: Custom Interactive HTML Dashboard

---

## 🚀 API Reference (Core Endpoints)

### **Authentication** (`/api/auth`)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/register` | Any | Register a new account (Default: Viewer) |
| POST | `/login` | Any | Login and receive JWT Token |
| GET | `/profile` | Any (Auth) | Retrieve active user profile |
| GET | `/users` | Admin | List all system users |
| PUT | `/users/:id` | Admin | Update user role or toggle status |

### **Expenses** (`/api/expense`)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/create` | Admin | Create a new record |
| GET | `/allExpenses` | Any (Auth) | View records (Role-scoped visibility) |
| GET | `/getSummary` | Analyst+ | Advanced financial aggregations |
| GET | `/export/csv` | Any (Auth) | Export data as a professional CSV |
| POST | `/bulk-delete` | Admin | Securely remove multiple records |

---

## 🔧 Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Akshaykumar1904/tracking_expense.git
   cd expense_tracker/backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the `backend/` folder:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   ```
   > **Note:** Ensure your current IP is whitelisted in MongoDB Atlas Network Access.

3. **Running the App**:
   - Backend: `npm start` (Interactive docs available at `http://localhost:8000/`)
   - Frontend: `npm run dev`

---

Developed with ❤️ by [Akshaykumar](https://github.com/akshayWork-19)
