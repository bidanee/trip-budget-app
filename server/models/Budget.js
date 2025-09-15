import mongoose from 'mongoose';

// 지출 항목의 스키마
const expensesSchema = new mongoose.Schema({
  category:{
    type: String,
    required: true,
    enum: ['식비','교통','숙소','쇼핑','관광','기타'],
    default:'기타',
  },
  description:{
    type: String,
    required:true
  },
  amount:{
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
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
  expenses: [expensesSchema],
}, {timestamps: true});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;