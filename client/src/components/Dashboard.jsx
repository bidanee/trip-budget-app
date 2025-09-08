import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useBudgetStore from '../store/budgetStore'
import { PiggyBank, PlusCircle, Loader,TriangleAlert, Trash2, Edit, Save, XCircle } from 'lucide-react';
import styles from './Dashboard.module.css';



const Dashboard = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const {budgets, isLoading, error, getBudgets, addBudget, deleteBudget,updateBudget} = useBudgetStore();
  // 새 예산
  const [newBudgetData, setNewBudgetData] = useState({
    title: '', 
    totalBudget: '',
    currency: 'KRW',
  })
  // 수정 예산
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [editingData,setEditingData] = useState({
    title: '',
    totalBudget:'',
    currency:''
  })

  useEffect(() => {
    if(token) {
      getBudgets();
    }
  },[token,getBudgets]);
  
    const handleLogout = () => {
    logout();
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setNewBudgetData((prev) => ({...prev, [name]:value}));
  }

  const handleAddBudget = async(e) => {
    e.preventDefault();
    if(!newBudgetData.title || !newBudgetData.totalBudget) {
      alert('제목과 총 예산을 모두 입력해주세요');
      return;
    }
    await addBudget(newBudgetData);
    setNewBudgetData({title: '', totalBudget: '', currency: 'KRW'});
  };

  const handleEditClick = (e, budget) =>{
    e.preventDefault();
    // 이벤트 버블링 방지
    e.stopPropagation();
    setEditingBudgetId(budget._id);
    setEditingData({title:budget.title, totalBudget:budget.totalBudget, currency:budget.currency});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({ ...prev, [name]: value }));
  }
  

  const handleUpdateBudget = async(id) => {
    if(!editingData.title || !editingData.totalBudget) {
      alert('제목과 총 예산을 모두 입력해주세요');
      return;
    }
    await updateBudget(id, editingData);
    setEditingBudgetId(null);
  } 

  const handleDeleteBudget = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    deleteBudget(id)
  }

  const renderBudgetList = () => {
    // 로딩중
    if (isLoading && budgets.length === 0){
      return(
        <div className={styles.feedbackContainer}>
          <Loader className={styles.spinner} />
          <p>목록을 불러오는 중입니다...</p>
        </div>
      );
    }
    // 에러 발생
    if (error) {
      return (
        <div className={styles.feedbackContainer}>
          <TriangleAlert color='#e74c3c' />
          <p>오류가 발생했어요: {error.message}</p>
        </div>
      );
    }
    // 아무것도 없을때
    if (budgets.length === 0){
      return <p>아직 작성된 예산 계획이 없어요. 새계획을 추가해보세요!</p>
    }
    // 목록 있을때
    return(
      <div className={styles.budgetList}>
        {budgets.map((budget) => (
          <Link key={budget._id} to={`/budget/${budget._id}`} className={styles.budgetItemLink}>
            <div className={styles.budgetItem}>
              {editingBudgetId === budget._id ? (
                <div className={styles.editForm} onClick={(e)=> {e.preventDefault(); e.stopPropagation()}}>
                  <input type='text' name='title' value={editingData.title} onChange={handleEditChange} />
                  <input type='number' name='totalBudget' value={editingData.totalBudget} onChange={handleEditChange} />
                  <select name='currency' value={editingData.currency} onChange={handleEditChange}>
                    <option value='KRW'>🇰🇷 KRW</option>
                    <option value='JPY'>🇯🇵 JPY</option>
                    <option value='USD'>🇺🇸 USD</option>
                    <option value='EUR'>🇪🇺 EUR</option>
                  </select>
                  <div className={styles.editActions}>
                    <button onClick={() => handleUpdateBudget(budget._id)}><Save size={18}/></button>
                    <button onClick={() => setEditingBudgetId(null)}><XCircle size={18}/></button>
                  </div>
                </div>
              ):(
                <>
                  <div className={styles.budgetItemContent}>
                    <h3>{budget.title}</h3>
                    <p>
                      총 예산: {Number(budget.totalBudget).toLocaleString()} {budget.currency}
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <button onClick={(e) => handleEditClick(e,budget)}><Edit size={18}/></button>
                    <button onClick={(e) => handleDeleteBudget(e,budget._id) }><Trash2 size={18}/></button>
                  </div>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>
          <PiggyBank size={32} color='#ff8c94'/> 
          <p>Trip Budget App</p>
          <PiggyBank size={32} color='#ff8c94'/>
        </h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          로그아웃
        </button>
      </header>
      
      <main>
        {/* 예산 추가 */}
        <section className={styles.formSection}>
          <h2>
            <PlusCircle size={32} color='#ff8c94'/> 예산 계획 추가
          </h2>
          <form onSubmit={handleAddBudget} className={styles.addForm}>
            <input type='text' name='title' placeholder='제목' value={newBudgetData.title} onChange={handleInputChange}/>
            <input type='number' name='totalBudget' placeholder='총 예산(숫자만 입력 가능)' value={newBudgetData.totalBudget} onChange={handleInputChange}/>
            <select name='currency' value={newBudgetData.currency} onChange={handleInputChange}>
              <option value='KRW'>🇰🇷 KRW</option>
              <option value='JPY'>🇯🇵 JPY</option>
              <option value='USD'>🇺🇸 USD</option>
              <option value='EUR'>🇪🇺 EUR</option>
            </select>
            <button type='submit' disabled={isLoading}>
              {isLoading ? '추가 중...' : '추가하기'}
            </button>
          </form>
        </section>
        <section className={styles.listSection}>
          <h2>예산 계획 목록</h2>
          {renderBudgetList()}
        </section>
      </main>
    </div>
  )
}

export default Dashboard;