import { useParams, Link } from "react-router-dom";
import useBudgetStore from "../store/budgetStore";
import { useEffect, useState } from "react";
import {Loader, TriangleAlert, ArrowLeft, Trash2, PlusCircle} from 'lucide-react';
import styles from './BudgetDetail.module.css';
import {toast} from "react-hot-toast"
import useExchangeStore from "../store/exchangeStore"
import { formatCurrency } from "../utils/formatCurrency"

const BudgetDetail = () => {
  const { id } = useParams();
  const { 
    selectedBudget, 
    isLoading, 
    error, 
    getBudgetById, 
    addExpense, 
    deleteExpense 
  } = useBudgetStore((state) => state);
  const rates = useExchangeStore((state) => state.rates);
  
  const [newExpense, setNewExpense] = useState({
    description:'',
    amount:'',
  });

  useEffect(() => {
    if (id) getBudgetById(id);
  }, [id, getBudgetById]);

  const handleInputChange = (e) => {
    const { name, value} = e.target;
    setNewExpense((prev)=> ({...prev, [name]:value}));
  };

  const handleAddExpense = async(e) => {
    e.preventDefault();
    if(!newExpense.description.trim() || !newExpense.amount.trim()){
      return toast.error('항목과 금액을 모두 입력해주세요.');
    }
    await addExpense(id, newExpense);
    setNewExpense({
      description: '',
      amount: '',
    })
  };

  const handleDeleteExpense = async(expenseId) => {
    if (window.confirm('정말로 이 항목을 삭제하시겠어요??')) {
      deleteExpense(id, expenseId)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.feedbackContainer}>
        <Loader className={styles.spinner}/>
        <p>예산 정보를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.feedbackContainer}>
        <TriangleAlert color="#e74c3c"/>
        <p>오류가 발생했어요: {error.message}</p>
      </div>
    );
  }

  if (!selectedBudget) {
    return (
      <div className={styles.feedbackContainer}>
        <TriangleAlert color="#e74c3c"/>
        <p>해당 예산 정보를 찾을 수 없습니다.</p>
      </div>      
    )
  }

  const totalExpenses = selectedBudget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = selectedBudget.totalBudget - totalExpenses;
  const spentPercentage = selectedBudget.totalBudget > 0 ? (totalExpenses / selectedBudget.totalBudget) * 100 : 0;

  return (
    <div className={styles.detailContainer}>
      <header className={styles.header}>
        <div>
          <h1>{selectedBudget.title}</h1>
          <div className={styles.budgetSummary}>
            <p>총 예산: <span>{formatCurrency(selectedBudget.totalBudget, selectedBudget.currency, rates)}</span></p>
            <p>총 지출: <span>{formatCurrency(totalExpenses, selectedBudget.currency, rates)}</span></p>
            <p className={styles.remaining}>남은 예산: <span>{formatCurrency(remainingBudget, selectedBudget.currency, rates)} </span></p>
          </div>
        </div>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={16}/> 대시보드로 돌아가기
        </Link>
      </header>

      <div className={styles.progressBarContainer}>
        <div 
          className={styles.progressBarFill}
          style={{ width: `${spentPercentage}%`}}
        />
      </div>


      <main className={styles.mainContent}>
        <section className={styles.expenseFormSection}>
          <h2><PlusCircle size={20}/> 지출 내역 추가</h2>
          <form onSubmit={handleAddExpense} className={styles.expenseForm}>
            <input type="text" name="description" placeholder="지출 내역" value={newExpense.description} onChange={handleInputChange} />
            <input type="number" name="amount" placeholder="금액" value={newExpense.amount} onChange={handleInputChange}/>
            <button type="submit">추가</button>
          </form>
        </section>
        <section>
          <h2>지출 내역 목록</h2>
          {selectedBudget.expenses.length > 0 ? (
            <div className={styles.expenseList}>
              {selectedBudget.expenses.map((expense) => (
                <div key={expense._id} className={styles.expenseItem}>
                  <span>{expense.description}</span>
                  <span className={styles.expenseAmount}>{formatCurrency(expense.amount, selectedBudget.currency, rates)}</span>
                  <button onClick={() => handleDeleteExpense(expense._id)}><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          ) : (
            <p>아직 등록된 지출 내역이 없습니다.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default BudgetDetail;

