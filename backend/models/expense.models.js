import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index:true       //index for faster queries 
  },
  amount: {
    type: Number,
    required: true,
    min: [0,"Amout cannot be negative!"],
  },
  description: {
    type: String,
    required: true,
    trim:true,
    maxlength:[200,"Description cannot exceed 200 characters"]
  },
  date: {
    type: Date,
    default: Date.now,
    index:true      //index for date-range queries 
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required:[true,"Type (income/expense) is required!"],
    index:true
  },
  category: {
    type: String,
    default: "other",
    enum:[
      "food", "transport", "housing", "utilities",
      "entertainment", "health", "education",
      "salary", "freelance", "investment", "other",
    ],
    index:true
  },
  tags:[{       //flexible tagging
    type:String,
    trim:true 
  }], 
  note:{        //extra detail beyong description
    type:String,
    trim:true
  },
  isRecurring:{
    type:Boolean,
    default:false
  },
  recurringInterval:{
    type:String,
    enum:["daily","weekly","monthly","yearly",null],
    default:null
  },
  currency:{
    type:String,
    default:"USD",
    uppercase:true
  }
}, { timestamps: true });

//compound index for common query pattern: user+date range
expenseSchema.index({userId:1,date:-1});
expenseSchema.index({userId:1,type:1,date:-1});
expenseSchema.index({userId:1,category:1});


const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;