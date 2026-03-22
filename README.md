# 💰 Full-Stack Expense Tracker

A modern **MERN stack** application (MongoDB, Express, React, Node) for managing personal expenses. This project features a robust RESTful API with advanced aggregation capabilities and a visually stunning, responsive dashboard built with **Tailwind CSS V4** and **Shadcn UI**.

---

## ⚡ Features

### **Backend (API)**
- **User Authentication**: Secure signup and login with **JWT** and **Bcrypt** password hashing.
- **Profile Management**: Update profile details and change passwords securely.
- **Expense Tracking**: Full CRUD (Create, Read, Update, Delete) for managing financial records.
- **Advanced Filtering**: Filter transactions by `type` (income/expense) and `category`.
- **Pagination**: Scalable list views with built-in pagination logic.
- **Data Export**: Export your transaction history as a **CSV file**.
- **Robust Logic**: Custom error handling and input validation for data integrity.

### **Frontend (UI)**
- **Tailwind V4**: Utilizing the latest CSS-first configuration and high-performance styling.
- **Shadcn UI**: Premium, accessible components (Buttons, Cards, Tables, Dialogs, Selects).
- **Dark Mode**: Soft-dark interface implemented for reduced eye strain and a premium aesthetic.
- **Interactive Data Visualization**: Integrated **Recharts** for real-time Pie charts (Category breakdown) and Area charts (Spending trends).
- **Sleek Feedback**: Real-time toast notifications with **Sonner** (Monochrome professional style).
- **Dynamic Filtering**: Robust dashboard logic to filter views by category and type without losing global stats.


---

## 📋 Development Progress

### ✅ Completed
- Backend REST API with full CRUD for expenses and user authentication
- Mongoose models for `User` and `Expense` with validation
- JWT-based auth with middleware protection on routes
- Frontend scaffolded with Vite 7 + React 19 + Tailwind V4
- AuthContext with `login`, `register`, `logout` and auto-rehydration
- Full-stack Dashboard integration with real API data
- Add/Edit Transaction modal (shadcn `Dialog`)
- Interactive **Recharts** (Category Pie Chart & Trend Area Chart)
- Custom-styled **Sonner** Toast Notifications
- **Dark Mode** implementation for the entire dashboard
- Isolated filtering logic for Category and Income/Expense types

### 🚧 In Progress
- Improving Dashboard pagination for large datasets
- Refining client-side form validation UX

### 📌 Planned (Open Source Roadmap)
- **Phase 3**: Recurring Transactions (Monthly/Weekly bills)
- **Phase 4**: Multi-Currency support & User Settings
- **Phase 5**: **AI Smart-Insights** (Analyze spending patterns using AI summaries)
- **OSS Prep**: API Documentation (Swagger), Docker Compose, and unit testing suite.


---

## 🗂 Project Structure

```text
expense_tracker/
├── backend/                # Express/Node server
│   ├── config/             # Database connection setup
│   ├── controllers/        # Business logic (Auth & Expense)
│   ├── middleware/         # Auth, Error handling, and global checks
│   ├── models/             # Mongoose schemas (User & Expense)
│   ├── routes/             # API route definitions
│   ├── utils/              # Custom error classes and helpers
│   └── server.js           # Server entry point
├── frontend/               # Vite + React application
│   ├── src/
│   │   ├── components/     # UI components (Buttons, Stats Cards)
│   │   ├── pages/          # Full-page views (Dashboard)
│   │   ├── lib/            # Utility helpers (cn, Tailwind-merge)
│   │   └── index.css       # Tailwind V4 core imports
│   └── vite.config.js      # Alias & Tailwind V4 configuration
└── README.md
```

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS V4, Shadcn/ui, Lucide React
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens), Bcrypt
- **Documentation**: Markdown

---

## � API Reference

### **Authentication** (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive JWT |
| GET | `/profile` | Get current user's profile info (Auth required) |
| PUT | `/updateProfile` | Update user details (Auth required) |
| PUT | `/changePassword` | Update password (Auth required) |

### **Expenses** (`/api/expense`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create a new transaction |
| GET | `/allExpenses` | Fetch transactions (supports query params: `type`, `category`, `page`, `limit`) |
| PUT | `/:id` | Update a specific transaction by ID |
| DELETE | `/:id` | Delete a specific transaction by ID |
| GET | `/export/csv` | Download all transactions as a CSV file |

---

## 🔧 Installation & Setup

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Akshaykumar1904/tracking_expense.git
   cd expense_tracker
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```

3. **Running the App**:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

---

Developed with ❤️ by [Akshaykumar](https://github.com/akshayWork-19)
