import express from 'express';
import Budget from '../models/Budget.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// --- 예산 계획 API ---
router.post('/', auth, async (req,res) => {
  const {title, totalBudget, currency, expenses} = req.body;

  const newBudget = new Budget({
    title,
    totalBudget,
    currency,
    expenses,
    user: req.userId
  });

  try{
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch(error) {
    res.status(409).json({message:error.message});
  }
});

// --- 로그인한 사용자의 모든 예산 계획 조회 API---
router.get('/', auth, async (req, res) => {
  try{
    const budgets = await Budget.find({user:req.userId});
    res.status(200).json(budgets);
  } catch(error) {
    res.status(404).json({message:error.message});
  }
});

// --- 예산 계획 수정 API ---
router.put('/:id', auth, async (req, res) => {
  const {id} = req.params;
  const {title, totalBudget, currency, expenses} = req.body;

  try{
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      {title, totalBudget, currency, expenses, _id:id},
      {new: true}
    );
    res.json(updatedBudget);
  } catch (error) { 
    res.status(404).json({message:error.message});
  }
});

// --- 예산 계획 삭제 API ---
router.delete('/:id', auth, async(req, res) => {
  const {id} = req.params;

  try {
    await Budget.findByIdAndDelete(id);
    res.json({message:'예산 계획이 성공적으로 삭제되었습니다.'});
  } catch (error){
    res.status(404).json({message: error.message});
  }
});

// --- 단일 예산 조회 API ---
router.get('/:id', auth, async (req, res) => {
  try{
    const budget = await Budget.findOne({_id:req.params.id, user: req.userId});
    if (!budget) {
      return res.status(404).json({message:'예산 계획을 찾을 수 없습니다.'});
    }
    res.status(200).json(budget);
  }catch(error) {
    console.error('단일 예산 조회 오류입니다. : ', error);
    res.status(500).json({message:'서버에 문제가 발생했습니다.'})
  }
})

// --- 지출 항목 추가 API ---
router.post('/:id/expenses', auth, async (req, res) => {
  const {description, amount} = req.body;
  const budgetId = req.params.id;

  try{
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({message: '예산 계획을 찾을 수 없습니다.'});
    }

    budget.expenses.unshift({description, amount});

    const updatedBudget = await budget.save();
    res.status(200).json(updatedBudget);
  }catch (error){
    res.status(500).json({ message: '서버에 오류가 발생했습니다.'});
  }
});

// --- 지출 항목 삭제 API ---
router.delete('/:ad/expenses/:expenseId', auth , async (req, res) => {
  const {id: budgetId, expenseId} = req.params;

  try{
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({message: '예산 계획을 찾을 수 없습니다.'});
    }

    budget.expenses = budget.expenses.filter(expense => expense._id.toString() !== expenseId);

    const updatedBudget = await budget.save();
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({message: '서버에 문제가 발생했습니다.'});
  }
})

export default router;