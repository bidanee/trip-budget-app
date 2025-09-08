import { create } from "zustand"
import { createBudget, fetchBudgets, deleteBudget, updateBudget, fetchBudgetById, addExpense, deleteExpense } from "../api"


const useBudgetStore = create((set,get) => ({
  budgets:[],
  selectedBudget: null,
  isLoading: false,
  error: null,

  // 목록가져오기
  getBudgets: async() => {
    set({isLoading: true, error: null});
    try{
      const {data} = await fetchBudgets();
      set({budgets: data, isLoading:false});
    } catch(error) {
      set({error, isLoading:false});
      console.error('예산 목록 로딩 실패', error);
    }
  },

  // 예산 생성
  addBudget: async(budgetData) => {
    set({isLoading: true, error: null});
    try{
      const {data: newData} = await createBudget(budgetData);
      set((state) => ({
        budgets: [...state.budgets, newData],
        isLoading: false
      }));
    } catch(error) {
      set({error, isLoading:false});
      console.error('예산 목록 생성 실패 ', error);
    }
  },

  // 예산 삭제
  deleteBudget: async(id) => {
    if(!window.confirm('정말로 이 예산 계획을 삭제하시겠어요??')) return;
    set({isLoading: true, error: null});
    try{
      await deleteBudget(id);
      set((state) => ({
        budgets: state.budgets.filter((budget) => budget._id !== id),
        isLoading:false
      }));
    } catch (error) {
      set({error, isLoading:false})
      console.error('예산 계획 삭제 실패', error);
    }
  },

  // 예산 수정
  updateBudget: async(id, updatedData) => {
    set({isLoading:true, error: null});
    try{
      const {data: updatedBudget} = await updateBudget(id, updatedData);
      set((state) => ({
        budgets: state.budgets.map((budget) => budget._id === id ? updatedBudget : budget),
        isLoading:false
      }));
    } catch (error) {
      set({error, isLoading: false});
      console.error('예산 수정 실패', error);
      // 에러 발생해도 원래 목록 다시 불러옴 -> UI 안정적으로 유지 위해
      get().getBudgets();
    }
  },

  // 단일 예산 조회
  getBudgetById: async (id) => {
    set({isLoading: true, error: null});
    try {
      const { data } = await fetchBudgetById(id);
      set({ selectedBudget: data, isLoading: false });
    } catch(error) {
      set({error, isLoading: false});
      console.error('예산 조회 실패', error);
    }
  },

  addExpense: async (budgetId, newExpenseData) => {
    try{
      const { data: updatedBudget} = await addExpense(budgetId, newExpenseData);
      set({selectedBudget: updatedBudget});
    } catch (error) {
      console.error('지출 항목 추가 실패', error);
      // todo : 에러 알림 모달? 알람?
    }
  },

  deleteExpense: async (budgetId, expenseId) => {
    try {
      const {data: updatedBudget} = await deleteExpense(budgetId, expenseId);
      set ({selectedBudget: updatedBudget});
    } catch (error) {
      console.error('지출 항목 삭제 실패', error);
      // todo : 에러 알림
    }
  }

}));

export default useBudgetStore;