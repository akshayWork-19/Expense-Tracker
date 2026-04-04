import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/database.config.js';
import cors from "cors";
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import { globalErrorHandler } from './middleware/error.middleware.js';

dotenv.config();

connectDb();

const app = express();
const PORT = process.env.PORT || 4000;

// Security Middlewares
// app.use(helmet()); // Set security HTTP headers
// app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            process.env.FRONTEND_URL?.replace(/\/$/, ''), // strip trailing slash if present
            'http://localhost:5173',
            'http://localhost:4173',
        ].filter(Boolean);

        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            console.warn(`Allowed origins: ${allowed.join(', ')}`);
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    credentials: true,
}));


app.use(express.json({ limit: '10kb' })); // Body parser, limiting data size

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter); // Apply rate limiting to all /api routes

// Welcome / API Documentation Route
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Expense Tracker API Documentation</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Fira+Code&display=swap" rel="stylesheet">
        <style>
            :root { --primary: #3498db; --secondary: #2c3e50; --bg: #f4f7f6; --text: #333; --accent: #e67e22; --code-bg: #282c34; }
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: var(--text); max-width: 1000px; margin: 0 auto; padding: 40px 20px; background-color: var(--bg); }
            h1 { color: var(--secondary); border-bottom: 3px solid var(--primary); padding-bottom: 10px; margin-bottom: 10px; }
            .subtitle { color: #666; margin-bottom: 30px; font-size: 1.1rem; }
            h2 { color: var(--primary); margin-top: 40px; border-left: 5px solid var(--primary); padding-left: 15px; font-size: 1.5rem; }
            .card { background: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); margin-bottom: 30px; overflow: hidden; border: 1px solid #e5e7eb; }
            table { width: 100%; border-collapse: collapse; background: white; }
            th, td { padding: 16px; text-align: left; border-bottom: 1px solid #f3f4f6; }
            th { background-color: #f8fafc; color: var(--secondary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.8rem; }
            tr.main-row { cursor: pointer; transition: all 0.2s; }
            tr.main-row:hover { background-color: #f0f9ff; }
            .badge { padding: 5px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: white; display: inline-flex; align-items: center; justify-content: center; min-width: 65px; }
            .get { background-color: #3b82f6; }
            .post { background-color: #10b981; }
            .put { background-color: #f59e0b; }
            .delete { background-color: #ef4444; }
            .auth { color: var(--accent); font-weight: 700; font-size: 0.8rem; background: #fff7ed; padding: 2px 8px; border-radius: 4px; border: 1px solid #ffedd5; }
            .details-row { display: none; background-color: #fdfdfd; }
            .details-container { padding: 25px; border-top: 1px solid #f3f4f6; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; animation: fadeIn 0.3s ease-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
            .code-section { display: flex; flex-direction: column; gap: 8px; }
            .code-header { font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 5px; }
            .code-block { background: var(--code-bg); color: #abb2bf; padding: 18px; border-radius: 8px; font-family: 'Fira Code', monospace; font-size: 0.8rem; overflow-x: auto; margin: 0; line-height: 1.5; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }
            .method-col { display: flex; align-items: center; gap: 12px; }
            .chevron { font-size: 0.8rem; color: #94a3b8; transition: transform 0.2s; font-weight: bold; }
            .rotate { transform: rotate(90deg); color: var(--primary); }
            .status-bar { display: flex; align-items: center; gap: 15px; margin-top: 40px; padding: 20px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; justify-content: center; }
            .status-dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
        </style>
    </head>
    <body>
        <div style="text-align: center; margin-bottom: 40px;">
            <h1>Finance Dashboard API</h1>
            <p class="subtitle">Interactive documentation for secure role-based financial management.</p>
        </div>

        <div style="background: #eff6ff; padding: 15px 20px; border-radius: 10px; color: #1e40af; font-size: 0.95rem; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
            💡 <strong>Pro Tip:</strong> Click any row below to see experimental request bodies and expected JSON responses.
        </div>
        
        <h2>🔐 User & Authentication</h2>
        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th style="width: 140px;">Method</th>
                        <th>Endpoint</th>
                        <th style="width: 120px;">Required Role</th>
                        <th>Function</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- REGISTER -->
                    <tr class="main-row" onclick="toggleDetails('reg')">
                        <td class="method-col"><span class="chevron" id="reg-chevron">▶</span><span class="badge post">POST</span></td>
                        <td><code>/api/auth/register</code></td>
                        <td>Any</td>
                        <td>Create new user account</td>
                    </tr>
                    <tr id="reg-details" class="details-row">
                        <td colspan="4">
                            <div class="details-container">
                                <div class="code-section">
                                    <div class="code-header">📥 Request Body</div>
                                    <pre class="code-block">{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secure123"
}</pre>
                                </div>
                                <div class="code-section">
                                    <div class="code-header">📤 Success Response (201)</div>
                                    <pre class="code-block">{
  "success": true,
  "message": "User registered",
  "data": { "id": "65f...", "username": "johndoe" }
}</pre>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- LOGIN -->
                    <tr class="main-row" onclick="toggleDetails('login')">
                        <td class="method-col"><span class="chevron" id="login-chevron">▶</span><span class="badge post">POST</span></td>
                        <td><code>/api/auth/login</code></td>
                        <td>Any</td>
                        <td>Get JWT access token</td>
                    </tr>
                    <tr id="login-details" class="details-row">
                        <td colspan="4">
                            <div class="details-container">
                                <div class="code-section">
                                    <div class="code-header">📥 Request Body</div>
                                    <pre class="code-block">{
  "email": "john@example.com",
  "password": "secure123"
}</pre>
                                </div>
                                <div class="code-section">
                                    <div class="code-header">📤 Success Response (200)</div>
                                    <pre class="code-block">{
  "success": true,
  "token": "eyJhbGciOiJIUzI1...",
  "user": { "role": "Viewer", "username": "johndoe" }
}</pre>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- PROFILE -->
                    <tr class="main-row" onclick="toggleDetails('prof')">
                        <td class="method-col"><span class="chevron" id="prof-chevron">▶</span><span class="badge get">GET</span></td>
                        <td><code>/api/auth/profile</code></td>
                        <td>Any <span class="auth">(Auth)</span></td>
                        <td>Get active user profile</td>
                    </tr>
                    <tr id="prof-details" class="details-row">
                        <td colspan="4">
                            <div class="details-container">
                                <div class="code-section">
                                    <div class="code-header">🔑 Auth Header</div>
                                    <pre class="code-block">Authorization: Bearer <TOKEN></pre>
                                </div>
                                <div class="code-section">
                                    <div class="code-header">📤 User Data</div>
                                    <pre class="code-block">{
  "success": true,
  "data": { "username": "johndoe", "role": "Viewer" }
}</pre>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- ADMIN USERS -->
                    <tr class="main-row" onclick="toggleDetails('admin-users')">
                        <td class="method-col"><span class="chevron" id="admin-users-chevron">▶</span><span class="badge get">GET</span></td>
                        <td><code>/api/auth/users</code></td>
                        <td><span class="auth">Admin</span></td>
                        <td>List all system users</td>
                    </tr>
                    <tr id="admin-users-details" class="details-row">
                        <td colspan="4">
                            <div class="details-container">
                                <div class="code-section">
                                    <div class="code-header">🔑 Restriction</div>
                                    <pre class="code-block">Returns 403 for Viewers/Analysts</pre>
                                </div>
                                <div class="code-section">
                                    <div class="code-header">📤 System Users</div>
                                    <pre class="code-block">[
  { "username": "akshay", "role": "Admin" },
  { "username": "mike", "role": "Analyst" }
]</pre>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2>💰 Financial Data & Aggregation</h2>
        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th style="width: 140px;">Method</th>
                        <th>Endpoint</th>
                        <th style="width: 120px;">Required Role</th>
                        <th>Function</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- SUMMARY -->
                    <tr class="main-row" onclick="toggleDetails('sum')">
                        <td class="method-col"><span class="chevron" id="sum-chevron">▶</span><span class="badge get">GET</span></td>
                        <td><code>/api/expense/getSummary</code></td>
                        <td><span class="auth">Analyst+</span></td>
                        <td>Global analytics summary</td>
                    </tr>
                    <tr id="sum-details" class="details-row">
                        <td colspan="4">
                            <div class="details-container">
                                <div class="code-section">
                                    <div class="code-header">🔍 Query Details</div>
                                    <pre class="code-block">// Automatically filters data 
// based on role retrieved from 
// the Authorize header.</pre>
                                </div>
                                <div class="code-section">
                                    <div class="code-header">📤 JSON Result</div>
                                    <pre class="code-block">{
  "success": true,
  "data": {
    "totalIncome": 15000,
    "totalExpense": 8400,
    "balance": 6600
  }
}</pre>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- ALL RECORDS -->
                    <tr class="main-row" onclick="toggleDetails('all')">
                        <td class="method-col"><span class="chevron" id="all-chevron">▶</span><span class="badge get">GET</span></td>
                        <td><code>/api/expense/allExpenses</code></td>
                        <td>Any <span class="auth">(Auth)</span></td>
                        <td>View records (Role-Scoped)</td>
                    </tr>
                    <tr id="all-details" class="details-row">
                        <td colspan="4">
                            <div class="details-container">
                                <div class="code-section">
                                    <div class="code-header">📜 Scoping</div>
                                    <pre class="code-block">Viewers see own records only.
Admins see full system log.</pre>
                                </div>
                                <div class="code-section">
                                    <div class="code-header">📤 Transactions</div>
                                    <pre class="code-block">[
  { "amount": 1200, "type": "expense" },
  { "amount": 5000, "type": "income" }
]</pre>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- CREATE -->
                    <tr class="main-row" onclick="toggleDetails('create')">
                        <td class="method-col"><span class="chevron" id="create-chevron">▶</span><span class="badge post">POST</span></td>
                        <td><code>/api/expense/create</code></td>
                        <td><span class="auth">Admin</span></td>
                        <td>Add a new record</td>
                    </tr>
                    <tr id="create-details" class="details-row">
                        <td colspan="4">
                            <div class="details-container">
                                <div class="code-section">
                                    <div class="code-header">📥 Body</div>
                                    <pre class="code-block">{
  "amount": 1500,
  "type": "expense",
  "category": "Software"
}</pre>
                                </div>
                                <div class="code-section">
                                    <div class="code-header">📤 Result</div>
                                    <pre class="code-block">{
  "success": true,
  "data": { "id": "65f...", "amount": 1500 }
}</pre>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- BULK DELETE -->
                    <tr class="main-row" onclick="toggleDetails('bulk')">
                        <td class="method-col"><span class="chevron" id="bulk-chevron">▶</span><span class="badge post">POST</span></td>
                        <td><code>/api/expense/bulk-delete</code></td>
                        <td><span class="auth">Admin</span></td>
                        <td>Safe removal of multiple records</td>
                    </tr>
                    <tr id="bulk-details" class="details-row">
                        <td colspan="4">
                            <div class="details-container">
                                <div class="code-section">
                                    <div class="code-header">📥 Body</div>
                                    <pre class="code-block">{
  "ids": ["6531...", "6532..."]
}</pre>
                                </div>
                                <div class="code-section">
                                    <div class="code-header">📤 Result</div>
                                    <pre class="code-block">{
  "success": true,
  "deletedCount": 2
}</pre>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- EXPORT -->
                    <tr class="main-row" onclick="toggleDetails('csv')">
                        <td class="method-col"><span class="chevron" id="csv-chevron">▶</span><span class="badge get">GET</span></td>
                        <td><code>/api/expense/export/csv</code></td>
                        <td>Any</td>
                        <td>Download CSV Report</td>
                    </tr>
                    <tr id="csv-details" class="details-row">
                        <td colspan="4">
                            <div class="details-container">
                                <div class="code-section">
                                    <div class="code-header">📄 Format</div>
                                    <pre class="code-block">Returns "text/csv" stream</pre>
                                </div>
                                <div class="code-section">
                                    <div class="code-header">📊 Data Columns</div>
                                    <pre class="code-block">Date, Description, Type, Category, Amount</pre>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="status-bar">
            <div class="status-dot"></div>
            <span style="font-size: 0.9rem; color: #475569; font-weight: 600;">API Status: Online</span>
            <span style="color: #cbd5e1;">|</span>
            <span style="font-size: 0.85rem; color: #64748b;">Security: Helmet & Rate Limiting Active</span>
        </div>

        <script>
            function toggleDetails(id) {
                const details = document.getElementById(id + '-details');
                const chevron = document.getElementById(id + '-chevron');
                const isVisible = details.style.display === 'table-row';
                
                // Close all rows
                document.querySelectorAll('.details-row').forEach(row => row.style.display = 'none');
                document.querySelectorAll('.chevron').forEach(chv => chv.classList.remove('rotate'));
                
                if (!isVisible) {
                    details.style.display = 'table-row';
                    chevron.classList.add('rotate');
                }
            }
        </script>
    </body>
    </html>
  `);
});

app.use('/api/auth', authRoutes);
app.use('/api/expense', expenseRoutes);

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
