import { useParams, Link } from "react-router-dom";
import useBudgetStore from "../store/budgetStore";
import { useEffect, useState, useRef } from "react";
import {
  Loader,
  TriangleAlert,
  ArrowLeft,
  Trash2,
  PlusCircle,
  Edit,
  Save,
  XCircle,
} from "lucide-react";
import styles from "./BudgetDetail.module.css";
import { toast } from "react-hot-toast";
import useExchangeStore from "../store/exchangeStore";
import { formatCurrency } from "../utils/formatCurrency";
import ExpenseChart from "./ExpenseChart";

const percentageLevel = (percentage) => {
  if (percentage >= 100) return 100;
  if (percentage >= 90) return 90;
  if (percentage >= 70) return 70;
  return 0; // 경고 없음
};

const BudgetDetail = () => {
  const { id } = useParams();
  const {
    selectedBudget,
    isLoading,
    error,
    getBudgetById,
    addExpense,
    deleteExpense,
    updateExpense,
  } = useBudgetStore((state) => state);
  const rates = useExchangeStore((state) => state.rates);

  const [newExpense, setNewExpense] = useState({
    category: "기타",
    description: "",
    amount: "",
  });

  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editingExpenseData, setEditingExpenseData] = useState({
    category: "",
    description: "",
    amount: "",
  });

  // ✅ 알림 레벨 캐시 (0, 70, 90, 100)
  const prevAlertLevel = useRef(0);

  useEffect(() => {
    if (id) getBudgetById(id);
  }, [id, getBudgetById]);

  // 안전 계산 (selectedBudget 없어도 0으로)
  const totalExpenses =
    selectedBudget?.expenses?.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    ) ?? 0;

  const totalBudget = Number(selectedBudget?.totalBudget ?? 0);
  const remainingBudget = totalBudget - totalExpenses;
  const spentPercentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  // ✅ 예산(plan) 전환 시: 현재 퍼센트 구간을 기준점으로 세팅 (초기 진입 알림 방지)
  useEffect(() => {
    if (isLoading) return;
    if (!selectedBudget || selectedBudget._id !== id) return;
    prevAlertLevel.current = percentageLevel(spentPercentage);
  }, [selectedBudget?._id, id, isLoading]); // plan 바뀔 때만 기준 재설정

  // ✅ 퍼센트 변동 시: 내려가면 기준도 내리고, 올라갈 때만 알림 발사
  useEffect(() => {
    if (isLoading) return;
    if (!selectedBudget || selectedBudget._id !== id) return;

    const level = percentageLevel(spentPercentage);
    const prev = prevAlertLevel.current ?? 0;

    // 하락: 기준점 같이 낮춤 (삭제 후 다시 추가 시 재알림 가능)
    if (level < prev) {
      prevAlertLevel.current = level;
      return;
    }

    // 상승: 새 구간에 들어섰을 때만 알림
    if (level > prev) {
      if (level === 100) {
        toast.error("예산을 초과했습니다!");
      } else if (level === 90) {
        toast.error("예산의 90% 이상을 사용했습니다!");
      } else if (level === 70) {
        toast("예산의 70% 이상을 사용 중입니다.", {
          icon: "⚠️",
          style: { background: "#fffbe6", color: "#a87c00" },
        });
      }
      prevAlertLevel.current = level;
    }
  }, [spentPercentage, isLoading, selectedBudget?._id, id]);

  // 이벤트 핸들러들
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.description.trim() || !String(newExpense.amount).trim()) {
      return toast.error("모든 항목을 입력해주세요.");
    }
    await addExpense(id, { ...newExpense, amount: Number(newExpense.amount) });
    setNewExpense({ category: "기타", description: "", amount: "" });
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm("정말로 이 항목을 삭제하시겠어요??")) {
      deleteExpense(id, expenseId);
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpenseId(expense._id);
    setEditingExpenseData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateExpense = async (expenseId) => {
    if (!editingExpenseData.description.trim()) {
      return toast.error("내역을 입력해주세요.");
    }
    if (editingExpenseData.amount === "" || editingExpenseData.amount == null) {
      return toast.error("금액을 입력해주세요.");
    }
    await updateExpense(id, expenseId, {
      ...editingExpenseData,
      amount: Number(editingExpenseData.amount),
    });
    setEditingExpenseId(null);
  };

  // UI 조건부 렌더링
  if (isLoading) {
    return (
      <div className={styles.feedbackContainer}>
        <Loader className={styles.spinner} />
        <p>예산 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.feedbackContainer}>
        <TriangleAlert color="#e74c3c" />
        <p>오류가 발생했어요: {error.message}</p>
      </div>
    );
  }

  if (!selectedBudget) {
    return (
      <div className={styles.feedbackContainer}>
        <TriangleAlert color="#e74c3c" />
        <p>해당 예산 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div className={styles.detailContainer}>
      <header className={styles.header}>
        <div>
          <h1>{selectedBudget.title}</h1>
          <div className={styles.budgetSummary}>
            <p>
              총 예산:{" "}
              <span>
                {formatCurrency(
                  selectedBudget.totalBudget,
                  selectedBudget.currency,
                  rates
                )}
              </span>
            </p>
            <p>
              총 지출:{" "}
              <span>
                {formatCurrency(
                  totalExpenses,
                  selectedBudget.currency,
                  rates
                )}
              </span>
            </p>
            <p className={styles.remaining}>
              남은 예산:{" "}
              <span>
                {formatCurrency(
                  remainingBudget,
                  selectedBudget.currency,
                  rates
                )}
              </span>
            </p>
          </div>
        </div>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={16} /> 대시보드로 돌아가기
        </Link>
      </header>

      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${spentPercentage}%` }}
        />
      </div>

      <main className={styles.mainContent}>
        <ExpenseChart
          expenses={selectedBudget.expenses}
          currency={selectedBudget.currency}
          rates={rates}
        />

        {/* 지출 추가 */}
        <section className={styles.expenseFormSection}>
          <h2>
            <PlusCircle size={20} /> 지출 내역 추가
          </h2>
          <form onSubmit={handleAddExpense} className={styles.expenseForm}>
            <select
              name="category"
              value={newExpense.category}
              onChange={handleInputChange}
              className={styles.categorySelect}
            >
              <option value="식비">🍔 식비</option>
              <option value="교통">🚌 교통</option>
              <option value="숙소">🏠 숙소</option>
              <option value="쇼핑">🛍️ 쇼핑</option>
              <option value="관광">🗼 관광</option>
              <option value="기타">📎 기타</option>
            </select>
            <input
              type="text"
              name="description"
              placeholder="지출 내역"
              value={newExpense.description}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="amount"
              placeholder="금액"
              value={newExpense.amount}
              onChange={handleInputChange}
            />
            <button type="submit">추가</button>
          </form>
        </section>

        {/* 지출 목록 */}
        <section>
          <h2>지출 내역 목록</h2>
          {selectedBudget.expenses.length > 0 ? (
            <div className={styles.expenseList}>
              {selectedBudget.expenses.map((expense) => (
                <div key={expense._id} className={styles.expenseItem}>
                  {editingExpenseId === expense._id ? (
                    <div className={styles.expenseEditForm}>
                      <select
                        name="category"
                        value={editingExpenseData.category}
                        onChange={handleEditChange}
                      >
                        <option value="식비">🍔 식비</option>
                        <option value="교통">🚌 교통</option>
                        <option value="숙소">🏠 숙소</option>
                        <option value="쇼핑">🛍️ 쇼핑</option>
                        <option value="관광">🗼 관광</option>
                        <option value="기타">📎 기타</option>
                      </select>
                      <input
                        type="text"
                        name="description"
                        value={editingExpenseData.description}
                        onChange={handleEditChange}
                      />
                      <input
                        type="number"
                        name="amount"
                        value={editingExpenseData.amount}
                        onChange={handleEditChange}
                      />
                      <button onClick={() => handleUpdateExpense(expense._id)}>
                        <Save size={16} />
                      </button>
                      <button onClick={() => setEditingExpenseId(null)}>
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={styles.expenseDetails}>
                        <span className={styles.expenseCategory}>
                          {expense.category}
                        </span>
                        <span className={styles.expenseDescription}>
                          {expense.description}
                        </span>
                      </div>
                      <span className={styles.expenseAmount}>
                        {formatCurrency(
                          expense.amount,
                          selectedBudget.currency,
                          rates
                        )}
                      </span>
                      <div className={styles.expenseActions}>
                        <button onClick={() => handleEditClick(expense)}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteExpense(expense._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
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
