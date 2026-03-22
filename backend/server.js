import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/database.config.js';
import cors from "cors";
import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import { globalErrorHandler } from './middleware/error.middleware.js';
// import mongoSanitize from 'express-mongo-sanitize';
// import helmet from 'helmet';

dotenv.config();

connectDb();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: "Expense tacker is running! " })
});

app.use('/api/auth', authRoutes);
app.use('/api/expense', expenseRoutes);

app.use(globalErrorHandler)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});