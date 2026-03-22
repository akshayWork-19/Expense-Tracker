import { mongoose } from "mongoose";
import Expense from "../models/expense.models.js";
import { AuthorizationError, NotFoundError, ValidationError } from "../utils/customError.js";

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const createExpense = async (req, res) => {
  // console.log(req.body)
  //   console.log('here')
  const { amount, description, date, type, category, tags, note, currency } = req.body;
  const userId = req.user._id;

  if (!userId) {
    throw new AuthorizationError('UserId is required');
  }
  // console.log(req.user._id);

  // INPUT VALIDATION
  if (!description || !amount || !type) {
    throw new ValidationError("amount, type and description are required");
  }

  // Validate amount is a positive number
  if (isNaN(amount) || amount <= 0) {
    throw new ValidationError("Amount must be a positive number");
  }

  // CREATE EXPENSE
  const expense = new Expense({
    userId,
    amount: parseFloat(amount), // Ensure it's a number
    description: description || "", // Default to empty string if not provided
    date: date ? new Date(date) : new Date(), // Ensure proper date format
    type: type,
    category: category,
    note: note,
    tags: tags,
    currency: currency
  });

  await expense.save();

  return res.status(201).json({
    success: true,
    message: "New expense created successfully!",
    data: expense // Changed from 'expense' to 'data' for consistency
  });
}


// #region allExpenses 
const allExpenses = async (req, res) => {
  // console.log(req.user._id);
  const userId = req.user._id;
  if (!userId) {
    throw new AuthorizationError('invalid userId!');
  }

  const { type, category, page = 1, limit = 10 } = req.query;

  const queryObj = { userId };
  if (type) queryObj.type = type;
  if (category) queryObj.category = category;

  const skip = (parseInt(page) - 1) * parseInt(limit);



  const userExpenses = await Expense.find(queryObj)
    .sort({ date: -1 })//newest first
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const totalCount = await Expense.countDocuments(queryObj);

  console.log(userExpenses);

  res.status(200).json({
    success: true,
    count: totalCount,
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalCount / limit),
    data: userExpenses
  })
}

//#region updateExpense
const updateExpense = async (req, res) => {
  // console.log(req.body);
  const { amount, description, date, type, category, tags, note, currency } = req.body;
  const expenseId = req.params.id;
  const userId = req.user._id;

  if (!expenseId || !userId) {
    throw new AuthorizationError("expenseID & userID are required")
  }

  const currentExpense = await Expense.findOne({
    _id: expenseId,
    userId: userId
  });
  // console.log(currentExpense);

  if (!currentExpense) {
    throw new NotFoundError("Expense not available or you dont have permission to update");
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    expenseId,
    {
      amount: amount || currentExpense.amount,
      description: description || currentExpense.description,
      date: date || currentExpense.date,
      type: type || currentExpense.type,
      category: category || currentExpense.category,
      note: note || currentExpense.note,
      tags: tags || currentExpense.tags,
      currency: currency || currentExpense.currency
    },
    { new: true, runValidators: true }
  );


  return res.status(201).json({
    success: true,
    message: "expense updated",
    data: updatedExpense
  })
}


//#region deleteExpense

const deleteExpense = async (req, res) => {
  // console.log(req.params.id);
  const userId = req.user._id;
  const expenseId = req.params.id;
  if (!userId || !expenseId) {
    throw new AuthorizationError('userID and expenseID required!')
  }

  const expenseToDelete = await Expense.findOneAndDelete({
    _id: expenseId,
    userId: userId,
  });
  console.log(expenseToDelete);

  if (!expenseToDelete) {
    throw new NotFoundError('Expense not found or you do not have permission to delete!')
  }
  res.status(200).json({
    success: true,
    message: "expense deleted successfully",
    data: expenseToDelete
  });
}


const bulkDelete = async (req, res) => {
  const { ids } = req.body;
  const result = await Expense.deleteMany({
    _id: { $in: ids.map(toObjectId) },
    userId: req.user._id,  //scoped to user
  });
  res.status(200).json({
    success: true,
    message: "Trasactions deleted Successfully",
    deleted: result.deletedCount
  });
}

const getSummary = async (req, res) => {
  const result = await Expense.aggregate([
    { $match: { userId: toObjectId(req.user._id) } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        avg: { $avg: "$amount" }
      },
    },
  ]);

  const summary = { income: 0, expense: 0, count: { income: 0, expense: 0 } };
  result.forEach(({ _id, total, count }) => {
    summary[_id] = total;
    summary.count[_id] = count;
  });
  summary.net = summary.income - summary.expense;
  res.status(200).json({
    success: true,
    message: "Summary Retrived Successfully!",
    summary: summary
  });
}

const getCategoryBreakdown = async (req, res) => {
  const { type = "expense" } = req.query;

  const result = await Expense.aggregate([
    { $match: { userId: toObjectId(req.user._id) } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    {
      $project: {
        category: "$_id",
        total: 1,
        count: 1,
        _id: 0
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "categoryBreakdown completed!",
    data: result
  });
}

const getMonthlyTrends = async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;

  const result = await Expense.aggregate([
    {
      $match: {
        userId: toObjectId(req.user._id),
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
    {
      $group: {
        _id: "$_id.month",
        date: {
          $push: {
            type: "$_id.type",
            total: "$total",
            count: "$count"
          },
        },
      },
    },
    { $sort: { _id: 1 } }
  ]);
  res.status(200).json({
    success: true,
    message: "Monthly trends Fetched Successfully",
    data: result
  });
}

const getExpenseByDateRange = async (req, res) => {
  const { from, to, type, category, sort = "date", order = "desc" } = req.query;
  const filter = {
    user: req.user._id,
    date: {
      $gte: new Date(from),
      $lte: new Date(to)
    },
  };

  if (type) filter.type = type;
  if (category) filter.category = category;

  const expenses = await Expense.find(filter)
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .lean();

  const totals = expenses.reduce(
    (acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + e.amount;
      return acc;
    }, {}
  );

  res.status(200).json({
    success: true,
    message: "Expenses filtered with date range",
    data: expenses,
    totals: totals
  })

}


const getBudgetOverview = async (req, res) => {
  const [topCategories, highestExpense, recentActivity] = await Promise.all([
    Expense.aggregate([
      { $match: { userId: toObjectId(req.user._id), type: "expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]),
    Expense.findOne({ userId: toObjectId(req.user._id) })
      .sort({ amount: -1 })
      .lean(),
    Expense.find({ userId: toObjectId(req.user._id) })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);
  res.status(200).json({
    success: true,
    message: "Budgets Overview Recieved",
    data: {
      topCategories,
      highestExpense,
      recentActivity
    }
  });
};


const exportAsCSV = async (req, res) => {

  const expenses = await Expense.find({ userId: toObjectId(req.user._id) })
    .sort({ date: -1 })
    .lean();
  const header = "date,type,category,description,amount,currency\n";
  const rows = expenses.map((e) =>
    `${new Date(e.date).toISOString()},${e.type},${e.category},"${e.description}",${e.amount},${e.currency}`
  ).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment;filename=expenses.csv");
  res.send(header + rows);
}




export {
  createExpense,
  allExpenses,
  updateExpense,
  deleteExpense,
  bulkDelete,
  getBudgetOverview,
  getCategoryBreakdown,
  getExpenseByDateRange,
  getMonthlyTrends,
  getSummary,
  exportAsCSV
}