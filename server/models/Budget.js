import mongoose from 'mongoose';

// 지출 항목의 스키마
const expensesSchema = new mongoose.Schema({
  description:{
    type: String,
    required:true
  },
  amount:{
    type: Number,
    required: true
  }
})

// 예산 계획 스키마
const budgetSchema = new mongoose.Schema({
  // 예산 계획 소유자와 연결
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  title:{
    type: String,
    required: true
  },
  totalBudget:{
    type: Number,
    required:true,
    default:0,
  },
  currency:{
    type:String,
    required:true,
  },
  expense: [expensesSchema],
}, {timestamps: true});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;